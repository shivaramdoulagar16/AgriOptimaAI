import React from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, TrendingUp, Droplets, Wallet, Sparkles } from 'lucide-react';
import { OptimizationResult } from '../types/index.ts';

interface PlanResilienceScorecardProps {
  optimization: OptimizationResult | null;
}

export const PlanResilienceScorecard: React.FC<PlanResilienceScorecardProps> = ({ optimization }) => {
  const summary = optimization?.summary;

  // Calculate prototype resilience score based on diversification & slack buffers
  const numAllocations = optimization?.allocations.length || 1;
  const diversificationFactor = Math.min(30, numAllocations * 12);
  const waterBufferFactor = summary ? Math.max(0, 30 - (summary.water_utilization_pct - 65)) : 20;
  const budgetBufferFactor = summary ? Math.max(0, 25 - (summary.budget_utilization_pct - 65)) : 18;
  const riskDeduction = summary?.composite_risk === 'High' ? 18 : summary?.composite_risk === 'Medium' ? 8 : 2;

  const resilienceScore = Math.min(95, Math.max(45, Math.round(
    25 + diversificationFactor + waterBufferFactor + budgetBufferFactor - riskDeduction
  )));

  // Sensitivity vectors
  const droughtTolerance = summary && summary.water_utilization_pct < 85 ? 'Strong' : 'Moderate';
  const budgetCutResilience = summary && summary.budget_utilization_pct < 85 ? 'Strong' : 'Moderate';
  const priceChangeBuffer = numAllocations >= 2 ? 'Strong' : 'Moderate';
  const rainfallResilience = summary?.composite_risk === 'Low' ? 'Strong' : 'Moderate';

  // 5 Scorecard Pillars (0 - 10 scale)
  const scorecard = [
    { label: 'Profitability Margin', score: Math.min(10, Math.max(3, Math.round((summary?.profit_margin_pct || 40) / 10))) },
    { label: 'Resource Efficiency', score: Math.min(10, Math.max(4, Math.round((summary?.land_utilization_pct || 80) / 10))) },
    { label: 'Risk Mitigation', score: summary?.composite_risk === 'Low' ? 9 : summary?.composite_risk === 'Medium' ? 7 : 4 },
    { label: 'Water Sustainability', score: summary && summary.water_utilization_pct < 80 ? 8 : 6 },
    { label: 'Plan Resilience', score: Math.round(resilienceScore / 10) }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#edf0ea]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1b4324]"></span>
            <h3 className="font-extrabold text-[#1a1e1b] text-sm">Plan Resilience & Farm Scorecard</h3>
          </div>
          <p className="text-xs text-[#6b736c] mt-0.5">
            AgriOptima prototype resilience indicator assessing multi-scenario durability.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 rounded-lg bg-[#eef4ed] border border-[#d6e4d4] flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-[#1b4324]" />
            <span className="text-xs font-bold text-[#1b4324]">
              Resilience: <strong>{resilienceScore}/100</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {/* Left: 4 Stress Vectors */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#636c64] block">
            Environmental & Economic Stress Tolerance
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
              <span className="text-[10px] text-[#757d74] block">Drought Shock (-30% Water)</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${droughtTolerance === 'Strong' ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
                <strong className="text-[#1a1e1b]">{droughtTolerance}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
              <span className="text-[10px] text-[#757d74] block">Budget Crunch (-25% Capital)</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${budgetCutResilience === 'Strong' ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
                <strong className="text-[#1a1e1b]">{budgetCutResilience}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
              <span className="text-[10px] text-[#757d74] block">Mandi Price Variance</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${priceChangeBuffer === 'Strong' ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
                <strong className="text-[#1a1e1b]">{priceChangeBuffer}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
              <span className="text-[10px] text-[#757d74] block">Monsoon Delay / Anomaly</span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${rainfallResilience === 'Strong' ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
                <strong className="text-[#1a1e1b]">{rainfallResilience}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 5-Pillar Scorecard Bars */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#636c64] block">
            Farm Plan Scorecard
          </span>

          <div className="space-y-2 text-xs">
            {scorecard.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#3d453e] font-medium">{item.label}</span>
                  <span className="font-bold text-[#1a1e1b]">{item.score}/10</span>
                </div>
                <div className="w-full bg-[#f0f2ed] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#1b4324] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${item.score * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
