import { Box, keyframes } from '@mui/system';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const RealtimeCollaboration = () => {
  const containerRef = useRef<any>(null);
  const [cursor1Position, setCursor1Position] = useState({ x: 0, y: 0 });
  const [cursor2Position, setCursor2Position] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePosition({ x: mouseX, y: mouseY });

    const percentX = (mouseX / rect.width) * 100 - 50;
    const percentY = (mouseY / rect.height) * 100 - 50;

    const cursor1TransformX =
      mouseX > rect.width / 3 ? percentX * 2 : percentX * 0.8;
    const cursor1TransformY =
      mouseY > rect.height / 2 ? percentY * -1.2 : percentY * -1.8;

    const cursor2TransformX =
      mouseX > rect.width / 2 ? percentX * -2.5 : percentX * 1.4;
    const cursor2TransformY =
      mouseY > rect.height / 2 ? percentY * 1.2 : percentY * 2.2;

    setCursor1Position({ x: cursor1TransformX, y: cursor1TransformY });
    setCursor2Position({ x: cursor2TransformX, y: cursor2TransformY });
  };

  const handleMouseLeave = () => {
    setCursor1Position({ x: 0, y: 0 });
    setCursor2Position({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const Dot = ({ delay = 0, color = 'rgb(137 137 137)' }) => (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        animation: `${pulseKeyframe} .6s cubic-bezier(.4,0,.6,1) ${delay}s infinite`,
        animationPlayState: isHovered ? 'running' : 'paused',
      }}
    />
  );

  return (
    <Box>
      <Box
        ref={containerRef}
        sx={{
          width: 340,
          height: 280,
          position: 'relative',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            maskImage: 'radial-gradient(circle, black 10%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(circle, black 10%, transparent 100%)',
            svg: {
              position: 'absolute',
              inset: 0,
              width: 480,
            },
          }}
        >
          <GridSvg />
        </Box>

        {isHovered && (
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              zIndex: 3,
              transform: `translate(${mousePosition.x + 30}px, ${
                mousePosition.y - 15
              }px)`,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                gap: '4px',
                background: '#022323',
                padding: '6px 10px',
                borderRadius: '999px',
                border: '1px solid #20dfd6',
              }}
            >
              <Dot delay={0} color="#20dfd6" />
              <Dot delay={0.2} color="#20dfd6" />
              <Dot delay={0.4} color="#20dfd6" />
            </Box>
          </div>
        )}

        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            left: '30%',
            willChange: 'transform',
          }}
          animate={{
            x: `calc(${cursor1Position.x}px - 50%)`,
            y: `calc(${cursor1Position.y}px - 50%)`,
          }}
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 0.75,
          }}
        >
          <ArrowCursorIcon />
          <Box
            sx={{
              width: 65,
              height: 32,
              borderRadius: '999px',
              position: 'absolute',
              left: '100%',
              top: -24,
              background: 'rgb(31 31 31)',
              border: '1px solid rgb(137 137 137 / 70%)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </Box>
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            top: '80%',
            left: '65%',
            willChange: 'transform',
            scale: 0.8,
          }}
          animate={{
            x: `calc(${cursor2Position.x}px - 50%)`,
            y: `calc(${cursor2Position.y}px - 50%)`,
          }}
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 1,
          }}
        >
          <ArrowCursorIcon />
          <Box
            sx={{
              width: 65,
              height: 32,
              borderRadius: '999px',
              position: 'absolute',
              left: '100%',
              top: -24,
              background: 'rgb(31 31 31)',
              border: '1px solid rgb(137 137 137 / 70%)',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              display: isHovered ? 'flex' : 'none',
            }}
          >
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

const ArrowCursorIcon = () => (
  <svg
    height="30"
    viewBox="0 0 30 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.58385 1.69742C2.57836 0.865603 1.05859 1.58076 1.05859 2.88572V35.6296C1.05859 37.1049 2.93111 37.7381 3.8265 36.5656L12.5863 25.0943C12.6889 24.96 12.8483 24.8812 13.0173 24.8812H27.3245C28.7697 24.8812 29.4211 23.0719 28.3076 22.1507L3.58385 1.69742Z"
      fill="rgb(31 31 31)"
      stroke="rgb(137 137 137)"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const GridSvg = () => (
  <svg viewBox="0 0 330 431" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_401_8040)">
      <path
        d="M-16.542 -9.64038L-16.542 447.813M-2.54197 -9.64038L-2.54195 447.813M11.4581 -9.64038L11.4581 447.813M25.4581 -9.64038L25.4581 447.813M39.4581 -9.64038L39.4581 447.813M53.4581 -9.64038L53.4581 447.813M67.4581 -9.64038L67.4582 447.813M81.4582 -9.64038L81.4582 447.813M95.4582 -9.64038L95.4582 447.813M109.458 -9.64038L109.458 447.813M123.458 -9.64038L123.458 447.813M137.458 -9.64038L137.458 447.813M151.458 -9.64038L151.458 447.813M165.458 -9.64038L165.458 447.813M179.458 -9.64038L179.458 447.813M193.458 -9.64038L193.458 447.813M207.458 -9.64038L207.458 447.813M221.458 -9.64038L221.458 447.813M235.458 -9.64038L235.458 447.813M249.458 -9.64038L249.458 447.813M263.458 -9.64038L263.458 447.813M277.458 -9.64038L277.458 447.813M291.458 -9.64038L291.458 447.813M305.458 -9.64038L305.459 447.813M319.459 -9.64038L319.459 447.813M333.459 -9.64038L333.459 447.813M347.459 -9.64038L347.459 447.813M361.459 -9.64038L361.459 447.813M375.459 -9.64038L375.459 447.813M440.615 0.656494H-16.8379M440.615 14.6565H-16.8379M440.615 28.6565H-16.8379M440.615 42.6566H-16.8379M440.615 56.6566H-16.8379M440.615 70.6566H-16.8379M440.615 84.6566H-16.8379M440.615 98.6566H-16.8379M440.615 112.657H-16.8379M440.615 126.657H-16.8379M440.615 140.657H-16.8379M440.615 154.657H-16.8379M440.615 168.657H-16.8379M440.615 182.657H-16.8379M440.615 196.657H-16.8379M440.615 210.657H-16.8379M440.615 224.657H-16.8379M440.615 238.657H-16.8379M440.615 252.657H-16.8379M440.615 266.657H-16.8379M440.615 280.657H-16.8379M440.615 294.657H-16.8379M440.615 308.657H-16.8379M440.615 322.657H-16.8379M440.615 336.657H-16.8379M440.615 350.657H-16.8379M440.615 364.657H-16.8379M440.615 378.657H-16.8379M440.615 392.657H-16.8379M440.615 406.657H-16.8379M440.615 420.657H-16.8379M440.615 434.657H-16.8379"
        stroke="#222"
        stroke-width="0.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_401_8040">
        <rect
          width="330"
          height="430"
          fill="white"
          transform="translate(0 0.906494)"
        />
      </clipPath>
    </defs>
  </svg>
);

const pulseKeyframe = keyframes`
  50% {
      opacity: 0.5;
  }
`;

export default RealtimeCollaboration;
