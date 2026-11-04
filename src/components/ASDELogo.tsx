import React, { useState } from 'react';

interface ASDELogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'shield-only';
  showSubtitle?: boolean;
}

export const ASDELogo: React.FC<ASDELogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const shieldSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Shield Brand Emblem */}
      <div className={`relative ${shieldSizes[size]} shrink-0 flex items-center justify-center`}>
        {!imageError ? (
          <img
            src="/asde_logo.jpg"
            alt="Centro de Formação Profissional ASDE"
            className="w-full h-full object-contain rounded-lg drop-shadow-xs"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-Fidelity SVG Fallback matching the exact uploaded logo */
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Shield */}
            <path
              d="M50 5 L88 20 C88 65 72 95 50 115 C28 95 12 65 12 20 Z"
              fill="#2E9E44"
              stroke="#207432"
              strokeWidth="2"
            />
            {/* Inner Shield */}
            <path
              d="M50 12 L82 25 C82 62 68 88 50 105 C32 88 18 62 18 25 Z"
              fill="#ffffff"
            />
            {/* Stars */}
            <path d="M50 18 L52 23 L57 23 L53 26 L55 31 L50 28 L45 31 L47 26 L43 23 L48 23 Z" fill="#2E9E44" />
            <path d="M40 23 L41 26 L45 26 L42 28 L43 32 L40 30 L37 32 L38 28 L35 26 L39 26 Z" fill="#2E9E44" />
            <path d="M60 23 L61 26 L65 26 L62 28 L63 32 L60 30 L57 32 L58 28 L55 26 L59 26 Z" fill="#2E9E44" />
            
            {/* Open Book */}
            <path
              d="M50 48 C42 42 30 45 28 58 C35 58 45 55 50 62 C55 55 65 58 72 58 C70 45 58 42 50 48 Z"
              fill="#2E9E44"
            />
            <path
              d="M50 50 C44 46 34 47 31 56 C38 56 46 54 50 59 C54 54 62 56 69 56 C66 47 56 46 50 50 Z"
              fill="#ffffff"
            />
            
            {/* Laurels */}
            <path
              d="M26 40 C24 50 26 65 32 75 C30 70 28 58 30 46 Z"
              fill="#2E9E44"
            />
            <path
              d="M74 40 C76 50 74 65 68 75 C70 70 72 58 70 46 Z"
              fill="#2E9E44"
            />

            {/* CFPA Ribbon Text */}
            <rect x="36" y="80" width="28" height="12" rx="3" fill="#2E9E44" />
            <text x="50" y="89" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              CFPA
            </text>
          </svg>
        )}
      </div>

      {/* Typography Label */}
      {variant !== 'shield-only' && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-tight text-emerald-800 ${titleSizes[size]}`}>
            Centro de Formação
          </span>
          <span className={`font-extrabold tracking-tight text-emerald-600 ${titleSizes[size]}`}>
            Profissional ASDE
          </span>
          {showSubtitle && variant === 'full' && (
            <span className={`text-emerald-700/80 font-medium ${subtitleSizes[size]}`}>
              English Academy & Gestão Integrada
            </span>
          )}
        </div>
      )}
    </div>
  );
};
