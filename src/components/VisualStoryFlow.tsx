import React from 'react';
import { Database, BrainCircuit, TrendingUp, Sliders, PlayCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface VisualStoryFlowProps {
  onStepClick?: (stepName: string) => void;
}

export const VisualStoryFlow: React.FC<VisualStoryFlowProps> = ({ onStepClick }) => {
  const steps = [
    { name: 'FARM DATA', desc: 'Soil, Water, Rain', icon: Database, tab: 'farm_input' },
    { name: 'AI ANALYSIS', desc: 'pH, NPK Match', icon: BrainCircuit, tab: 'recommendations' },
    { name: 'PREDICTION', desc: 'Harvest Yield', icon: TrendingUp, tab: 'recommendations' },
    { name: 'OPTIMIZATION', desc: 'Simplex LP', icon: Sliders, tab: 'optimizer' },
    { name: 'SIMULATION', desc: 'Drought What-If', icon: PlayCircle, tab: 'what_if' },
    { name: 'SMART PLAN', desc: 'Actionable Delivery', icon: CheckCircle2, tab: 'command_center' }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e5e8e1] p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#636c64]">
          End-to-End Decision Architecture (5-Second Project Summary)
        </span>
        <span className="text-[10px] text-[#757d74] hidden sm:inline">Click any step to inspect</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <button
              key={idx}
              onClick={() => onStepClick?.(st.tab)}
              className="p-2.5 rounded-lg border border-[#e5e8e1] bg-[#fafbf9] hover:bg-[#edf4ed] hover:border-[#1b4324] text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[#1b4324] mb-1.5">
                  <Icon className="h-4 w-4" />
                  <span className="text-[9px] font-mono font-bold text-[#757d74] group-hover:text-[#1b4324]">
                    0{idx + 1}
                  </span>
                </div>
                <div className="font-extrabold text-[11px] text-[#1a1e1b] tracking-tight">{st.name}</div>
              </div>
              <div className="text-[10px] text-[#6b736c] mt-1 truncate">{st.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
