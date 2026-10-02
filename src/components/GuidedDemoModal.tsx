import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, Check, Droplets, Play, ShieldAlert } from 'lucide-react';
import { Farm, OptimizationResult } from '../types/index.ts';
import { formatINR } from '../utils/currency.ts';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onTriggerDroughtWOW: () => Promise<void>;
  farm: Farm;
  optimization: OptimizationResult | null;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerDroughtWOW,
  farm,
  optimization
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [droughtSimulating, setDroughtSimulating] = useState<boolean>(false);
  const [droughtResultShown, setDroughtResultShown] = useState<boolean>(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Farm Holding Baseline',
      tab: 'overview',
      subtitle: 'Real Physical Bounds & Resource Budgets',
      description: `We begin with ${farm.name}: ${farm.land_area_ha} hectares of ${farm.soil.soil_type} soil, ${farm.resources.water_m3.toLocaleString()} m³ water reserve, and ${formatINR(farm.resources.budget_usd)} capital. Notice the 4 simultaneous mathematical bounds.`,
      actionLabel: 'Inspect Farm Telemetry'
    },
    {
      title: '2. AI Crop Intelligence (ML)',
      tab: 'recommendations',
      subtitle: 'Multi-Crop Agronomic Suitability Classification',
      description: 'Our Random Forest classifier (80.8% test accuracy across 12 ICAR benchmark crops) evaluates soil pH, NPK nutrients, temperature, and seasonal rainfall to rank viable cultivars.',
      actionLabel: 'View Crop Rankings'
    },
    {
      title: '3. Simplex LP Mathematical Allocation',
      tab: 'optimizer',
      subtitle: 'Continuous Primal/Dual Simplex Optimization',
      description: `AgriOptima formulates an exact Linear Program to maximize net farm income (${formatINR(optimization?.summary.total_profit || 0)}) while guaranteeing zero breach across land, water, fertilizer, and cash constraints.`,
      actionLabel: 'Examine LP Solver Formulation'
    },
    {
      title: '4. The WOW Moment: Drought Shock (-40% Water)',
      tab: 'what_if',
      subtitle: 'Live Sensitivity Recalculation & Binding Constraint Shift',
      description: 'Click "Trigger Drought Scenario" below. Watch irrigation water drop by 40%. The solver re-runs instantaneously, shifting acreage from water-thirsty crops to drought-resilient varieties and explaining WHY the plan changed.',
      actionLabel: 'Trigger Drought Scenario'
    },
    {
      title: '5. Plan Resilience & Digital Twin',
      tab: 'digital_twin',
      subtitle: 'Spatial Parcel Verification & Stress Tolerance',
      description: 'Inspect the 2D field parcels. See how each sub-field handles crop requirements and verify that multi-crop diversification insulates the farmer from catastrophic defaults.',
      actionLabel: 'Inspect 2D Parcels'
    },
    {
      title: '6. Executive Decision Delivery & PDF',
      tab: 'overview',
      subtitle: 'Complete Decision Package for Farmers & Lenders',
      description: 'The final optimized plan provides actionable, bank-ready documentation with full algorithmic transparency, season-over-season crop rotation advice, and PDF export.',
      actionLabel: 'Finish 90s Demo'
    }
  ];

  const step = steps[currentStep];

  const handleNext = async () => {
    if (currentStep === 3 && !droughtResultShown) {
      setDroughtSimulating(true);
      await onTriggerDroughtWOW();
      setDroughtSimulating(false);
      setDroughtResultShown(true);
      onSelectTab('what_if');
      return;
    }

    if (currentStep < steps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      onSelectTab(steps[nextIdx].tab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      onSelectTab(steps[prevIdx].tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#e5e8e1] shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#757d74] hover:text-[#1a1e1b] p-1.5 rounded-lg hover:bg-[#f2f4f0] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#1b4324] text-white flex items-center justify-center shadow-xs">
            <Play className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-[#1a1e1b]">90-Second Guided Tour</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf4ed] text-[#1b4324] border border-[#cbe1ca]">
                Judge & Mentor Mode
              </span>
            </div>
            <p className="text-[11px] text-[#6b736c]">
              Step {currentStep + 1} of {steps.length}: {step.subtitle}
            </p>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#f0f2ed] rounded-full h-1.5 my-4 overflow-hidden">
          <div
            className="bg-[#1b4324] h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="space-y-3.5 my-4">
          <div className="p-4 bg-[#fafbf9] rounded-xl border border-[#e5e8e1]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b4324] block mb-1">
              {step.title}
            </span>
            <p className="text-xs text-[#3d453e] leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Special WOW Moment Explainer on Step 4 */}
          {currentStep === 3 && droughtResultShown && (
            <div className="p-3.5 bg-[#fefce8] border border-[#fef08a] rounded-xl text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center space-x-1.5 font-bold text-[#854d0e]">
                <Droplets className="h-4 w-4 text-[#d97706]" />
                <span>Why did the plan change? (Judge WOW Moment)</span>
              </div>
              <p className="text-[#713f12] text-[11px] leading-relaxed">
                Water dropped by 40%, immediately becoming the strict binding constraint. The LP simplex solver reduced water-intensive acreage and reallocated land to drought-resilient varieties to maintain mathematical feasibility!
              </p>
            </div>
          )}
        </div>

        {/* Step Nav Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#edf0ea]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5c645d] hover:bg-[#f2f4f0] disabled:opacity-30 transition-colors inline-flex items-center space-x-1"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={droughtSimulating}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1b4324] hover:bg-[#163b20] text-white transition-all inline-flex items-center space-x-1.5 shadow-xs"
          >
            <span>
              {droughtSimulating
                ? 'Solving Drought LP...'
                : currentStep === 3 && !droughtResultShown
                ? 'Trigger Drought Shock (-40%)'
                : currentStep === steps.length - 1
                ? 'Complete Demo'
                : 'Next Step'}
            </span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
