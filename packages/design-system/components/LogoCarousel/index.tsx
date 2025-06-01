import { Box } from '@mui/system';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type LogoItem = string | React.ComponentType;

export interface LogoCarouselProps {
  logos: LogoItem[][];
}

const LogoCarousel = ({ logos }: LogoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % logos.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [logos]);

  const currentLogos = logos[currentIndex];
  const nextLogos = logos[(currentIndex + 1) % logos.length];

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          gridArea: '1 / 1',
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <AnimatePresence mode="popLayout">
          {currentLogos.map((logo, index) => (
            <Box
              component={motion.div}
              key={`${currentIndex}-${index}`}
              initial={{ opacity: 0, y: 40, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -40, filter: 'blur(5px)' }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 25,
                mass: 0.2,
                delay: 0.13 * index,
                opacity: {
                  delay: index * 0.13,
                  exit: { delay: 0 },
                },
                exit: {
                  delay: 0.1 * index,
                },
              }}
              sx={{
                willChange: 'filter',
                img: {
                  width: '100%',
                  height: '100%',
                },
                svg: {
                  width: '100%',
                  height: '100%',
                },
              }}
            >
              <LogoRenderer logo={logo} />
            </Box>
          ))}
        </AnimatePresence>
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          width: '100%',
          gridArea: '1 / 1',
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          visibility: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {nextLogos.map((logo, index) => (
          <Box
            key={`preload-${index}`}
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <LogoRenderer logo={logo} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const LogoRenderer = ({ logo }: { logo: string | React.ElementType }) => {
  if (typeof logo === 'string') {
    return (
      <Box
        component={'img'}
        src={logo}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    );
  }

  const LogoComponent = logo;
  return <LogoComponent />;
};

export default LogoCarousel;
