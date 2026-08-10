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
        className="absolute left-0 top-0 text-white font-bold"
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  const words = text.split(' ');
  const totalChars = text.length;
  let charCounter = 0;

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split('');
        const wordStartIndex = charCounter;
        charCounter += wordChars.length + 1;

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.32em] last:mr-0">
            {wordChars.map((char, charIdx) => {
              const globalIndex = wordStartIndex + charIdx;
              const start = globalIndex / totalChars;
              const end = Math.min(1, start + 1 / totalChars);

              return (
                <Character
                  key={charIdx}
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
};


