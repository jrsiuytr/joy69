import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharProps> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0.35, 1]);
  const scale = useTransform(progress, range, [0.96, 1]);
  const textShadow = useTransform(
    progress,
    range,
    [
      '0px 0px 0px rgba(255,255,255,0)',
      '0px 0px 16px rgba(255,255,255,0.95)'
    ]
  );

  return (
    <span className="relative inline-block">
      <span className="opacity-30 text-gray-400">{char}</span>
      <motion.span
        style={{ opacity, scale, textShadow }}
        className="absolute left-0 top-0 text-white font-inherit"
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const totalChars = text.length;
  let charCounter = 0;

  return (
    <div ref={containerRef} className={className}>
      {paragraphs.map((paragraphText, pIdx) => {
        const words = paragraphText.trim().split(/\s+/);
        return (
          <p key={`p-${pIdx}`} className="mb-4 sm:mb-6 last:mb-0">
            {words.map((word, wordIdx) => {
              const wordChars = word.split('');
              const wordStartIndex = charCounter;
              charCounter += wordChars.length + 1;

              return (
                <span key={`w-${pIdx}-${wordIdx}`} className="inline-block whitespace-nowrap mr-[0.32em] last:mr-0">
                  {wordChars.map((char, charIdx) => {
                    const globalIndex = wordStartIndex + charIdx;
                    const start = globalIndex / totalChars;
                    const end = Math.min(1, start + 1 / totalChars);

                    return (
                      <Character
                        key={`c-${pIdx}-${wordIdx}-${charIdx}`}
                        char={char}
                        progress={scrollYProgress}
                        range={[start, end]}
                      />
                    );
                  })}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};


