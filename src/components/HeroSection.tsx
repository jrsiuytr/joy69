import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';
import { ContactButton } from './ContactButton';
import spidermanImg from '../images/spiderman.png';

export const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDir, setScrollDir] = useState<'up' | 'down' | 'idle'>('idle');
  const [showWebNet, setShowWebNet] = useState(false);

  const lastScrollY = useRef(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const netHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Framer Motion motion values for 60fps GPU rope bending (ZERO React re-renders on mousemove!)
  const ropeBendX = useMotionValue(12);
  const ropeBendY = useMotionValue(50);
  const ropeBendXPlus = useTransform(ropeBendX, (x) => x + 6);
  const ropeBendXMinus = useTransform(ropeBendX, (x) => x - 6);

  const mainPathD = useTransform(
    [ropeBendX, ropeBendY],
    ([x, y]) => `M 12,-200 Q ${x},${y} 12,100`
  );
  const stroke1PathD = useTransform(
    [ropeBendXPlus, ropeBendY],
    ([x, y]) => `M 12,-200 Q ${x},${y} 12,100`
  );
  const stroke2PathD = useTransform(
    [ropeBendXMinus, ropeBendY],
    ([x, y]) => `M 12,-200 Q ${x},${y} 12,100`
  );

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Detect scroll direction (down vs up)
      if (currentScrollY > lastScrollY.current + 3) {
        setScrollDir('down');
      } else if (currentScrollY < lastScrollY.current - 3) {
        setScrollDir('up');
      }
      lastScrollY.current = currentScrollY;

      // Toggle web net burst only once when scroll starts to avoid state spam
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        setShowWebNet(true);
      }

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (netHideTimeoutRef.current) clearTimeout(netHideTimeoutRef.current);

      // When scroll stops after 150ms of stillness
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        setScrollDir('idle');
        // Hold movie web net for 800ms, then vanish
        netHideTimeoutRef.current = setTimeout(() => {
          setShowWebNet(false);
        }, 800);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (netHideTimeoutRef.current) clearTimeout(netHideTimeoutRef.current);
    };
  }, []);

  // Handle high-performance mouse movement without triggering React component re-renders
  const handlePositionChange = (pos: { x: number; y: number }) => {
    ropeBendX.set(12 + pos.x * 0.45);
    ropeBendY.set(50 + pos.y * 0.25);
  };

  // Compute smooth continuous scroll metrics
  const scrollRatio = Math.min(1, scrollY / 400);

  // Position: starts centered in hero (50%), moves smoothly to right (82%) when scrolling down
  const spiderLeft = 50 + scrollRatio * 32;

  // Vertical rope length (vh): from top ceiling down to Spider-Man
  const ropeHeightVh = 44 + scrollRatio * 16;

  // Scale: starts at 1.0 in hero, smoothly shrinks to 0.52 when scrolling down to avoid blocking content
  const spiderScale = 1 - scrollRatio * 0.48;

  // Rotation swing physics: leans in scroll direction
  const spiderRotate =
    scrollDir === 'down' ? -7 : scrollDir === 'up' ? 7 : 0;

  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-x-clip bg-transparent">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full z-30">
        <nav className="w-full flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Heading Container */}
      <div className="w-full overflow-hidden flex justify-center items-center relative z-0">
        <FadeIn delay={0.15} y={40} className="w-full text-center">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5 select-none">
            Hi, i&apos;m Joy
          </h1>
        </FadeIn>
      </div>

      {/* SINGLE UNIFIED ASSEMBLY: Web Rope + Spider-Man scaled together */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <div
          className="absolute flex flex-col items-center transition-all duration-200 ease-out pointer-events-none origin-top"
          style={{
            left: `${spiderLeft}%`,
            top: '0px',
            transform: `translateX(-50%) scale(${spiderScale}) rotate(${spiderRotate}deg)`,
          }}
        >
          {/* Expanded interaction Magnet wrapper: large padding & smooth mouse movement */}
          <Magnet
            padding={320}
            strength={1.6}
            activeTransition="transform 0.2s ease-out"
            inactiveTransition="transform 0.5s ease-in-out"
            onPositionChange={handlePositionChange}
            className="flex flex-col items-center relative overflow-visible"
          >
            {/* 1. Realistic Multi-Strand Movie Web Rope: Bends dynamically via MotionValues (0 React re-renders!) */}
            <div
              className="w-10 flex justify-center transition-all duration-150 relative z-0 -mb-10 sm:-mb-14 md:-mb-20"
              style={{ height: `${ropeHeightVh}vh` }}
            >
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 24 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="movieWebGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="85%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                  <filter id="webGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Dark backing stroke for high contrast on light/dark backgrounds */}
                <motion.path
                  d={mainPathD}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="5"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Main glowing white web core with elastic curve bending */}
                <motion.path
                  d={mainPathD}
                  stroke="url(#movieWebGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  filter="url(#webGlow)"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Interwoven twisted web strands flexing with curve */}
                <motion.path
                  d={stroke1PathD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.path
                  d={stroke2PathD}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1.2"
                  opacity="0.9"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* 2. Spider-Man Character: Sits DIRECTLY over the rope, hiding the bottom 140px behind his center back */}
            <div className="relative z-10 flex items-center justify-center">
              {/* Movie-Style Spider-Web Net (Flashes on scroll, then vanishes) */}
              <AnimatePresence>
                {showWebNet && (
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1.35, opacity: 0.95, rotate: 0 }}
                    exit={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute z-0 pointer-events-none w-[320px] sm:w-[420px] md:w-[500px] h-[320px] sm:h-[420px] md:h-[500px]"
                  >
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.95)]"
                      fill="none"
                    >
                      {/* Dark backing web lines for contrast on any background */}
                      <g stroke="rgba(0,0,0,0.5)" strokeWidth="3">
                        <line x1="100" y1="0" x2="100" y2="200" />
                        <line x1="0" y1="100" x2="200" y2="100" />
                        <line x1="29" y1="29" x2="171" y2="171" />
                        <line x1="171" y1="29" x2="29" y2="171" />
                        <path d="M100,25 Q122,35 153,47 Q165,78 175,100 Q165,122 153,153 Q122,165 100,175 Q78,165 47,153 Q35,122 25,100 Q35,78 47,47 Q78,35 100,25 Z" />
                        <path d="M100,45 Q115,52 138,62 Q145,85 155,100 Q145,115 138,138 Q115,145 100,155 Q85,145 62,138 Q55,115 45,100 Q55,85 62,62 Q85,52 100,45 Z" />
                        <path d="M100,65 Q108,70 124,76 Q128,90 135,100 Q128,110 124,124 Q110,128 100,135 Q90,128 76,124 Q70,110 65,100 Q70,90 76,76 Q90,70 100,65 Z" />
                        <path d="M100,82 Q105,85 112,88 Q115,95 118,100 Q115,105 112,112 Q105,115 100,118 Q95,115 88,112 Q85,105 82,100 Q85,95 88,88 Q95,85 100,82 Z" />
                      </g>

                      {/* Bright White Movie Web Strands */}
                      <g stroke="#FFFFFF" strokeWidth="1.6">
                        <line x1="100" y1="0" x2="100" y2="200" />
                        <line x1="0" y1="100" x2="200" y2="100" />
                        <line x1="29" y1="29" x2="171" y2="171" />
                        <line x1="171" y1="29" x2="29" y2="171" />
                        <path d="M100,25 Q122,35 153,47 Q165,78 175,100 Q165,122 153,153 Q122,165 100,175 Q78,165 47,153 Q35,122 25,100 Q35,78 47,47 Q78,35 100,25 Z" />
                        <path d="M100,45 Q115,52 138,62 Q145,85 155,100 Q145,115 138,138 Q115,145 100,155 Q85,145 62,138 Q55,115 45,100 Q55,85 62,62 Q85,52 100,45 Z" />
                        <path d="M100,65 Q108,70 124,76 Q128,90 135,100 Q128,110 124,124 Q110,128 100,135 Q90,128 76,124 Q70,110 65,100 Q70,90 76,76 Q90,70 100,65 Z" />
                        <path d="M100,82 Q105,85 112,88 Q115,95 118,100 Q115,105 112,112 Q105,115 100,118 Q95,115 88,112 Q85,105 82,100 Q85,95 88,88 Q95,85 100,82 Z" />
                      </g>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Spider-Man Image */}
              <div className="w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] relative z-10">
                <img
                  src={spidermanImg}
                  alt="3D Spider-Man Hero"
                  className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] filter brightness-105"
                />
              </div>
            </div>
          </Magnet>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 z-30">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            Let&apos;s Build
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};
