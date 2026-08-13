import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ word, progress, range }) => {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="inline-block mr-[0.35em] last:mr-0 transition-colors duration-200"
    >
      {word}
    </motion.span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const allWordsCount = paragraphs.reduce((acc, p) => acc + p.trim().split(/\s+/).length, 0);
  let globalWordCounter = 0;

  return (
    <div ref={containerRef} className={className}>
      {paragraphs.map((paragraphText, pIdx) => {
        const words = paragraphText.trim().split(/\s+/);
        return (
          <p key={`p-${pIdx}`} className="mb-4 sm:mb-6 last:mb-0">
            {words.map((word, wordIdx) => {
              const start = globalWordCounter / (allWordsCount || 1);
              const end = Math.min(1, start + 1 / (allWordsCount || 1));
              globalWordCounter++;

              return (
                <Word
                  key={`w-${pIdx}-${wordIdx}`}
                  word={word}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </p>
        );
      })}
    </div>
  );
};

export default AnimatedText;
