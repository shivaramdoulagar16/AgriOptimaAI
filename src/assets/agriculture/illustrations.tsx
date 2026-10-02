import React from 'react';

interface SvgProps {
  className?: string;
  size?: number;
}

export const FarmlandIllustration: React.FC<SvgProps> = ({ className = 'w-full h-full', size }) => (
  <svg
    viewBox="0 0 400 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e8f3ea" />
        <stop offset="60%" stopColor="#f4f7f4" />
        <stop offset="100%" stopColor="#fafbf9" />
      </linearGradient>
      <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2c5a35" />
        <stop offset="100%" stopColor="#1b4324" />
      </linearGradient>
      <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43734e" />
        <stop offset="100%" stopColor="#285031" />
      </linearGradient>
      <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3d6f47" />
        <stop offset="100%" stopColor="#183c20" />
      </linearGradient>
    </defs>
    <rect width="400" height="240" rx="12" fill="url(#skyGrad)" />
    {/* Sun */}
    <circle cx="310" cy="55" r="28" fill="#fde68a" fillOpacity="0.75" />
    <circle cx="310" cy="55" r="20" fill="#fbbf24" fillOpacity="0.85" />
    {/* Distant Hills */}
    <path d="M0 135 C80 110, 160 145, 250 120 C320 100, 370 125, 400 115 L400 240 L0 240 Z" fill="url(#hillGrad2)" opacity="0.6" />
    <path d="M0 150 C90 130, 180 160, 270 140 C340 125, 380 140, 400 135 L400 240 L0 240 Z" fill="url(#hillGrad1)" />
    {/* Crop Furrows / Field Rows */}
    <path d="M0 185 L400 185" stroke="#4c7e57" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
    <path d="M0 205 L400 205" stroke="#4c7e57" strokeWidth="2" strokeDasharray="8 6" opacity="0.45" />
    <path d="M0 225 L400 225" stroke="#4c7e57" strokeWidth="2.5" opacity="0.5" />
    {/* Field Crop Accents */}
    <g fill="#a7f3d0" opacity="0.8">
      <circle cx="45" cy="180" r="3" />
      <circle cx="85" cy="180" r="3.5" />
      <circle cx="130" cy="180" r="3" />
      <circle cx="175" cy="180" r="4" />
      <circle cx="225" cy="180" r="3" />
      <circle cx="275" cy="180" r="3.5" />
      <circle cx="325" cy="180" r="4" />
      <circle cx="370" cy="180" r="3" />
      <circle cx="60" cy="202" r="4" />
      <circle cx="110" cy="202" r="4.5" />
      <circle cx="160" cy="202" r="4" />
      <circle cx="210" cy="202" r="5" />
      <circle cx="260" cy="202" r="4" />
      <circle cx="310" cy="202" r="4.5" />
      <circle cx="360" cy="202" r="4" />
    </g>
    {/* Farm Silhouette House/Barn */}
    <path d="M60 140 L75 125 L90 140 L90 152 L60 152 Z" fill="#ffffff" opacity="0.9" />
    <path d="M60 140 L75 125 L90 140 Z" fill="#b91c1c" opacity="0.85" />
    <rect x="71" y="142" width="7" height="10" fill="#1b4324" />
    {/* Windmill / Tree */}
    <circle cx="108" cy="142" r="9" fill="#1e3e26" />
    <rect x="106" y="146" width="4" height="10" fill="#3b2b1d" />
  </svg>
);

export const CropFieldIllustration: React.FC<SvgProps> = ({ className = 'w-full h-full', size }) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="200" height="150" rx="8" fill="#f4f7f4" />
    <path d="M0 60 C50 50, 150 70, 200 55 L200 150 L0 150 Z" fill="#2d5f38" opacity="0.9" />
    <path d="M0 85 C60 75, 140 95, 200 80 L200 150 L0 150 Z" fill="#1b4324" />
    {/* Stems */}
    <g stroke="#86efac" strokeWidth="1.5" strokeLinecap="round">
      <path d="M30 115 Q35 95 30 80 M30 85 Q22 80 20 85 M30 95 Q38 90 40 95" />
      <path d="M65 110 Q70 90 65 75 M65 80 Q57 75 55 80 M65 90 Q73 85 75 90" />
      <path d="M100 115 Q105 92 100 78 M100 84 Q92 78 90 84 M100 94 Q108 88 110 94" />
      <path d="M135 110 Q140 88 135 74 M135 80 Q127 75 125 80 M135 90 Q143 85 145 90" />
      <path d="M170 115 Q175 92 170 80 M170 85 Q162 80 160 85 M170 95 Q178 90 180 95" />
    </g>
    <circle cx="160" cy="35" r="14" fill="#fef08a" />
  </svg>
);

