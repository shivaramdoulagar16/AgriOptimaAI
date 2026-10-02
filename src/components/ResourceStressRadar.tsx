import React from 'react';
import { Activity, AlertCircle, Droplets, Wallet, Sprout, CloudRain, Layers } from 'lucide-react';
import { Farm, OptimizationResult } from '../types/index.ts';

interface ResourceStressRadarProps {
  farm: Farm;
  optimization: OptimizationResult | null;
}

export const ResourceStressRadar: React.FC<ResourceStressRadarProps> = ({ farm, optimization }) => {
  const summary = optimization?.summary;

  // Calculate stress indices (0 - 100) based on real constraints
  const waterStress = summary ? Math.min(100, Math.round(summary.water_utilization_pct)) : 75;
  const budgetStress = summary ? Math.min(100, Math.round(summary.budget_utilization_pct)) : 68;
  const landStress = summary ? Math.min(100, Math.round(summary.land_utilization_pct)) : 80;
  const fertStress = summary ? Math.min(100, Math.round((summary.used_fert_kg / farm.resources.fertilizer_kg) * 100)) : 60;
  const weatherStress = farm.weather.rainfall < 450 ? 70 : farm.weather.rainfall < 700 ? 45 : 25;

  const stressPoints = [
    { name: 'Water Reserve', value: waterStress, icon: Droplets, unit: 'm³ duty' },
    { name: 'Working Budget', value: budgetStress, icon: Wallet, unit: 'capital %' },
    { name: 'Fertilizer Quota', value: fertStress, icon: Sprout, unit: 'kg capacity' },
    { name: 'Land Acreage', value: landStress, icon: Layers, unit: 'parcel %' },
    { name: 'Weather Stress', value: weatherStress, icon: CloudRain, unit: 'aridity factor' }
  ];

  // Identify primary bottleneck constraint
  const sorted = [...stressPoints].sort((a, b) => b.value - a.value);
  const primaryConstraint = sorted[0];

  return (
    <div className="bg-white rounded-xl border border-[#e5e8e1] p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#edf0ea]">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-[#1b4324]" />
          <div>
            <h3 className="font-extrabold text-[#1a1e1b] text-sm">Resource Stress & Constraint Diagnostics</h3>
            <p className="text-xs text-[#6b736c]">Real-time bottleneck identification from Simplex LP slack variables.</p>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Primary Bottleneck: <strong>{primaryConstraint.name} ({primaryConstraint.value}%)</strong></span>
        </div>
      </div>

      {/* 5 Stress Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
        {stressPoints.map((sp) => {
          const isHigh = sp.value >= 80;
          const isMed = sp.value >= 60 && sp.value < 80;

          return (
            <div
              key={sp.name}
              className={`p-3 rounded-xl border transition-all ${
                sp.name === primaryConstraint.name
                  ? 'bg-[#fbf7f4] border-[#e8c8b5] ring-1 ring-[#e8c8b5]'
                  : 'bg-[#fafbf9] border-[#e5e8e1]'
              }`}
            >
              <div className="flex items-center justify-between text-[#6b736c] mb-1">
                <span className="text-[11px] font-semibold">{sp.name}</span>
                <sp.icon className="h-3.5 w-3.5 text-[#5c645d]" />
              </div>

              <div className="flex items-baseline space-x-1 mt-1">
                <span className={`text-xl font-black ${
                  isHigh ? 'text-[#b91c1c]' : isMed ? 'text-[#b45309]' : 'text-[#1b4324]'
                }`}>
                  {sp.value}
                </span>
                <span className="text-[10px] text-[#757d74]">/ 100</span>
              </div>

              <div className="w-full bg-[#edeae4] rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isHigh ? 'bg-[#b91c1c]' : isMed ? 'bg-[#b45309]' : 'bg-[#1b4324]'
                  }`}
                  style={{ width: `${Math.min(100, sp.value)}%` }}
                ></div>
              </div>

              <span className="text-[9px] text-[#757d74] mt-1.5 block">
                {isHigh ? 'Binding ceiling' : isMed ? 'Moderate buffer' : 'Ample reserve'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
