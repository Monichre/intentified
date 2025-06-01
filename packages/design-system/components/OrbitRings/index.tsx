import { Box } from '@mui/system';
import { keyframes } from '@emotion/react';

const CIRCLE_DIAMETER = 240;
const ITEM_SIZE = 48;
const LINE_SIZE = 104;
const GAP_BETWEEN_LINES = 32;

export interface OrbitRingsProps {
  icons: string[];
  logo: string;
}

const OrbitRings = (props: OrbitRingsProps) => {
  const { icons, logo } = props;

  return (
    <Box
      className="RuiOrbit-root"
      sx={{ position: 'relative', height: 328, width: 328 }}
    >
      <Box
        className="RuiOrbit-gradientsContainer"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.25,
          animation: `${rotateGradientsKeyframe} 10s linear infinite`,
          willChange: 'transform',
        }}
      >
        {Array.from({ length: 8 }, (_, index) => {
          const width = 104 + index * 32;
          const height = 104 + index * 32;

          return (
            <Box
              key={index}
              className="RuiOrbit-gradientLine"
              sx={{
                position: 'absolute',
                borderRadius: '9999px',
                width,
                height,
                top: `calc(50% - ${width / 2}px)`,
                left: `calc(50% - ${width / 2}px)`,
                transform: `rotate(-${index * 16}deg)`,

                '&:before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'inherit',
                  mask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                  maskComposite: 'xor',
                  padding: '1px',
                  pointerEvents: 'none',
                  background:
                    'conic-gradient(rgba(109,46,255,0) 6.7%,rgba(158,122,255,.35) 20.8%,rgba(254,139,187,.7) 34.9%,#ffbd7a 49.99%,rgba(255,189,122,0) 50%)',
                },
              }}
            />
          );
        })}
      </Box>
      <Box className="RuiOrbit-circlesContainer">
        {Array.from({ length: 8 }, (_, index) => {
          const size = LINE_SIZE + index * GAP_BETWEEN_LINES;

          return (
            <Box
              key={index}
              className="RuiOrbit-circleLine"
              sx={{
                position: 'absolute',
                width: size,
                height: size,
                top: `calc(50% - ${size / 2}px)`,
                left: `calc(50% - ${size / 2}px)`,
                borderRadius: '9999px',

                '&:before': {
                  content: '""',
                  inset: 0,
                  position: 'absolute',
                  padding: '1px',
                  background: 'rgba(235, 235 ,255, .06)',
                  pointerEvents: 'none',
                  mask: 'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
                  borderRadius: 'inherit',
                  maskComposite: 'xor',
                },
              }}
            />
          );
        })}
      </Box>
      <Box
        className="RuiOrbit-itemsContainer"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          width: CIRCLE_DIAMETER,
          height: CIRCLE_DIAMETER,
          animation: `${rotateContainerKeyframe} 80s linear infinite`, // rotate opposite side, so images don't get rotated
          willChange: 'transform',
        }}
      >
        {icons.map((icon, index) => {
          const radius = CIRCLE_DIAMETER / 2;
          const centerX = radius;
          const centerY = radius;
          const totalIcons = icons.length;

          const angle = (index / totalIcons) * 2 * Math.PI;
          const x = centerX + radius * Math.cos(angle) - ITEM_SIZE / 2;
          const y = centerY + radius * Math.sin(angle) - ITEM_SIZE / 2;

          return (
            <Box
              key={index}
              className="RuiOrbit-item"
              sx={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(39, 39, 42, 1)',
                border: '1px solid rgba(84, 84, 89, 0.65)',
                backgroundImage:
                  'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0) 67%)',
                position: 'absolute',
                left: x,
                top: y,
                animation: `${rotateIconKeyframe} 80s linear infinite`,
                willChange: 'transform',
              }}
            >
              <img src={icon} />
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          img: {
            width: 64,
            filter: 'grayscale(1)',
          },
        }}
      >
        <img className="RuiOrbit-logo" src={logo} />
      </Box>
    </Box>
  );
};

const rotateGradientsKeyframe = keyframes`
0% {
  transform: translateZ(0) rotate(0)
}

50% {
  transform: translateZ(0) rotate(0.5turn)
}

100% {
  transform: translateZ(0) rotate(1turn)
}
`;

const rotateContainerKeyframe = keyframes`
from {
    transform: translateX(-50%) translateY(-50%) translateZ(0) rotate(0turn)
  }
to {
  transform: translateX(-50%) translateY(-50%) translateZ(0) rotate(-1turn)
}
`;

const rotateIconKeyframe = keyframes`
from {
  transform: translateZ(0) rotate(0turn)
}
to {
  transform: translateZ(0) rotate(1turn)
}
`;
export default OrbitRings;
