import React from 'react';
import { AlertTriangle, AlertCircle, Sparkles, Droplets, Zap, ArrowRight } from 'lucide-react';
import { Farm, OptimizationResult, CropRecommendation } from '../types/index.ts';

interface SmartAlertsProps {
  farm: Farm;
  optimization: OptimizationResult | null;
  recommendations: CropRecommendation[];
  onActionClick?: (tabId: string) => void;
}

export interface SmartAlert {
  id: string;
  type: 'water' | 'resource' | 'risk' | 'opportunity';
  title: string;
  severity: 'high' | 'medium' | 'opportunity';
  reason: string;
  recommendedAction: string;
  targetTab: string;
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({
  farm,
  optimization,
  recommendations,
  onActionClick
}) => {
  const summary = optimization?.summary;
  const alerts: SmartAlert[] = [];

  // 1. Water Alert
  if (summary && summary.water_utilization_pct > 85) {
    alerts.push({
      id: 'water_stress',
      type: 'water',
      title: 'Hydrological Constraint Approaching',
      severity: 'high',
      reason: `Current allocation consumes ${summary.water_utilization_pct}% of the ${farm.resources.water_m3.toLocaleString()} m³ water reserve.`,
      recommendedAction: 'Compare the "Water Saver" strategy to preserve 20-30% aquifer buffer.',
      targetTab: 'strategies'
    });
  } else if (farm.weather.rainfall < 400) {
    alerts.push({
      id: 'dry_weather',
      type: 'water',
      title: 'Low Seasonal Precipitation Window',
      severity: 'medium',
      reason: `Seasonal rainfall forecast (${farm.weather.rainfall} mm) is below optimal cereal threshold.`,
      recommendedAction: 'Simulate a drought scenario (-30% water) in the What-If Lab.',
      targetTab: 'what_if'
    });
  }

  // 2. Resource Alert
  if (summary && summary.used_fert_kg / farm.resources.fertilizer_kg > 0.85) {
    const fertPct = Math.round((summary.used_fert_kg / farm.resources.fertilizer_kg) * 100);
    alerts.push({
      id: 'fertilizer_cap',
      type: 'resource',
      title: 'Fertilizer Quota High Utilization',
      severity: 'medium',
      reason: `Optimized plan deploys ${fertPct}% of available fertilizer (${summary.used_fert_kg} kg of ${farm.resources.fertilizer_kg} kg).`,
      recommendedAction: 'Review nutrient allocation breakdown in the LP Optimizer.',
      targetTab: 'optimizer'
    });
  }

  // 3. Risk Alert
  if (summary && summary.composite_risk !== 'Low') {
    alerts.push({
      id: 'crop_risk',
      type: 'risk',
      title: 'Market & Agronomic Volatility Exposure',
      severity: summary.composite_risk === 'High' ? 'high' : 'medium',
      reason: `Composite farm risk score is ${summary.composite_risk_score} with elevated price sensitivity.`,
      recommendedAction: 'Switch to the "Risk Aware" strategy to prioritize resilient staple crops.',
      targetTab: 'strategies'
    });
  }

  // 4. Opportunity Alert
  if (summary && summary.land_utilization_pct < 90 && summary.used_land_ha < farm.land_area_ha) {
    const unallocated = Math.round((farm.land_area_ha - summary.used_land_ha) * 10) / 10;
    alerts.push({
      id: 'land_opportunity',
      type: 'opportunity',
      title: 'Unallocated Acreage Opportunity',
      severity: 'opportunity',
      reason: `${unallocated} hectares remain unplanted due to capital/water rationing limits.`,
      recommendedAction: 'Test modest working capital expansion to cultivate remaining parcels.',
      targetTab: 'what_if'
    });
  } else if (recommendations.length > 2 && recommendations[0].suitability_score >= 88) {
    alerts.push({
      id: 'crop_match_opp',
      type: 'opportunity',
      title: 'High Agro-Climatic Affinity',
      severity: 'opportunity',
      reason: `${recommendations[0].crop_name} achieves an exceptional ${recommendations[0].suitability_score}% suitability rating on your ${farm.soil.soil_type} soil.`,
      recommendedAction: 'Inspect full agronomic parameters and yield expectations.',
      targetTab: 'recommendations'
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#6b736c] px-0.5">
        <span className="font-bold tracking-wider uppercase text-[11px] text-[#4a524b] flex items-center space-x-1.5">
          <Zap className="h-3.5 w-3.5 text-[#1b4324]" />
          <span>Real-Time Decision Alerts ({alerts.length})</span>
        </span>
        <span className="text-[11px] text-[#757d74]">Grounded in telemetry & LP solution</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {alerts.slice(0, 2).map((alert) => {
          const isHigh = alert.severity === 'high';
          const isOpp = alert.severity === 'opportunity';

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
                isHigh
                  ? 'bg-[#fdf8f6] border-[#f2ded4]'
                  : isOpp
                  ? 'bg-[#f6f9f5] border-[#d8e4d5]'
                  : 'bg-[#fafbf9] border-[#e5e8e1]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-1.5">
                    {isHigh ? (
                      <AlertTriangle className="h-4 w-4 text-[#b91c1c] shrink-0" />
                    ) : isOpp ? (
                      <Sparkles className="h-4 w-4 text-[#1b4324] shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-[#b45309] shrink-0" />
                    )}
                    <span className="font-bold text-xs text-[#1a1e1b]">{alert.title}</span>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                      isHigh
                        ? 'bg-[#fee2e2] text-[#991b1b]'
                        : isOpp
                        ? 'bg-[#eef4ed] text-[#1b4324]'
                        : 'bg-[#fef3c7] text-[#92400e]'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <p className="text-[11px] text-[#5c645d] leading-normal pl-5">
                  {alert.reason}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between pl-5">
                <span className="text-[11px] font-medium text-[#2d332e] truncate mr-2">
                  <strong className="text-[#1a1e1b]">Action:</strong> {alert.recommendedAction}
                </span>

                {onActionClick && (
                  <button
                    onClick={() => onActionClick(alert.targetTab)}
                    className="inline-flex items-center space-x-0.5 text-xs font-semibold text-[#1b4324] hover:text-[#163b20] shrink-0 hover:underline"
                  >
                    <span>Resolve</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
