import React from 'react';

interface KineticTextFlipProps {
  text: string;
  className?: string;
  stagger?: boolean;
}

export const KineticTextFlip: React.FC<KineticTextFlipProps> = ({
  text,
  className = '',
  stagger = true,
}) => {
  if (stagger) {
    const letters = text.split('');
    return (
      <span className={`relative inline-flex overflow-hidden select-none [perspective:1000px] ${className}`}>
        {/* TOP LAYER (Rotates out upward) */}
        <span className="flex">
          {letters.map((char, i) => (
            <span
              key={`top-${i}`}
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-bottom group-hover:-translate-y-full group-hover:-rotate-x-90"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>

        {/* BOTTOM LAYER (Rotates in from below) */}
        <span className="absolute inset-0 flex">
          {letters.map((char, i) => (
            <span
              key={`bot-${i}`}
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] origin-top translate-y-full rotate-x-90 group-hover:translate-y-0 group-hover:rotate-x-0"
              style={{ transitionDelay: `${i * 25}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </span>
    );
  }

  return (
    <span className={`relative inline-block overflow-hidden select-none [perspective:1000px] ${className}`}>
      {/* Block Top Layer */}
      <span className="block transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] origin-bottom group-hover:-translate-y-full group-hover:-rotate-x-90 group-hover:opacity-0">
        {text}
      </span>
      {/* Block Bottom Layer */}
      <span className="absolute inset-0 block transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] origin-top translate-y-full rotate-x-90 opacity-0 group-hover:translate-y-0 group-hover:rotate-x-0 group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
};

export default KineticTextFlip;
