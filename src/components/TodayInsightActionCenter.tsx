import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Sliders, Droplets, Bookmark, Layers } from 'lucide-react';
import { Farm, OptimizationResult, CropRecommendation } from '../types/index.ts';

interface TodayInsightActionCenterProps {
  farm: Farm;
  optimization: OptimizationResult | null;
  recommendations: CropRecommendation[];
  onNavigateTab: (tabId: string) => void;
}

export const TodayInsightActionCenter: React.FC<TodayInsightActionCenterProps> = ({
  farm,
  optimization,
  recommendations,
  onNavigateTab
}) => {
  const summary = optimization?.summary;
  const topCrop = recommendations.length > 0 ? recommendations[0] : null;

  // Generate dynamic grounded insight
  const waterPct = summary ? summary.water_utilization_pct : 75;
  let dynamicInsight = '';
  let insightWhy = '';

  if (waterPct >= 85) {
    dynamicInsight = `Water is currently your primary operational constraint (${waterPct}% deployed). The optimized plan prioritizes high water-efficiency varieties while maintaining expected net profitability.`;
    insightWhy = `Canal capacity limits prevent allocating 100% of acreage to thirsty cash crops. The LP solver automatically partitioned your land to preserve aquifer stability.`;
  } else if (farm.soil.pH < 6.2 || farm.soil.pH > 7.4) {
    dynamicInsight = `Soil reaction (pH ${farm.soil.pH}) is slightly outside neutral buffer. AI filtered candidates to prioritize crops with proven tolerance to avoid micronutrient lock-up.`;
    insightWhy = `Extreme pH restricts phosphorus and zinc availability; the selected crop mix exhibits high tolerance curves for your specific soil profile.`;
  } else {
    dynamicInsight = `Balanced agro-climatic conditions: Available working capital and irrigation volume support a diversified multi-parcel plan across ${optimization?.allocations.length || 2} distinct varieties.`;
    insightWhy = `Co-planting balances high-margin vegetables with drought-hardy staples to hedge against mandi wholesale price shocks.`;
  }

  // Prioritized 4 actionable steps
  const actions = [
    {
      num: 1,
      title: 'Review Hydrological Allocation',
      desc: `Check ${summary?.used_water_m3.toLocaleString() || 0} m³ demand against seasonal irrigation quotas.`,
      tab: 'optimizer',
      btnLabel: 'Inspect Allocation'
    },
    {
      num: 2,
      title: 'Compare Water-Saving Strategy',
      desc: 'Evaluate the eco-resilient mode to save up to 30% canal water with minimal profit trade-off.',
      tab: 'strategies',
      btnLabel: 'Compare Strategies'
    },
    {
      num: 3,
      title: 'Stress-Test with Drought Simulation',
      desc: 'Simulate a -30% water deficit to observe crop mix migration before buying seed.',
      tab: 'what_if',
      btnLabel: 'Simulate Shock'
    },
    {
      num: 4,
      title: 'Archive Season Farm Plan',
      desc: 'Save this mathematically feasible plan to your records and export the executive PDF report.',
      tab: 'saved_plans',
      btnLabel: 'View Saved Plans'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Today's Farm Insight */}
      <div className="lg:col-span-1 bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1b4324]"></span>
            <h3 className="font-extrabold text-[#1a1e1b] text-sm uppercase tracking-wider">
              Today&apos;s Farm Insight
            </h3>
          </div>

          <p className="text-xs text-[#2d332e] leading-relaxed font-medium">
            {dynamicInsight}
          </p>

          <p className="text-[11px] text-[#6b736c] leading-normal pt-1 border-t border-[#edf0ea]">
            <strong className="text-[#1a1e1b]">Agronomic Rationale:</strong> {insightWhy}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={() => onNavigateTab('recommendations')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f4f6f2] hover:bg-[#eaece7] text-[#1b4324] border border-[#dce0d8] transition-colors"
          >
            Show Why
          </button>
          <button
            onClick={() => onNavigateTab('what_if')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1b4324] hover:bg-[#163b20] text-white transition-colors"
          >
            Simulate →
          </button>
        </div>
      </div>

      {/* 2. AI Action Center */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-[#edf0ea]">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-[#1b4324]" />
            <h3 className="font-extrabold text-[#1a1e1b] text-sm tracking-tight">
              AI Action Center • What Should I Do Next?
            </h3>
          </div>
          <span className="text-[11px] text-[#6b736c]">Prioritized operational decisions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {actions.map((act) => (
            <div
              key={act.num}
              onClick={() => onNavigateTab(act.tab)}
              className="p-3 rounded-lg border border-[#e5e8e1] bg-[#fafbf9] hover:bg-[#f4f6f2] hover:border-[#ccd1c6] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="w-4 h-4 rounded-full bg-[#1b4324] text-white flex items-center justify-center text-[10px] font-bold">
                    {act.num}
                  </span>
                  <h4 className="font-bold text-xs text-[#1a1e1b]">{act.title}</h4>
                </div>
                <p className="text-[11px] text-[#6b736c] pl-6 leading-tight">
                  {act.desc}
                </p>
              </div>

              <div className="pl-6 pt-2 mt-1">
                <span className="text-[11px] font-semibold text-[#1b4324] hover:underline inline-flex items-center space-x-1">
                  <span>{act.btnLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
