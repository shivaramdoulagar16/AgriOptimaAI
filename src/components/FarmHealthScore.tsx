import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronRight, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Farm, OptimizationResult, CropRecommendation } from '../types/index.ts';

interface FarmHealthScoreProps {
  farm: Farm;
  optimization: OptimizationResult | null;
  recommendations: CropRecommendation[];
}

export const FarmHealthScore: React.FC<FarmHealthScoreProps> = ({
  farm,
  optimization,
  recommendations
}) => {
  const [showModal, setShowModal] = useState(false);

  // Compute transparent scores from actual farm and optimization metrics
  const summary = optimization?.summary;

  // 1. Soil score (pH optimality 6.0-7.5, NPK balance)
  const phOptimal = farm.soil.pH >= 6.0 && farm.soil.pH <= 7.5;
  const soilScore = Math.min(100, Math.round(
    (phOptimal ? 40 : 25) +
    Math.min(30, (farm.soil.N / 150) * 30) +
    Math.min(15, (farm.soil.P / 50) * 15) +
    Math.min(15, (farm.soil.K / 60) * 15)
  ));

  // 2. Water score (stress vs reserve)
  const waterPct = summary ? summary.water_utilization_pct : 75;
  const waterScore = Math.max(20, Math.round(100 - Math.max(0, waterPct - 75) * 1.8));

  // 3. Resource efficiency score (budget & land deployed)
  const landPct = summary ? summary.land_utilization_pct : 80;
  const budgetPct = summary ? summary.budget_utilization_pct : 75;
  const resourceScore = Math.round((landPct * 0.5) + (Math.min(100, budgetPct) * 0.5));

  // 4. Risk factor
  const riskPenalty = summary?.composite_risk === 'High' ? 25 : summary?.composite_risk === 'Medium' ? 12 : 5;
  const riskScore = Math.max(30, 100 - riskPenalty);

  // Composite AgriOptima Decision Score
  const overallScore = Math.round(
    (soilScore * 0.25) +
    (waterScore * 0.30) +
    (resourceScore * 0.25) +
    (riskScore * 0.20)
  );

  const getTier = (score: number) => {
    if (score >= 80) return { label: 'Optimal', color: 'text-[#1b4324]', bg: 'bg-[#eef4ed]', border: 'border-[#d6e4d4]' };
    if (score >= 60) return { label: 'Moderate', color: 'text-[#b45309]', bg: 'bg-[#fef3c7]', border: 'border-[#fde68a]' };
    return { label: 'Attention Required', color: 'text-[#b91c1c]', bg: 'bg-[#fee2e2]', border: 'border-[#fca5a5]' };
  };

  const overallTier = getTier(overallScore);

  return (
    <>
      <div className="bg-white rounded-xl border border-[#e5e8e1] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Overall Health Score */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-14 h-14 rounded-full bg-[#f4f7f2] border-2 border-[#1b4324] flex flex-col items-center justify-center">
              <span className="text-lg font-black text-[#1a1e1b] leading-none">{overallScore}</span>
              <span className="text-[9px] font-semibold text-[#6b736c]">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#525a53]">AgriOptima Decision Score</span>
              <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${overallTier.bg} ${overallTier.color} border ${overallTier.border}`}>
                {overallTier.label}
              </span>
            </div>
            <p className="text-xs text-[#6b736c] mt-0.5">
              Transparent composite rating synthesizing soil chemistry, hydrological safety, and capital deployment.
            </p>
          </div>
        </div>

        {/* Center: 4 Factor Breakdown Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
            <span className="text-[10px] text-[#757d74] block">Soil Chemistry</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${soilScore >= 75 ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
              <strong className="text-[#1a1e1b]">{soilScore >= 75 ? 'Good' : 'Moderate'}</strong>
              <span className="text-[10px] text-[#757d74]">({soilScore})</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
            <span className="text-[10px] text-[#757d74] block">Hydrological Buffer</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${waterScore >= 70 ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
              <strong className="text-[#1a1e1b]">{waterScore >= 70 ? 'Safe' : 'Moderate'}</strong>
              <span className="text-[10px] text-[#757d74]">({waterScore})</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
            <span className="text-[10px] text-[#757d74] block">Resource Efficiency</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${resourceScore >= 75 ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
              <strong className="text-[#1a1e1b]">{resourceScore >= 75 ? 'High' : 'Moderate'}</strong>
              <span className="text-[10px] text-[#757d74]">({resourceScore})</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-[#fafbf9] border border-[#edf0ea]">
            <span className="text-[10px] text-[#757d74] block">Market & Climate Risk</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${riskScore >= 75 ? 'bg-[#1b4324]' : 'bg-[#d97706]'}`}></span>
              <strong className="text-[#1a1e1b]">{summary?.composite_risk || 'Low'}</strong>
              <span className="text-[10px] text-[#757d74]">({riskScore})</span>
            </div>
          </div>
        </div>

        {/* Right: Info / Explanation trigger */}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center space-x-1 text-xs font-semibold text-[#1b4324] hover:text-[#163b20] hover:underline self-end md:self-center shrink-0"
        >
          <Info className="h-3.5 w-3.5" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Transparent Calculation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e5e8e1] space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#edf0ea]">
              <div>
                <h3 className="font-extrabold text-[#1a1e1b] text-base">AgriOptima Decision Score Formulation</h3>
                <p className="text-xs text-[#6b736c] mt-0.5">Multi-criteria agricultural decision index (Non-certified prototype indicator)</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md text-[#757d74] hover:bg-[#f2f4ef]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-[#fafbf9] rounded-lg border border-[#e5e8e1] space-y-1">
                <div className="flex justify-between font-bold text-[#1a1e1b]">
                  <span>1. Soil Chemistry & Reaction (Weight: 25%)</span>
                  <span>{soilScore}/100</span>
                </div>
                <p className="text-[#5c645d]">
                  Evaluates pH buffer against ideal crop window (6.0 - 7.5) alongside available N ({farm.soil.N} kg/ha), P ({farm.soil.P} kg/ha), and K ({farm.soil.K} kg/ha).
                </p>
              </div>

              <div className="p-3 bg-[#fafbf9] rounded-lg border border-[#e5e8e1] space-y-1">
                <div className="flex justify-between font-bold text-[#1a1e1b]">
                  <span>2. Hydrological Safety (Weight: 30%)</span>
                  <span>{waterScore}/100</span>
                </div>
                <p className="text-[#5c645d]">
                  Measures canal and aquifer demand against seasonal evapotranspiration. Keeps a safety reserve buffer against dry spells.
                </p>
              </div>

              <div className="p-3 bg-[#fafbf9] rounded-lg border border-[#e5e8e1] space-y-1">
                <div className="flex justify-between font-bold text-[#1a1e1b]">
                  <span>3. Resource Allocation Efficiency (Weight: 25%)</span>
                  <span>{resourceScore}/100</span>
                </div>
                <p className="text-[#5c645d]">
                  Reflects the mathematical Simplex LP parcel utilization for land ({landPct}%) and working capital ({budgetPct}%).
                </p>
              </div>

              <div className="p-3 bg-[#fafbf9] rounded-lg border border-[#e5e8e1] space-y-1">
                <div className="flex justify-between font-bold text-[#1a1e1b]">
                  <span>4. Composite Risk Factor (Weight: 20%)</span>
                  <span>{riskScore}/100</span>
                </div>
                <p className="text-[#5c645d]">
                  Penalizes monoculture exposure, pest vulnerability, and market price volatility based on historical mandi price variances.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#eef4ed] border border-[#d6e4d4] text-[11px] text-[#1b4324]">
              <strong>Note:</strong> This score is designed as a decision-support heuristic to guide input adjustments before sowing season.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1b4324] hover:bg-[#163b20] text-white"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
