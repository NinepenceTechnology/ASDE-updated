import React, { useState } from 'react';
import { User, Camera } from 'lucide-react';

interface UserPhotoProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showBadge?: boolean;
  borderClassName?: string;
  highlightRing?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
};

export const UserPhoto: React.FC<UserPhotoProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  borderClassName = 'border border-emerald-200/60 shadow-xs',
  highlightRing = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Generate 2 uppercase initials from name
  const getInitials = (n: string) => {
    if (!n) return 'AS';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const dimensionClass = sizeClasses[size];

  // Has a real photo (data URL from camera or valid image)
  const hasValidPhoto = src && src.trim() !== '' && !imgError && !src.includes('images.unsplash.com');

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {highlightRing && (
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full blur-xs opacity-80 animate-pulse" />
      )}

      {hasValidPhoto ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`relative rounded-full object-cover ${dimensionClass} ${borderClassName}`}
        />
      ) : (
        <div
          title={name}
          className={`relative rounded-full flex items-center justify-center font-black tracking-wider uppercase bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white select-none ${dimensionClass} ${borderClassName}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
};