export const SoilIllustration: React.FC<SvgProps> = ({ className = 'w-full h-full', size }) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="200" height="150" rx="8" fill="#fdfbf7" />
    {/* Topsoil */}
    <rect x="15" y="30" width="170" height="30" rx="4" fill="#4a3728" />
    <text x="25" y="50" fill="#fed7aa" fontSize="10" fontWeight="bold">Topsoil (Humus + NPK)</text>
    {/* Subsoil */}
    <rect x="15" y="65" width="170" height="35" rx="4" fill="#715138" />
    <text x="25" y="87" fill="#ffedd5" fontSize="10" fontWeight="bold">Subsoil (Minerals & Clays)</text>
    {/* Substratum */}
    <rect x="15" y="105" width="170" height="30" rx="4" fill="#9a7b63" />
    <text x="25" y="125" fill="#ffffff" fontSize="10" fontWeight="bold">Substratum (Weathered Rock)</text>
    {/* Plant Roots */}
    <path d="M100 20 L100 55 Q95 70 85 85 M100 55 Q105 75 115 90 M100 45 Q88 55 80 65 M100 48 Q112 58 120 70" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const WaterIrrigationIllustration: React.FC<SvgProps> = ({ className = 'w-full h-full', size }) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="200" height="150" rx="8" fill="#f0f7ff" />
    {/* Water drop shape */}
    <path d="M100 20 C100 20 60 70 60 100 C60 122 78 140 100 140 C122 140 140 122 140 100 C140 70 100 20 100 20 Z" fill="#0284c7" fillOpacity="0.85" />
    {/* Inner shimmer */}
    <path d="M85 90 C85 75 95 55 100 45 C90 60 80 80 80 100 C80 108 83 115 88 120 C85 112 85 100 85 90 Z" fill="#ffffff" opacity="0.6" />
    {/* Waves */}
    <path d="M75 105 Q88 100 100 105 T125 105" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
    <path d="M82 118 Q92 114 100 118 T118 118" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const AIAnalysisIllustration: React.FC<SvgProps> = ({ className = 'w-full h-full', size }) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="200" height="150" rx="8" fill="#f2f5f1" />
    {/* Neural nodes */}
    <g stroke="#1b4324" strokeWidth="1.5" opacity="0.4">
      <line x1="40" y1="40" x2="100" y2="75" />
      <line x1="40" y1="110" x2="100" y2="75" />
      <line x1="100" y1="75" x2="160" y2="40" />
      <line x1="100" y1="75" x2="160" y2="110" />
      <line x1="40" y1="75" x2="100" y2="75" />
      <line x1="100" y1="75" x2="160" y2="75" />
    </g>
    {/* Nodes */}
    <circle cx="40" cy="40" r="9" fill="#1b4324" />
    <circle cx="40" cy="75" r="9" fill="#1b4324" />
    <circle cx="40" cy="110" r="9" fill="#1b4324" />
    <circle cx="100" cy="75" r="14" fill="#2d5f38" />
    <circle cx="160" cy="40" r="9" fill="#166534" />
    <circle cx="160" cy="75" r="9" fill="#166534" />
    <circle cx="160" cy="110" r="9" fill="#166534" />
    {/* Node Centers */}
    <circle cx="100" cy="75" r="6" fill="#86efac" />
    <circle cx="40" cy="40" r="3" fill="#ffffff" />
    <circle cx="40" cy="75" r="3" fill="#ffffff" />
    <circle cx="40" cy="110" r="3" fill="#ffffff" />
    <circle cx="160" cy="40" r="3" fill="#ffffff" />
    <circle cx="160" cy="75" r="3" fill="#ffffff" />
    <circle cx="160" cy="110" r="3" fill="#ffffff" />
  </svg>
);

export const OptimizationIllustration: React.FC<SvgProps> = ({ className = 'w-full h-full', size }) => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="200" height="150" rx="8" fill="#fafbf9" />
    {/* Coordinate grid */}
    <line x1="30" y1="20" x2="30" y2="130" stroke="#d1d5db" strokeWidth="1.5" />
    <line x1="30" y1="130" x2="180" y2="130" stroke="#d1d5db" strokeWidth="1.5" />
    {/* Feasible Region Polygon */}
    <polygon points="30,130 30,60 110,40 160,95 140,130" fill="#dcfce7" fillOpacity="0.75" stroke="#1b4324" strokeWidth="2" />
    {/* Optimal Vertex Star */}
    <circle cx="110" cy="40" r="6" fill="#1b4324" />
    <circle cx="110" cy="40" r="10" stroke="#22c55e" strokeWidth="2" strokeDasharray="3 3" />
    <text x="118" y="38" fill="#1b4324" fontSize="9" fontWeight="bold">Optimal Z*</text>
  </svg>
);

export const CropFallbackIllustration: React.FC<{ cropKey: string; className?: string }> = ({ cropKey, className = 'w-full h-full' }) => {
  const key = cropKey.toLowerCase();
  let color = '#2d5f38';
  let accent = '#86efac';
  let name = cropKey.toUpperCase();

  if (key.includes('wheat') || key.includes('grain')) {
    color = '#854d0e';
    accent = '#fef08a';
  } else if (key.includes('rice') || key.includes('paddy')) {
    color = '#15803d';
    accent = '#bbf7d0';
  } else if (key.includes('cotton')) {
    color = '#1e3a8a';
    accent = '#e0f2fe';
  } else if (key.includes('tomato')) {
    color = '#b91c1c';
    accent = '#fecaca';
  } else if (key.includes('potato')) {
    color = '#78350f';
    accent = '#fed7aa';
  } else if (key.includes('maize') || key.includes('corn')) {
    color = '#a16207';
    accent = '#fef08a';
  }

  return (
    <div className={`flex flex-col items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-[#f8faf8] to-[#edf3ee] border border-[#e2e8e0] rounded-lg ${className}`}>
      <svg viewBox="0 0 100 100" className="w-16 h-16 mb-1" fill="none">
        <circle cx="50" cy="50" r="42" fill={accent} fillOpacity="0.35" />
        <path d="M50 78 Q50 45 42 28 Q48 40 50 78 Z" fill={color} />
        <path d="M50 78 Q50 45 58 28 Q52 40 50 78 Z" fill={color} />
        <circle cx="50" cy="26" r="5" fill={color} />
        <path d="M50 50 Q36 40 32 45 Q42 50 50 55" fill={color} opacity="0.8" />
        <path d="M50 42 Q64 32 68 37 Q58 42 50 47" fill={color} opacity="0.8" />
      </svg>
      <span className="text-[11px] font-bold text-[#1a1e1b] tracking-wide">{name}</span>
      <span className="text-[9px] text-[#5c645d] font-medium">ICAR Verified Standard</span>
    </div>
  );
};
