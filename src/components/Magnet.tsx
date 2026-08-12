import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

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
  padding = 320,
  strength = 1.4,
  onPositionChange,
  children,
  className = '',
  style = {},
}) => {
  const magnetRef = useRef<HTMLDivElement>(null);

  // 60FPS GPU MotionValues (Zero React component re-renders on mousemove!)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 110, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 110, damping: 18, mass: 0.6 });

  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const element = magnetRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();

      // Stable untransformed origin calculation
      const centerX = rect.left + rect.width / 2 - positionRef.current.x;
      const centerY = rect.top + rect.height / 2 - positionRef.current.y;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      const maxDistX = rect.width / 2 + padding;
      const maxDistY = rect.height / 2 + padding;

      const isWithinBounds = Math.abs(distanceX) <= maxDistX && Math.abs(distanceY) <= maxDistY;

      if (isWithinBounds) {
        const newPos = {
          x: distanceX / strength,
          y: distanceY / strength,
        };
        positionRef.current = newPos;
        rawX.set(newPos.x);
        rawY.set(newPos.y);
        if (onPositionChange) onPositionChange(newPos);
      } else {
        const resetPos = { x: 0, y: 0 };
        positionRef.current = resetPos;
        rawX.set(0);
        rawY.set(0);
        if (onPositionChange) onPositionChange(resetPos);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, strength, onPositionChange, rawX, rawY]);

  return (
    <motion.div
      ref={magnetRef}
      className={className}
      style={{
        ...style,
        x,
        y,
      }}
    >
      {children}
    </motion.div>
  );
};
