import React, { useState, useId, useRef, useLayoutEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

export interface TextCyclerProps {
  texts: string[];
  interval?: number;
  duration?: number;
  letterDelay?: number;
  blurStrength?: number;
  autoplay?: boolean;
}

const TextCycler = ({
  texts,
  interval = 4000,
  duration = 400,
  letterDelay = 0.025,
  blurStrength = 10,
  autoplay = true,
}: TextCyclerProps) => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [iteration, setIteration] = useState(0);
  const uniqueId = useId();
  const [isTabVisible, setIsTabVisible] = useState(true);

  useLayoutEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    setIsTabVisible(document.visibilityState === 'visible');

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useLayoutEffect(() => {
    if (!autoplay || !isTabVisible) return;

    const rotationTimer = setInterval(() => {
      setCurrentText(prevText => {
        const currentIndex = texts.indexOf(prevText);
        if (currentIndex === -1) return texts[0];

        const nextIndex = (currentIndex + 1) % texts.length;
        return texts[nextIndex];
      });
      setIteration(prev => prev + 1);
    }, interval);

    return () => clearInterval(rotationTimer);
  }, [isTabVisible, currentText, interval, texts, autoplay]);

  return (
    <>
      <AnimatePresence mode="popLayout" initial={false}>
        {currentText.split('').map((letter, index) => (
          <motion.span
            key={uniqueId + index + iteration}
            initial={{
              opacity: 0,
              filter: `blur(${blurStrength}px)`,
            }}
            style={{ display: 'inline-block' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: {
                delay: index * letterDelay,
                duration: duration / 1000,
              },
              transitionEnd: {
                filter: 'none',
              },
            }}
            exit={{
              opacity: 0,
              filter: `blur(${blurStrength}px)`,
              transition: {
                delay: index * letterDelay,
                duration: duration / 1000,
              },
            }}
          >
            {letter !== ' ' ? letter : '\u00A0'}
          </motion.span>
        ))}
      </AnimatePresence>
    </>
  );
};

export default TextCycler;
