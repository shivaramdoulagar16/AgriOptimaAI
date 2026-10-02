import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Droplets, IndianRupee, Layers, Sprout } from 'lucide-react';
import { Farm, OptimizationResult } from '../types/index.ts';

interface FarmHealthAndPressureProps {
  farm: Farm;
  optimization: OptimizationResult | null;
}

export function computeFarmHealth(farm: Farm, optimization: OptimizationResult | null) {
  // Soil score (0-20)
  let soilScore = 15;
  if (farm.soil.pH >= 6.0 && farm.soil.pH <= 7.5) soilScore += 3;
  if (farm.soil.N > 100 && farm.soil.P > 30) soilScore += 2;

  // Water score (0-20)
  let waterScore = 14;
  const waterPerHa = farm.resources.water_m3 / (farm.land_area_ha || 1);
  if (waterPerHa >= 5000) waterScore += 4;
  else if (waterPerHa >= 3000) waterScore += 2;
  else waterScore -= 4;

  // Weather score (0-20)
  let weatherScore = 16;
  if (farm.weather.rainfall < 350) weatherScore -= 5;
  if (farm.weather.temperature > 38 || farm.weather.temperature < 10) weatherScore -= 4;

  // Resource & Capital score (0-20)
  let resourceScore = 15;
  const budgetPerHa = farm.resources.budget_usd / (farm.land_area_ha || 1);
  if (budgetPerHa >= 600) resourceScore += 4;
  else if (budgetPerHa < 300) resourceScore -= 4;

  // Plan feasibility & Margin score (0-20)
  let feasibilityScore = 16;
  if (optimization?.feasible) {
    feasibilityScore += 2;
    if (optimization.summary.profit_margin_pct >= 60) feasibilityScore += 2;
  }

  const total = Math.min(100, Math.max(30, soilScore + waterScore + weatherScore + resourceScore + feasibilityScore));

  const rating = total >= 80 ? 'Good' : total >= 65 ? 'Moderate' : 'Attention';
  const ratingColor = total >= 80 ? 'text-[#1b4324] bg-[#eef4ed] border-[#cbe1ca]' : total >= 65 ? 'text-[#854d0e] bg-[#fefce8] border-[#fef08a]' : 'text-[#991b1b] bg-[#fef2f2] border-[#fecaca]';

  return {
    total,
    rating,
    ratingColor,
    breakdown: [
      { label: 'Soil Fertility & pH', score: soilScore, max: 20, status: soilScore >= 16 ? 'Good' : 'Moderate' },
      { label: 'Aquifer / Water Reserve', score: waterScore, max: 20, status: waterScore >= 16 ? 'Good' : waterScore >= 12 ? 'Moderate' : 'Attention' },
      { label: 'Agro-Climate & Rain', score: weatherScore, max: 20, status: weatherScore >= 15 ? 'Good' : 'Moderate' },
      { label: 'Working Capital Ratio', score: resourceScore, max: 20, status: resourceScore >= 16 ? 'Good' : 'Moderate' },
      { label: 'Allocation Feasibility', score: feasibilityScore, max: 20, status: feasibilityScore >= 17 ? 'Good' : 'Moderate' }
    ]
  };
}

