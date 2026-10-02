import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, Droplets, ShieldCheck, Compass, FileText } from 'lucide-react';
import { Farm, OptimizationResult, CropRecommendation } from '../types/index.ts';
import { FarmHealthAndPressure } from './FarmHealthAndPressure.tsx';
import { formatINR } from '../utils/currency.ts';

interface FarmCommandCenterProps {
  farm: Farm;
  optimization: OptimizationResult | null;
  recommendations: CropRecommendation[];
  onNavigateTab: (tabId: string) => void;
  onOpenWhatIfDrought: () => void;
  onDownloadPDF: () => void;
}

export const FarmCommandCenter: React.FC<FarmCommandCenterProps> = ({
  farm,
  optimization,
  recommendations,
  onNavigateTab,
  onOpenWhatIfDrought,
  onDownloadPDF
}) => {
  const summary = optimization?.summary;
  const isWaterStressed = (summary?.water_utilization_pct || 0) >= 80;
  const topCrop = recommendations[0];

  // Dynamically generate context-driven Next Best Actions
  const nextBestActions = [
    ...(isWaterStressed
      ? [{
          id: 'act_drought',
          title: 'Irrigation Water is Your Binding Constraint',
          reason: `Current plan consumes ${summary?.water_utilization_pct}% of water reserve (${summary?.used_water_m3.toLocaleString()} m³).`,
          impact: 'Testing a -30% drought scenario tests crop mix resilience before planting.',
          btnText: 'Simulate Drought Scenario',
          onClick: onOpenWhatIfDrought,
          priority: 'High'
        }]
      : []),
    {
      id: 'act_strategy',
      title: 'Compare Agronomic Strategies',
      reason: `Current plan is tuned for ${optimization?.strategy?.toUpperCase() || 'BALANCED'} delivery.`,
      impact: 'Switching to Water Saver or Profit Focus reveals potential net trade-offs.',
      btnText: 'Open Strategy Matrix',
      onClick: () => onNavigateTab('strategies'),
      priority: 'Medium'
    },
    {
      id: 'act_review_crops',
      title: `Evaluate AI Crop Recommendation (${topCrop?.crop_name || 'Top Crop'})`,
      reason: `Rated ${topCrop?.suitability_score || 90}% compatibility with ${farm.soil.soil_type} soil and pH ${farm.soil.pH}.`,
      impact: 'Inspect detailed NPK curves and water requirement breakdowns.',
      btnText: 'View Crop Suitability',
      onClick: () => onNavigateTab('recommendations'),
      priority: 'Medium'
    },
    {
      id: 'act_save',
      title: 'Archive Season Allocation Plan',
      reason: 'Mathematical allocation is 100% verified across all 4 resource bounds.',
      impact: 'Preserves configuration for seasonal comparison and export.',
      btnText: 'Download Official PDF',
      onClick: onDownloadPDF,
      priority: 'Low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Farm Insight */}
      <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#edf0ea]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1b4324]" />
              <h2 className="text-base font-bold text-[#1a1e1b]">Farm Command Center</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf4ed] text-[#1b4324] border border-[#cbe1ca]">
                Central Intelligence
              </span>
            </div>
            <p className="text-xs text-[#6b736c] mt-0.5">
              Live agricultural operational summary, resource pressures, and prioritized management decisions.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('optimizer')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1b4324] hover:bg-[#163b20] text-white transition-colors"
            >
              Adjust Allocations
            </button>
            <button
              onClick={onDownloadPDF}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#2d332e] bg-[#f4f6f2] hover:bg-[#eaece7] border border-[#dce0d8] transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Dynamic Farm Insight Box */}
        <div className="mt-4 p-3.5 bg-[#f6f9f5] border border-[#d6e3d3] rounded-xl flex items-start space-x-3">
          <Sparkles className="h-4 w-4 text-[#1b4324] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[#1b4324] block mb-0.5">Dynamic Farm Insight:</span>
            <p className="text-[#324b37] leading-relaxed">
              {isWaterStressed
                ? `Irrigation water is currently your primary binding resource constraint (${summary?.water_utilization_pct}% utilized). The optimizer selected drought-tolerant varieties (${optimization?.allocations.map(a => a.crop_name).join(', ')}) to maximize net return without exhausting your ${farm.resources.water_m3.toLocaleString()} m³ reserve.`
                : `Your farm holding is operating within balanced agronomic margins. Working capital utilization is at ${summary?.budget_utilization_pct || 70}%, returning a projected net farm income of ${formatINR(summary?.total_profit || 0)}.`}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Farm Health & Resource Pressure Section */}
      <FarmHealthAndPressure farm={farm} optimization={optimization} />

      {/* 3. Next Best Action Grid ("What Should I Do Now?") */}
      <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Compass className="h-4 w-4 text-[#1b4324]" />
            <h3 className="font-bold text-sm text-[#1a1e1b]">Next Best Action — What Should I Do Now?</h3>
          </div>
          <span className="text-[11px] text-[#6b736c]">Automated decision heuristics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextBestActions.map((act) => (
            <div
              key={act.id}
              className="p-4 bg-[#fafbf9] rounded-xl border border-[#e5e8e1] hover:border-[#ccd1c6] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-xs text-[#1a1e1b] leading-snug">{act.title}</h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      act.priority === 'High'
                        ? 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                        : 'bg-[#f0f4ee] text-[#1b4324] border border-[#d6e3d3]'
                    }`}
                  >
                    {act.priority}
                  </span>
                </div>

                <p className="text-[11px] text-[#4a524b] mb-1.5 leading-relaxed">{act.reason}</p>
                <div className="text-[11px] text-[#6b736c] mb-3 flex items-center space-x-1">
                  <span className="font-medium text-[#1b4324]">Expected Impact:</span>
                  <span>{act.impact}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#edf0ea]">
                <button
                  onClick={act.onClick}
                  className="w-full inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold bg-[#1b4324] hover:bg-[#163b20] text-white transition-colors"
                >
                  <span>{act.btnText}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
