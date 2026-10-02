import React, { useState } from 'react';
import { CropFallbackIllustration, FarmlandIllustration } from '../assets/agriculture/illustrations.tsx';

interface AgriImageProps {
  src?: string;
  alt: string;
  cropKey?: string;
  className?: string;
  isHero?: boolean;
}

export const AgriImage: React.FC<AgriImageProps> = ({
  src,
  alt,
  cropKey,
  className = 'w-full h-full object-cover',
  isHero = false
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    if (isHero) {
      return (
        <div className={`w-full h-full flex items-center justify-center bg-[#1b4324] ${className}`}>
          <FarmlandIllustration className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={`w-full h-full ${className}`}>
        <CropFallbackIllustration cropKey={cropKey || alt} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[#f0f4ee] animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[#1b4324] border-t-transparent animate-spin opacity-40" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
