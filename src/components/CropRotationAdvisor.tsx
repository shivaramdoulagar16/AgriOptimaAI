import React, { useState } from 'react';
import { RefreshCw, ArrowRight, CheckCircle2, ShieldCheck, Sprout, Info } from 'lucide-react';
import { Farm, OptimizationResult } from '../types/index.ts';

interface CropRotationAdvisorProps {
  farm: Farm;
  optimization: OptimizationResult | null;
}

export const CropRotationAdvisor: React.FC<CropRotationAdvisorProps> = ({
  farm,
  optimization
}) => {
  const currentAllocatedCrops = optimization?.allocations.map(a => a.crop_name) || ['Wheat', 'Potato'];
  const [previousCrop, setPreviousCrop] = useState<string>('Rice (Paddy)');

  const getNextRotationRecommendation = (prev: string, current: string[]) => {
    const isPaddyWheat = prev.includes('Rice') || current.includes('Wheat');
    const isCotton = current.includes('Cotton');

    if (isPaddyWheat) {
      return {
        nextSeason: {
          season: farm.season === 'Kharif' ? 'Rabi / Zaid' : 'Kharif',
          recommended: 'Chickpea (Gram) or Green Gram (Moong)',
          family: 'Leguminosae (Nitrogen-Fixing Pulses)',
          agronomicReason: 'Breaks cereal monoculture pest cycles and biologically fixes ~35–50 kg N/ha into the soil.'
        },
        followingSeason: {
          season: farm.season === 'Kharif' ? 'Next Kharif' : 'Next Rabi',
          recommended: 'Maize (Corn) or Mustard',
          family: 'Gramineae / Brassicaceae',
          agronomicReason: 'Utilizes fixed nitrogen reserves; deep root architecture loosens subsoil hardpan.'
        }
      };
    }

    if (isCotton) {
      return {
        nextSeason: {
          season: 'Rabi',
          recommended: 'Wheat or Mustard',
          family: 'Poaceae / Brassicaceae',
          agronomicReason: 'Replaces deep taproot feeder with shallow fibrous roots, preserving deep soil moisture.'
        },
        followingSeason: {
          season: 'Next Kharif',
          recommended: 'Soybean or Pulses',
          family: 'Legumes',
          agronomicReason: 'Restores organic nitrogen and soil organic matter depleted by cotton.'
        }
      };
    }

    return {
      nextSeason: {
        season: farm.season === 'Kharif' ? 'Rabi' : 'Kharif',
        recommended: 'Soybean or Chickpea',
        family: 'Leguminous Cover Crop',
        agronomicReason: 'Replenishes soil nitrogen and suppresses soil-borne fungal pathogens.'
      },
      followingSeason: {
        season: 'Following Year',
        recommended: 'Millets or Maize',
        family: 'Coarse Cereals',
        agronomicReason: 'High drought resilience and excellent biomass carbon sequestration.'
      }
    };
  };

  const rotation = getNextRotationRecommendation(previousCrop, currentAllocatedCrops);

  return (
    <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0ea] gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="h-4 w-4 text-[#1b4324]" />
            <h3 className="font-bold text-base text-[#1a1e1b]">Crop Rotation Advisor (Soil Longevity)</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf4ed] text-[#1b4324] border border-[#cbe1ca]">
              Agronomic Science
            </span>
          </div>
          <p className="text-xs text-[#6b736c] mt-0.5">
            Optimize season-over-season rotations to break pest lifecycles, fix nitrogen, and preserve soil organic matter.
          </p>
        </div>

        {/* Previous Crop Selector */}
        <div className="flex items-center space-x-2 bg-[#f6f7f4] border border-[#dce0d8] rounded-lg px-2.5 py-1 text-xs">
          <span className="text-[#5c645d] text-[11px]">Previous Crop:</span>
          <select
            value={previousCrop}
            onChange={(e) => setPreviousCrop(e.target.value)}
            className="bg-transparent font-semibold text-[#1a1e1b] focus:outline-hidden cursor-pointer"
          >
            <option value="Rice (Paddy)">Rice (Paddy)</option>
            <option value="Wheat">Wheat</option>
            <option value="Cotton">Cotton</option>
            <option value="Soybean">Soybean / Pulses</option>
            <option value="Fallow">Fallow / Pasture</option>
          </select>
        </div>
      </div>

      {/* 3-Season Rotation Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Current Season */}
        <div className="p-4 bg-[#fafbf9] rounded-xl border border-[#e5e8e1] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757d74]">
                1. CURRENT SEASON ({farm.season})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f0f4ee] text-[#1b4324] border border-[#d6e3d3]">
                Active Plan
              </span>
            </div>
            <h4 className="font-bold text-sm text-[#1a1e1b] mb-1">
              {currentAllocatedCrops.slice(0, 2).join(' + ')}
            </h4>
            <p className="text-[11px] text-[#5c645d] leading-relaxed mb-3">
              Allocated under current optimal LP plan. Consuming seasonal NPK & aquifer reserves.
            </p>
          </div>
          <div className="pt-2 border-t border-[#edf0ea] text-[10px] text-[#757d74]">
            Preceded by: <b>{previousCrop}</b>
          </div>
        </div>

        {/* Step 2: Next Season */}
        <div className="p-4 bg-[#f8faf7] rounded-xl border-2 border-[#1b4324] flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1b4324]">
                2. NEXT SEASON ({rotation.nextSeason.season})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1b4324] text-white">
                AI Recommended
              </span>
            </div>
            <h4 className="font-bold text-sm text-[#1a1e1b] mb-0.5">
              {rotation.nextSeason.recommended}
            </h4>
            <span className="text-[10px] text-[#5c645d] font-medium block mb-2">
              {rotation.nextSeason.family}
            </span>
            <p className="text-[11px] text-[#324b37] leading-relaxed">
              {rotation.nextSeason.agronomicReason}
            </p>
          </div>
          <div className="pt-2 border-t border-[#d6e3d3] text-[10px] text-[#1b4324] font-semibold flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Optimal Biological Continuity</span>
          </div>
        </div>

        {/* Step 3: Following Season */}
        <div className="p-4 bg-[#fafbf9] rounded-xl border border-[#e5e8e1] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#757d74]">
                3. FOLLOWING SEASON ({rotation.followingSeason.season})
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f4f6f2] text-[#3d453e] border border-[#e0e3dd]">
                Long-Term
              </span>
            </div>
            <h4 className="font-bold text-sm text-[#1a1e1b] mb-0.5">
              {rotation.followingSeason.recommended}
            </h4>
            <span className="text-[10px] text-[#5c645d] font-medium block mb-2">
              {rotation.followingSeason.family}
            </span>
            <p className="text-[11px] text-[#5c645d] leading-relaxed">
              {rotation.followingSeason.agronomicReason}
            </p>
          </div>
          <div className="pt-2 border-t border-[#edf0ea] text-[10px] text-[#757d74]">
            Maintains continuous multi-year yield stability.
          </div>
        </div>
      </div>
    </div>
  );
};
