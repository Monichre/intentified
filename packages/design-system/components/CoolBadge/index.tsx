import { Box } from '@mui/system';
import { keyframes } from '@emotion/react';

export interface CoolBadgeProps {
  color?: 'blue' | 'green';
  label?: string;
}

const rotateKeyframe = keyframes`
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(1turn)
  }
`;

const CoolBadge = (props: CoolBadgeProps) => {
  const { color = 'green', label } = props;

  return (
    <Box
      sx={{
        py: '4px',
        px: '10px',
        borderRadius: '9999px',
        overflow: 'hidden',
        display: 'inline-flex',
        position: 'relative',

        ...(color === 'blue' && {
          background: '#d1e7ff',
        }),

        ...(color === 'green' && {
          background: '#152829',
        }),
      }}
    >
      <Box
        sx={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          borderRadius: 'inherit',
          ...(color === 'blue' && {
            border: '1px solid #b7dbff',
          }),
          ...(color === 'green' && {
            border: '1px solid #194b3a',
          }),
        }}
      >
        <Box
          sx={{
            animation: `${rotateKeyframe} 4s linear infinite`,
            position: 'absolute',
            inset: -1,
            ...(color === 'blue' && {
              background:
                'conic-gradient(from 45deg at 50% 50%,#b7dbff,#0080ff80,#b7dbff,#b7dbff,#b7dbff,#0080ff,#b7dbff,#b7dbff,#b7dbff)',
            }),
            ...(color === 'green' && {
              background:
                'conic-gradient(from 45deg at 50% 50%, #194b3a, #26d97f66, #194b3a, #194b3a, #194b3a, #26d97f, #194b3a, #194b3a, #194b3a)',
            }),
          }}
        />
      </Box>
      <Box
        sx={{
          fontWeight: 500,
          fontSize: 11,
          ...(color === 'blue' && {
            color: '#0080ff',
          }),
          ...(color === 'green' && {
            color: '#26d97f',
          }),
        }}
      >
        {label}
      </Box>
    </Box>
  );
};

export default CoolBadge;
