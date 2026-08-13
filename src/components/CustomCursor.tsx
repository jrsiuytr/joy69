import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface WebClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<WebClickRipple[]>([]);
  const rippleIdRef = useRef(0);

  // 60FPS GPU MotionValues for instant 1:1 pinpoint cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth fluid spring physics for cursor outer trailing aura ring
  const springConfig = { stiffness: 500, damping: 28, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice()) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {

      document.body.classList.add('custom-cursor-active');
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isTouchDevice()) return;
      setIsClicking(true);
      const newRipple = {
        id: ++rippleIdRef.current,
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      document.body.classList.remove('custom-cursor-active');
      setIsVisible(false);
    };

    const handleMouseEnter = (e?: MouseEvent | Event) => {
      if (!isTouchDevice()) {
        document.body.classList.add('custom-cursor-active');
        setIsVisible(true);
        if (e && 'clientX' in e) {
          mouseX.set((e as MouseEvent).clientX);
          mouseY.set((e as MouseEvent).clientY);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('focus', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('focus', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
      {/* 1. Metallic Silver Spider-Web Net Shockwave Ripples on Click */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={`web-ripple-${ripple.id}`}
            initial={{ scale: 0.1, opacity: 0.95, rotate: -15 }}
            animate={{ scale: 2.2, opacity: 0, rotate: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => removeRipple(ripple.id)}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.95)]"
              fill="none"
            >
              {/* Metallic Silver & Ice Cyan Spider Web Net Shockwave Strands */}
              <g stroke="rgba(255,255,255,0.95)" strokeWidth="1.6">
                <line x1="50" y1="0" x2="50" y2="100" />
                <line x1="0" y1="50" x2="100" y2="50" />
                <line x1="14" y1="14" x2="86" y2="86" />
                <line x1="86" y1="14" x2="14" y2="86" />
                <path d="M50,15 Q61,20 76,23 Q80,39 85,50 Q80,61 76,76 Q61,80 50,85 Q39,80 23,76 Q20,61 15,50 Q20,39 23,23 Q39,20 50,15 Z" />
                <path d="M50,28 Q57,31 67,33 Q70,43 72,50 Q70,57 67,67 Q57,70 50,72 Q43,70 33,67 Q31,57 28,50 Q31,43 33,33 Q43,31 50,28 Z" />
              </g>
              <g stroke="#38BDF8" strokeWidth="1.2">
                <circle cx="50" cy="50" r="12" />
                <circle cx="50" cy="50" r="24" />
              </g>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 2. Trailing Metallic Silver Halo Aura */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          scale: isClicking ? 0.7 : isPointer ? 1.5 : 1.0,
          opacity: isPointer ? 0.9 : 0.45,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-cyan-300/60 shadow-[0_0_20px_rgba(56,189,248,0.6)] backdrop-blur-[1px] pointer-events-none"
      />

      {/* 3. Metallic Chrome Silver Arrow Pointer (Instant 1:1 pinpoint tracking) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isClicking ? 0.82 : isPointer ? 1.25 : 1.0,
          rotate: isPointer ? -8 : 0,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        className="absolute top-0 left-0 pointer-events-none origin-top-left -ml-1 -mt-1"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="drop-shadow-[0_4px_16px_rgba(255,255,255,0.95)]"
        >
          <defs>
            {/* Metallic Silver Chrome Gradient */}
            <linearGradient id="metallicSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#F1F5F9" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <filter id="chromeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Chrome Shadow Path */}
          <path
            d="M 3,3 L 26,13 L 15,16 L 12,27 Z"
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Glowing Metallic Backing Stroke */}
          <path
            d="M 3,3 L 26,13 L 15,16 L 12,27 Z"
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            filter="url(#chromeGlow)"
          />

          {/* Main Metallic Silver Arrow Body */}
          <path
            d="M 3,3 L 26,13 L 15,16 L 12,27 Z"
            fill="url(#metallicSilverGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Metallic Sharp Spine Highlight */}
          <path
            d="M 4,4 L 14.5,15.5 M 4,4 L 22,12"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Core Cyan Laser Accent Dot */}
          <circle cx="14.5" cy="15.5" r="1.5" fill="#38BDF8" className="animate-pulse" />
        </svg>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
