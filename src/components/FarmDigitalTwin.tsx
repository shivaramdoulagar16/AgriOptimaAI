import React, { useState } from 'react';
import { Layers, Droplets, Sprout, TrendingUp, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { Farm, OptimizationResult, CropAllocation } from '../types/index.ts';
import { CROP_THEMES } from '../utils/cropAssets.ts';
import { formatINR } from '../utils/currency.ts';
import { AgriImage } from './AgriImage.tsx';
import { CROP_IMAGES } from '../utils/cropAssets.ts';

interface FarmDigitalTwinProps {
  farm: Farm;
  optimization: OptimizationResult | null;
}

export const FarmDigitalTwin: React.FC<FarmDigitalTwinProps> = ({
  farm,
  optimization
}) => {
  const [selectedParcel, setSelectedParcel] = useState<CropAllocation | null>(null);

  const allocations = optimization?.allocations || [];
  const totalAllocatedHa = allocations.reduce((sum, a) => sum + a.allocated_ha, 0);
  const unallocatedHa = Math.max(0, Math.round((farm.land_area_ha - totalAllocatedHa) * 10) / 10);

  return (
    <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#edf0ea] gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b4324]" />
            <h3 className="font-bold text-base text-[#1a1e1b]">Farm Digital Twin (2D Field Parcels)</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf4ed] text-[#1b4324] border border-[#cbe1ca]">
              Live Spatial Model
            </span>
          </div>
          <p className="text-xs text-[#6b736c] mt-0.5">
            Click any field parcel to inspect agronomic metrics, water consumption, and projected profit.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#5c645d]">
          <span>Total Land: <b>{farm.land_area_ha} ha</b></span>
          <span>•</span>
          <span>Allocated: <b>{totalAllocatedHa} ha</b></span>
          {unallocatedHa > 0 && (
            <>
              <span>•</span>
              <span className="text-[#854d0e] font-semibold">Reserve: {unallocatedHa} ha</span>
            </>
          )}
        </div>
      </div>

      {/* Interactive 2D Field Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {allocations.map((alloc, idx) => {
          const theme = CROP_THEMES[alloc.crop_id.toLowerCase()] || {
            bg: '#f4f6f2',
            text: '#2d332e',
            border: '#e0e4dd',
            badge: 'bg-[#eef2ec] text-[#2d332e]'
          };
          const isSelected = selectedParcel?.crop_id === alloc.crop_id;
          const fieldNumber = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={alloc.crop_id}
              onClick={() => setSelectedParcel(alloc)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#1b4324] ring-2 ring-[#1b4324]/20 shadow-md bg-[#fafbf9]'
                  : 'border-[#e2e6de] hover:border-[#b8c2b5] bg-white hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#757d74]">
                    FIELD {fieldNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-black/5 ${theme.badge}`}>
                    {alloc.percentage_of_land}% Land
                  </span>
                </div>

                <div className="flex items-center space-x-3 my-2">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#e5e8e1]">
                    <AgriImage
                      src={CROP_IMAGES[alloc.crop_id.toLowerCase()]}
                      alt={alloc.crop_name}
                      cropKey={alloc.crop_id}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1a1e1b]">{alloc.crop_name}</h4>
                    <span className="text-xs text-[#5c645d]">{alloc.allocated_ha} Hectares</span>
                  </div>
                </div>

                {/* Metric Quick Look */}
                <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-t border-[#edf0ea] mt-2">
                  <div>
                    <span className="text-[#757d74] block text-[10px]">Harvest</span>
                    <span className="font-semibold text-[#1a1e1b]">{alloc.expected_production_tons} Tons</span>
                  </div>
                  <div>
                    <span className="text-[#757d74] block text-[10px]">Net Profit</span>
                    <span className="font-bold text-[#1b4324]">{formatINR(alloc.expected_profit)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-[#edf0ea] flex items-center justify-between text-[10px] text-[#1b4324] font-semibold">
                <span>Click for Field Deep-Dive</span>
                <span>→</span>
              </div>
            </div>
          );
        })}

        {/* Unallocated Reserve Parcel */}
        {unallocatedHa > 0 && (
          <div className="p-4 rounded-xl border border-dashed border-[#d1d5db] bg-[#fafbf9] flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9ca3af]">
                  RESERVE FIELD
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  Buffer / Fallow
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#4b5563] mt-2">Unallocated Fallow Land</h4>
              <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                {unallocatedHa} hectares preserved as ecological cover or pasture to prevent over-fertilization and conserve water.
              </p>
            </div>
            <span className="text-[10px] text-[#9ca3af] mt-3">Feasibility Buffer</span>
          </div>
        )}
      </div>

      {/* Selected Parcel Deep-Dive Drawer / Panel */}
      {selectedParcel && (
        <div className="p-4 bg-[#f8faf7] rounded-xl border border-[#cde0cb] relative animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedParcel(null)}
            className="absolute top-3 right-3 text-[#6b736c] hover:text-[#1a1e1b] p-1"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#1b4324]" />
            <h4 className="font-bold text-xs text-[#1b4324] uppercase tracking-wider">
              Field Specification: {selectedParcel.crop_name}
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Allocated Area</span>
              <span className="font-bold text-[#1a1e1b]">{selectedParcel.allocated_ha} ha</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Expected Yield</span>
              <span className="font-bold text-[#1a1e1b]">{selectedParcel.expected_production_tons} Tons</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Water Needed</span>
              <span className="font-bold text-[#1a1e1b]">{selectedParcel.water_used_m3.toLocaleString()} m³</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Fertilizer (NPK)</span>
              <span className="font-bold text-[#1a1e1b]">{selectedParcel.fertilizer_used_kg.toLocaleString()} kg</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Cultivation Cost</span>
              <span className="font-bold text-[#1a1e1b]">{formatINR(selectedParcel.cultivation_cost)}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Projected Profit</span>
              <span className="font-bold text-[#1b4324]">{formatINR(selectedParcel.expected_profit)}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#e5e8e1]">
              <span className="text-[10px] text-[#757d74] block">Margin</span>
              <span className="font-bold text-[#1b4324]">
                {selectedParcel.cultivation_cost > 0
                  ? Math.round((selectedParcel.expected_profit / selectedParcel.cultivation_cost) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
