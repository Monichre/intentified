import { Box } from '@mui/system';
import { useAnimate } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const WIDTH = 36;
const HEIGHT = 44;
const GAP = 12;

const MultifactorAuthentication = () => {
  const [isActive, setIsActive] = useState(false);
  const [scope, animate] = useAnimate();
  const randomNumbers = useMemo(
    () => Array.from({ length: 6 }, () => Math.floor(9 * Math.random() + 1)),
    [isActive]
  );

  useEffect(() => {
    setIsActive(true);
  }, [isActive]);

  const createAnimationStep = (index: number) => {
    const translateX = (WIDTH + GAP) * (index + 1) + 'px';

    return [
      {
        target: '[data-border="true"], [data-cursor="true"]',
        keyframes: {
          x: translateX,
        },
        options: {
          duration: 0.3,
          ease: [0.675, 0, 0.375, 1],
        },
      },
      {
        target: '[data-border="true"]',
        keyframes: {
          scale: [1, 0.9, 1],
        },
        options: {
          duration: 0.15,
          ease: [0.675, 0, 0.375, 1],
        },
      },
      {
        target: `[data-number]:nth-child(${index + 2}) span`,
        keyframes: {
          opacity: 1,
          scale: [0.1, 1],
        },
        options: {
          duration: 0.1,
        },
      },
    ];
  };

  const startAnimation = async () => {
    const borderAnimation = animate(
      '[data-border="true"]',
      {
        opacity: 1,
        scale: [1.5, 0.9, 1],
      },
      {
        duration: 0.3,
        delay: 0.5,
      }
    );

    const cursorAnimation = animate(
      '[data-cursor="true"]',
      {
        opacity: 1,
        y: [10, 0],
        scale: [1.75, 1],
      },
      {
        delay: 0.4,
        duration: 0.3,
        ease: [0.675, 0, 0.375, 1],
      }
    );

    await Promise.all([borderAnimation, cursorAnimation]);

    await animate(
      '[data-number]:nth-child(1) span',
      {
        opacity: 1,
        scale: 1,
      },
      {
        duration: 0.1,
        ease: [0.675, 0, 0.375, 1],
      }
    );

    for (let i = 0; i < 5; i++) {
      const step = createAnimationStep(i);
      for (let j = 0; j < step.length; j++) {
        const animationStep: any = step[j];
        await animate(
          animationStep.target,
          animationStep.keyframes,
          animationStep.options
        );
      }
    }

    await animate(
      '[data-border="true"], [data-cursor="true"], [data-number] span',
      {
        opacity: 0,
        scale: [1, 1.5],
      },
      {
        duration: 0.2,
      }
    );

    resetAnimation();
  };

  const resetAnimation = () => {
    animate(
      '[data-border="true"], [data-cursor="true"]',
      { opacity: 0, x: 0 },
      { duration: 0 }
    );
    animate('[data-number] span', { opacity: 0, scale: 0.1 }, { duration: 0 });

    setIsActive(false);
    setTimeout(() => setIsActive(true), 500);
  };

  useEffect(() => {
    if (isActive) {
      startAnimation();
    }
  }, [isActive]);

  return (
    <Box sx={{ position: 'relative' }} ref={scope}>
      <Box sx={{ display: 'flex', gap: `${GAP}px` }}>
        {Array.from({
          length: 6,
        }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: WIDTH,
              height: HEIGHT,
              background: '#c2e6eb0a',
              boxShadow:
                'inset 0 -6px 12px 0 rgba(199, 211, 234, 0), inset 0 1px 1px 0 rgba(199, 211, 234, 0)',
              position: 'relative',
              borderRadius: '8px',
              '&:before': {
                content: '""',
                borderRadius: 'inherit',
                position: 'absolute',
                inset: 0,
                border: '1px solid #c2e6eb1f',
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Box
          data-border={true}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '8px',
            width: WIDTH,
            height: HEIGHT,
            opacity: 0,
            boxShadow:
              'rgb(93, 227, 255) 0px 0px 0px 1px inset, rgba(107, 231, 255, 0.2) 0px 0px 4px 2px',
          }}
        />
        <Box
          data-cursor={true}
          sx={{
            width: 20,
            height: '1px',
            background: 'rgba(93,227,255,.4)',
            boxShadow: 'rgba(107, 231, 255, 0.4) 0px 0px 4px',
            position: 'absolute',
            left: `calc(${WIDTH}px - 20px - 2px - 5px)`,
            bottom: 6,
            opacity: 0,
          }}
        />
        <Box sx={{ display: 'flex', gap: `${GAP}px` }}>
          {Array.from({
            length: 6,
          }).map((_, i) => (
            <Box
              data-number={true}
              key={i}
              sx={{
                width: WIDTH,
                height: HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                fontWeight: 500,
              }}
            >
              {isActive && (
                <Box
                  component={'span'}
                  sx={{ opacity: 0, transform: 'scale(0.1)', color: '#ededed' }}
                >
                  {randomNumbers[i]}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MultifactorAuthentication;
