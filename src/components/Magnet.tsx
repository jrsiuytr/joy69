import React, { useRef, useState, useEffect } from 'react';

interface MagnetProps {
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Magnet: React.FC<MagnetProps> = ({
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  onPositionChange,
  children,
  className = '',
  style = {},
}) => {
  const magnetRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = magnetRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      const isWithinBounds =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (isWithinBounds) {
        setIsHovered(true);
        const newPos = {
          x: distanceX / strength,
          y: distanceY / strength,
        };
        setPosition(newPos);
        if (onPositionChange) onPositionChange(newPos);
      } else {
        setIsHovered(false);
        const resetPos = { x: 0, y: 0 };
        setPosition(resetPos);
        if (onPositionChange) onPositionChange(resetPos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength, onPositionChange]);

  return (
    <div
      ref={magnetRef}
      className={className}
      style={{
        ...style,
        transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
        transition: isHovered ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
