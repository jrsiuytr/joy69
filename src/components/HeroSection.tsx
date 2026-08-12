import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';
import { ContactButton } from './ContactButton';
import { KineticTextFlip } from './KineticTextFlip';
import spidermanImg from '../images/spiderman.webp';

export const HeroSection: React.FC = () => {
  const [showWebNet, setShowWebNet] = useState(false);

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const netHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Framer Motion continuous scroll progress across entire document
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.0001,
  });

  // Smooth continuous metric transforms across page scroll (Hero -> Footer)
  const spiderLeft = useTransform(smoothProgress, [0, 0.18, 0.85, 1], ['50%', '82%', '82%', '82%']);
  const ropeHeightVh = useTransform(smoothProgress, [0, 0.18, 1], [44, 58, 62]);
  const ropeHeightPx = useTransform(ropeHeightVh, (v) => `${v}vh`);
  const spiderScale = useTransform(smoothProgress, [0, 0.18, 1], [1.0, 0.58, 0.52]);
  const footerLift = useTransform(smoothProgress, [0.85, 1], [0, 140]);
  const footerY = useTransform(footerLift, (v) => -v);

  // 60fps GPU pendulum spring physics for Spider-Man & Web Rope swing (Generous freedom of movement!)
  const rawSwingX = useMotionValue(0);
  const rawSwingY = useMotionValue(0);

  const swingX = useSpring(rawSwingX, { stiffness: 110, damping: 18, mass: 0.5 });
  const swingY = useSpring(rawSwingY, { stiffness: 110, damping: 18, mass: 0.5 });

  // Web Rope SVG path control points curve elastically relative to Spider-Man's swing
  const ropeBendX = useTransform(swingX, (x) => 12 - x * 0.32);
  const ropeBendY = useTransform(swingY, (y) => 50 - y * 0.22);
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Temporarily disable CSS scroll-behavior to prevent browser interpolation conflict & vibration glitch
        document.documentElement.style.scrollBehavior = 'auto';

        const targetY = targetElement.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
        const startY = window.scrollY || window.pageYOffset;
        const distance = targetY - startY;
        const duration = 950; // 950ms silky ease-in-out transition
        let startTime: number | null = null;

        const easeInOutQuint = (t: number) => {
          return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
        };

        const step = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = easeInOutQuint(progress);

          window.scrollTo(0, startY + distance * easeProgress);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            // Restore default scrollBehavior after smooth transition completes
            document.documentElement.style.scrollBehavior = '';
          }
        };

        requestAnimationFrame(step);
        window.history.pushState(null, '', href);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentLeftRatio = smoothProgress.get() > 0.18 ? 0.82 : 0.5;
      const centerX = window.innerWidth * currentLeftRatio;
      const centerY = window.innerHeight * 0.45;

      // Full screen viewport mouse tracking for wide freedom of motion
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      rawSwingX.set(dx * 0.45);
      rawSwingY.set(dy * 0.35);
    };

    const handleMouseLeave = () => {
      rawSwingX.set(0);
      rawSwingY.set(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const currentLeftRatio = smoothProgress.get() > 0.18 ? 0.82 : 0.5;
        const centerX = window.innerWidth * currentLeftRatio;
        const centerY = window.innerHeight * 0.45;

        const dx = touch.clientX - centerX;
        const dy = touch.clientY - centerY;

        rawSwingX.set(dx * 0.45);
        rawSwingY.set(dy * 0.35);
      }
    };

    const handleTouchEnd = () => {
      rawSwingX.set(0);
      rawSwingY.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [rawSwingX, rawSwingY, smoothProgress]);

  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-x-clip bg-transparent">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full z-30">
        <nav className="w-full flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="group text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            >
              <KineticTextFlip text={link.label} />
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

      {/* SINGLE UNIFIED ASSEMBLY: Web Rope + Spider-Man scaled together inside Viewport (Framer Motion 60FPS GPU) */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-visible">
        <motion.div
          className="absolute flex flex-col items-center pointer-events-none origin-top"
          style={{
            left: spiderLeft,
            y: footerY,
            x: '-50%',
            scale: spiderScale,
          }}
        >
          {/* Single Unified Pendulum Assembly: Spider-Man & Web Rope move in 100% synchronized physics */}
          <motion.div
            className="flex flex-col items-center relative overflow-visible pointer-events-none"
            style={{
              x: swingX,
              y: swingY,
            }}
          >
            {/* 1. Realistic Multi-Strand Movie Web Rope: Bends dynamically via MotionValues (0 React re-renders!) */}
            <motion.div
              className="w-10 flex justify-center relative z-0 -mb-10 sm:-mb-14 md:-mb-20"
              style={{ height: ropeHeightPx }}
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
            </motion.div>

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
          </motion.div>
        </motion.div>
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