export function computeResourcePressure(farm: Farm, optimization: OptimizationResult | null) {
  const summary = optimization?.summary;

  const waterUtil = summary?.water_utilization_pct ?? Math.round((farm.resources.water_m3 / (farm.land_area_ha * 6000)) * 100);
  const budgetUtil = summary?.budget_utilization_pct ?? 70;
  const landUtil = summary?.land_utilization_pct ?? 90;
  const fertUtil = summary?.fertilizer_utilization_pct ?? 65;

  const getPressure = (pct: number) => {
    if (pct >= 85) return { label: 'HIGH PRESSURE', level: 'high', color: 'text-[#991b1b] bg-[#fef2f2] border-[#fecaca]', barColor: 'bg-[#b91c1c]' };
    if (pct >= 60) return { label: 'MODERATE', level: 'medium', color: 'text-[#854d0e] bg-[#fefce8] border-[#fef08a]', barColor: 'bg-[#d97706]' };
    return { label: 'LOW PRESSURE', level: 'low', color: 'text-[#1b4324] bg-[#eef4ed] border-[#cbe1ca]', barColor: 'bg-[#1b4324]' };
  };

  return [
    {
      name: 'Irrigation Water',
      pct: Math.min(100, waterUtil),
      pressure: getPressure(waterUtil),
      detail: `${summary ? summary.used_water_m3.toLocaleString() : '—'} / ${farm.resources.water_m3.toLocaleString()} m³`,
      bindingNotice: waterUtil >= 80 ? 'Primary binding constraint on crop selection.' : 'Comfortable aquifer buffer available.'
    },
    {
      name: 'Working Capital',
      pct: Math.min(100, budgetUtil),
      pressure: getPressure(budgetUtil),
      detail: `${summary ? summary.budget_utilization_pct : '—'}% deployed`,
      bindingNotice: budgetUtil >= 85 ? 'High capital deployment leaves little cash reserve.' : 'Prudent liquidity buffer retained.'
    },
    {
      name: 'Land Acreage',
      pct: Math.min(100, landUtil),
      pressure: getPressure(landUtil),
      detail: `${summary ? summary.used_land_ha : '—'} / ${farm.land_area_ha} ha`,
      bindingNotice: landUtil >= 90 ? 'Near-total acreage utilized for production.' : 'Unallocated buffer available for pasture or fallow.'
    },
    {
      name: 'Fertilizer Reserve',
      pct: Math.min(100, fertUtil),
      pressure: getPressure(fertUtil),
      detail: `${summary ? summary.fertilizer_utilization_pct : '—'}% utilized`,
      bindingNotice: 'NPK consumption is within sustainable agronomic limits.'
    }
  ];
}

export const FarmHealthAndPressure: React.FC<FarmHealthAndPressureProps> = ({ farm, optimization }) => {
  const health = computeFarmHealth(farm, optimization);
  const pressures = computeResourcePressure(farm, optimization);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* 1. Farm Health Score */}
      <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#1b4324]" />
              <h3 className="font-bold text-sm text-[#1a1e1b]">Farm Health Score</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${health.ratingColor}`}>
              {health.rating}
            </span>
          </div>

          <div className="flex items-baseline space-x-2 my-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#1a1e1b]">{health.total}</span>
            <span className="text-xs text-[#6b736c] font-medium">/ 100 Points</span>
          </div>

          <p className="text-[11px] text-[#6b736c] mb-4">
            Transparent composite score derived from soil chemistry, water reserves, weather conditions, and LP plan stability.
          </p>

          <div className="space-y-2 pt-2 border-t border-[#edf0ea]">
            {health.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-[#4a524b] text-[11px]">{item.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-[#1a1e1b] text-[11px]">{item.score}/{item.max}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${item.status === 'Good' ? 'text-[#1b4324] bg-[#edf4ed]' : item.status === 'Moderate' ? 'text-[#854d0e] bg-[#fefce8]' : 'text-[#991b1b] bg-[#fef2f2]'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#edf0ea] flex items-center justify-between text-[10px] text-[#757d74]">
          <span>Non-certified prototype metric</span>
          <span>Updated Live</span>
        </div>
      </div>

      {/* 2. Resource Pressure Map */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1b4324]" />
            <h3 className="font-bold text-sm text-[#1a1e1b]">Resource Pressure & Limiting Factors</h3>
          </div>
          <span className="text-[11px] text-[#6b736c]">Identifies what constrains your holding</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
          {pressures.map((res, idx) => (
            <div key={idx} className="p-3.5 bg-[#fafbf9] rounded-xl border border-[#e8ebe4] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#1a1e1b]">{res.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${res.pressure.color}`}>
                    {res.pressure.label}
                  </span>
                </div>

                <div className="w-full bg-[#e8ebe5] rounded-full h-1.5 my-2 overflow-hidden">
                  <div className={`h-full rounded-full ${res.pressure.barColor}`} style={{ width: `${res.pct}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#5c645d] mb-1.5">
                  <span>Usage: {res.detail}</span>
                  <span className="font-semibold text-[#1a1e1b]">{res.pct}%</span>
                </div>
              </div>

              <div className="text-[10px] text-[#6b736c] pt-2 border-t border-[#edf0ea] italic">
                {res.bindingNotice}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
