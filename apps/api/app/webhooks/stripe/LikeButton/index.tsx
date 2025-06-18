import { Box } from '@mui/system';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface LikeButtonProps {
  count?: number;
  isLiked?: boolean;
  onClick?: () => void;
}

const transition = {
  type: 'spring',
  stiffness: 600,
  damping: 100,
  duration: 0.5,
};

const LikeButton = (props: LikeButtonProps) => {
  const { onClick, count = 0, isLiked: isLikedProp = false } = props;
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isLiked, setIsLiked] = useState(isLikedProp);

  const handleClick = () => {
    if (!isLiked) {
      setShouldAnimate(prevState => !prevState);
    }
    setIsLiked(prevState => !prevState);
    onClick?.();
  };

  useEffect(() => {
    if (shouldAnimate) {
      let tid = setTimeout(() => {
        setShouldAnimate(prevState => !prevState);
      }, 520);

      return () => {
        clearTimeout(tid);
      };
    }
  }, [shouldAnimate]);

  return (
    <Box
      component={motion.div}
      layout
      sx={{
        height: 40,
        background: 'linear-gradient(rgb(35 35 35) 0%, rgb(28 28 28) 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        transition: 'background 0.2s ease-out',
        boxShadow:
          'rgba(255, 255, 255, 0.02) 1px 1px 0px 0px inset, rgba(255, 255, 255, 0.02) -1px -1px 0px 0px inset, rgba(255, 255, 255, 0.02) 1px -1px 0px 0px inset, rgba(255, 255, 255, 0.02) -1px 1px 0px 0px inset, rgba(255, 255, 255, 0.05) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.175) 0px 4px 8px 0px',
        '&:hover': {
          background: 'linear-gradient(rgb(35 35 35) 0%, rgb(35 35 35) 100%)',
        },
        userSelect: 'none',
      }}
      onClick={handleClick}
    >
      <Box
        sx={{
          pl: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Box
          sx={{ position: 'relative', width: 20, height: 20, mt: '6px' }}
          tabIndex={-1}
        >
          <Box
            component={motion.div}
            animate={shouldAnimate ? { y: -6, x: -2, rotate: -2 } : {}}
            transition={{
              type: 'spring',
              stiffness: 800,
              damping: 100,
              duration: 0.5,
            }}
            sx={{
              position: 'absolute',
              zIndex: 2,
              left: '2px',
              bottom: '2px',
              display: 'flex',
            }}
          >
            <LikeIcon active={isLiked} />
          </Box>
          <Box
            component={motion.div}
            animate={shouldAnimate ? { y: -8, x: 1, rotate: 2 } : {}}
            transition={{
              type: 'spring',
              stiffness: 600,
              damping: 100,
              duration: 0.5,
              delay: 0.05,
            }}
            sx={{
              position: 'absolute',
              zIndex: 1,
              bottom: '8px',
              right: '-5px',
              display: 'flex',
            }}
          >
            <LikeIcon active={isLiked} />
          </Box>
          <AnimatePresence>{shouldAnimate && <Confetti />}</AnimatePresence>
        </Box>
        <Box sx={{ color: 'hsl(0 0% 99%)', fontWeight: 500 }}>
          {isLiked ? 'Liked' : 'Like'}
        </Box>
      </Box>
      <Box sx={{ py: '6px', height: '100%' }}>
        <Box
          sx={{
            width: '1px',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />
      </Box>
      <Box
        sx={{
          color: 'rgba(255, 255, 255, 0.45)',
          fontWeight: 500,
          py: '9px',
          pr: '16px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        component={motion.div}
        layout
      >
        {/* Hack so the container doesn't cut off due to numbers' widths */}
        <Box sx={{ visibility: 'hidden', height: 0, opacity: 0 }}>20</Box>
        <Box sx={{ visibility: 'hidden', height: 0, opacity: 0 }}>21</Box>
        <Box
          component={motion.span}
          sx={{
            position: isLiked ? 'absolute' : 'relative',
            opacity: isLiked ? 0 : 1,
            top: isLiked ? -22 : 0,
          }}
          animate={{
            opacity: isLiked ? 0 : 1,
            top: isLiked ? -22 : 0,
          }}
          transition={{
            type: 'spring',
            damping: 60,
            stiffness: 500,
            duration: 0.3,
            ease: [0.45, 0, 0.55, 1],
          }}
        >
          {count}
        </Box>
        <Box
          component={motion.span}
          sx={{
            position: isLiked ? 'relative' : 'absolute',
            opacity: isLiked ? 1 : 0,
            bottom: isLiked ? 0 : -22,
          }}
          animate={{
            color: 'hsl(0 0% 99%)',
            opacity: isLiked ? 1 : 0,
            bottom: isLiked ? 0 : -22,
          }}
          transition={{
            type: 'spring',
            damping: 60,
            stiffness: 500,
            duration: 0.3,
            ease: [0.45, 0, 0.55, 1],
          }}
        >
          {count + 1}
        </Box>
      </Box>
    </Box>
  );
};

const LikeIcon = ({ active }: { active?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    stroke={active ? 'hsl(0 0% 99%)' : '#8c8c8c'}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2.5"
    viewBox="0 0 25 25"
    fill={active ? 'hsl(0 0% 99%)' : 'rgb(35, 35, 35)'}
    style={{
      filter:
        'drop-shadow(2px 0 0 rgb(35 35 35)) drop-shadow(-2px 0 0 rgb(35 35 35)) drop-shadow(0 2px 0 rgb(35 35 35)) drop-shadow(0 -2px 0 rgb(35 35 35))',
    }}
  >
    <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2a3.13 3.13 0 013 3.88z"></path>
  </svg>
);

const Confetti = () => {
  const variants = {
    initial: {
      opacity: 0,
      scale: 0,
    },
    animate: (e: any) => {
      return {
        opacity: 1,
        scale: 1,
        x: e.animateX,
        y: e.animateY,
        rotate: e.animateRotate ?? 0,
      };
    },
    exit: (e: any) => {
      var t;
      return {
        opacity: 0.5,
        scale: 0,
        x: e.exitX,
        y: e.exitY,
        rotate: e.exitRotate ?? 0,
      };
    },
  };
  return (
    <>
      <Box
        component={motion.div}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{
          animateX: 8,
          animateY: -12,
          exitX: 18,
          exitY: -15,
        }}
        transition={{
          ...transition,
          stiffness: 600,
        }}
        sx={{
          position: 'absolute',
          background: 'hsl(0 0% 50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          bottom: -14,
          right: 1,
        }}
      />
      <Box
        component={motion.div}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{
          animateX: 7,
          animateY: -14,
          exitX: 27,
          exitY: -10,
        }}
        transition={{
          ...transition,
          stiffness: 500,
        }}
        sx={{
          position: 'absolute',
          background: 'hsl(0 0% 50%)',
          width: 8,
          height: 8,
          borderRadius: '50%',
          bottom: -4,
          right: -10,
        }}
      />
      <Box
        component={motion.div}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{
          animateX: 8,
          animateY: -26,
          exitX: 13,
          exitY: -22,
        }}
        transition={{
          ...transition,
          stiffness: 800,
        }}
        sx={{
          position: 'absolute',
          background: 'hsl(0 0% 50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          top: 0,
          right: -1,
        }}
      />
      <Box
        component={motion.div}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{
          animateX: -26,
          animateY: -14,
          exitX: -30,
          exitY: -17,
        }}
        transition={{
          ...transition,
          stiffness: 600,
        }}
        sx={{
          position: 'absolute',
          background: 'hsl(0 0% 50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          left: 12,
          top: 8,
        }}
      />
      <Box
        component={motion.div}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{
          animateX: -12,
          animateY: -22,
          exitX: -16,
          exitY: -17,
          animateRotate: -30,
          exitRotate: -70,
        }}
        transition={{
          ...transition,
          stiffness: 600,
        }}
        sx={{
          position: 'absolute',
          left: 3,
          top: -15,
          display: 'flex',
        }}
      >
        <StarIcon />
      </Box>
      <Box
        component={motion.div}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={{
          animateX: 21,
          animateY: -7,
          exitX: 26,
          exitY: -5,
          animateRotate: 30,
          exitRotate: 70,
        }}
        transition={{
          ...transition,
          stiffness: 600,
        }}
        sx={{
          position: 'absolute',
          left: 10,
          top: -10,
          display: 'flex',
        }}
      >
        <StarIcon />
      </Box>
    </>
  );
};

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="hsl(0 0% 50%)"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default LikeButton;
