import { Box } from '@mui/system';
import { keyframes } from '@emotion/react';

const shineKeyframe = keyframes`
  0% {
    transform: translateX(100%) rotate(45deg)
  }

  100% {
    transform: translateX(-100%) rotate(45deg)
  }
`;

export interface RainbowShineButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const RainbowShineButton = (props: RainbowShineButtonProps) => {
  return (
    <Box
      component="button"
      sx={{
        background:
          'linear-gradient(90deg, rgb(220, 206, 254) 0%, rgb(201, 233, 254) 25%, rgb(189, 255, 245) 50.18%, rgb(227, 255, 207) 75%, rgb(254, 254, 179) 100%)',
        color: '#171923',
        fontWeight: 600,
        height: 40,
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        px: '16px',
        py: '12px',
        fontFamily: 'inherit',
        borderRadius: '8px',
        lineHeight: 'normal',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',

        '&:before': {
          content: '""',
          width: '250%',
          height: '250%',
          position: 'absolute',
          zIndex: 1,
          pointerEvents: 'none',
          top: 0,
          left: 0,
          background:
            'linear-gradient(30deg,transparent 20%,transparent 45%,hsla(0,0%,100%, 0.75) 50%,transparent 55%,transparent)',
          transform: 'translateX(100%) rotate(45deg)',
          animation: `${shineKeyframe} 3s ease-in infinite`,
          animationDelay: '2s',
        },
      }}
      {...props}
    />
  );
};

export default RainbowShineButton;
