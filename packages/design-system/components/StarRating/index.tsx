import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/system';

export interface StarRatingProps {
  rating?: number;
  size?: number;
}

const StarRating = (props: StarRatingProps) => {
  const { rating = 0, size = 16 } = props;
  const [animated, setAnimated] = useState(false);
  const totalStars = 5;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const Particle = ({ delay }: { delay: number }) => (
    <Box sx={{ position: 'absolute', top: 2, left: 2 }}>
      <Box
        component={motion.div}
        sx={{
          position: 'absolute',
          width: 2,
          height: 2,
          background: '#FFED76',
          borderRadius: '50%',
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 1, 0],
          opacity: [1, 1, 0],
          x: [0, (Math.random() - 0.5) * 40],
          y: [0, (Math.random() - 0.5) * 40],
        }}
        transition={{
          duration: 0.6,
          delay,
          ease: 'easeOut',
        }}
      />
    </Box>
  );

  const AnimatedStar = ({
    filled,
    index,
  }: {
    filled: boolean;
    index: number;
  }) => {
    return (
      <Box sx={{ position: 'relative' }}>
        <motion.div
          initial={{ scale: 1 }}
          animate={
            filled && animated
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }
              : {}
          }
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
        >
          <Box
            component={motion.svg}
            sx={{
              width: size,
              height: size,
              color: '#FFED76',
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
              initial={{ fill: 'transparent' }}
              animate={
                filled && animated
                  ? {
                      fill: ['transparent', '#FFED76'],
                    }
                  : {}
              }
              transition={{
                duration: 0.2,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            />
          </Box>
        </motion.div>

        {filled && animated && (
          <AnimatePresence>
            {Array.from({ length: 6 }).map((_, i) => (
              <Particle key={i} delay={index * 0.1 + i * 0.05 + 0.2} />
            ))}
          </AnimatePresence>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: totalStars }).map((_, index) => (
        <AnimatedStar key={index} filled={index < rating} index={index} />
      ))}
    </Box>
  );
};

export default StarRating;
