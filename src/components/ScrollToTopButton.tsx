import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    smoothScrollTo(0, 1100);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to Top"
            className="group relative p-3 sm:p-3.5 rounded-full bg-[#060814]/85 border border-white/20 hover:border-cyan-400/60 shadow-[0_0_25px_rgba(0,0,0,0.85)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] backdrop-blur-xl transition-all duration-300 active:scale-90 flex items-center justify-center cursor-pointer"
          >
            {/* Ambient Backlight Glow Disc */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/30 via-purple-600/30 to-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" />

            {/* Glowing Arrow Icon */}
            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-cyan-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 relative z-10" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
