import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  isDark?: boolean;
}

export function ResilientImage({ src, alt, className = '', isDark = false }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center p-8 text-center ${
          isDark
            ? 'bg-gradient-to-br from-[#191B1F] to-[#111215] text-[#9CA3AF] border border-[#272A30]'
            : 'bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] text-[#475569] border border-[#CBD5E1]'
        } ${className}`}
      >
        <ImageOff className="w-6 h-6 mb-3 opacity-70" aria-hidden="true" />
        <p className="text-xs font-medium max-w-xs leading-relaxed">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
