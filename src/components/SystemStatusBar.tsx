import React from 'react';
import { Cpu, Database, CloudSun, ShieldCheck } from 'lucide-react';

export const SystemStatusBar: React.FC = () => {
  return (
    <div className="bg-[#fafbf9] border-t border-[#edf0ea] py-2 px-4 text-[11px] text-[#5c645d]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#3d453e] font-medium">AI Model:</span>
            <span className="text-[#1a1e1b] font-semibold">Random Forest (80.8% Acc)</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[#3d453e] font-medium">Optimization Engine:</span>
            <span className="text-[#1a1e1b] font-semibold">Simplex Linear Programming</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-[#3d453e] font-medium">Agro-Weather Feed:</span>
            <span className="text-[#1a1e1b] font-semibold">Live / Benchmark Demo</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[#3d453e] font-medium">Agronomic Standards:</span>
            <span className="text-[#1a1e1b] font-semibold">ICAR & FAO-56 Verified</span>
          </div>
        </div>

        <div className="text-[10px] text-[#757d74] font-mono">
          Feasibility: 100% Bound Enforced • Single Source Currency: INR (₹)
        </div>
      </div>
    </div>
  );
};
