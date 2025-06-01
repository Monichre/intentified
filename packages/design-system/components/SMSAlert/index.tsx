import { Box, Stack } from '@mui/system';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface SMSAlertProps {
  title?: string;
  description?: string;
}

const SMSAlert = (props: SMSAlertProps) => {
  const { title, description } = props;
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldAnimate(prev => !prev);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{
        transform: 'translateY(0rem) scale(0.98)',
      }}
      animate={
        shouldAnimate
          ? {
              transform: 'translateY(-32px) scale(1)',
            }
          : {}
      }
      transition={{
        duration: 0.5,
      }}
      sx={{
        transform: 'translateY(0rem) scale(0.98)',
        height: 182,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: 252,
          height: 212,
          mx: 'auto',
          boxShadow:
            '0 1px 0 0 rgb(255 255 255 / 0.05) inset, 0px 2px 5px 0 rgb(0 0 0 / 0.40)',
          backgroundImage:
            'linear-gradient(180deg, rgb(255 255 255 / 0.05) 0%, rgb(255 255 255 / 0) 80.19%)',
          borderTopRightRadius: '42px',
          borderTopLeftRadius: '42px',
          padding: '6px',
          backgroundColor: 'rgb(32 32 34)',
        }}
      >
        <Box
          sx={{
            padding: '12px 20px 0 20px',
            background: 'rgba(19, 19, 22, 0.5)',
            height: 194,
            borderTopRightRadius: '36px',
            borderTopLeftRadius: '36px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            component={motion.div}
            initial={{
              backgroundColor: 'rgb(19, 19, 22)',
              boxShadow: '0 1px rgb(255 255 255 / 0.05)',
            }}
            animate={
              shouldAnimate
                ? {
                    backgroundColor: '#5dff78',
                    boxShadow:
                      '0 0 8px 1px rgb(107 231 255 / 0.3), 0 1px rgb(255 255 255 / 0.2) inset',
                  }
                : {}
            }
            sx={{
              background: 'rgb(19, 19, 22)',
              boxShadow: 'rgba(255, 255, 255, 0.05) 0px 1px',
              borderRadius: '9999px',
              width: 24,
              height: 24,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              svg: { width: 11, height: 11, color: '#747686' },
            }}
          >
            <LockIcon shouldAnimate={shouldAnimate} />
          </Box>
          <Box
            component={motion.div}
            initial={{
              transform: 'translateY(-6.5rem) scale(.9)',
              opacity: 0.5,
              filter: 'blur(2px)',
            }}
            animate={
              shouldAnimate
                ? {
                    transform: 'translateY(0rem) scale(1)',
                    opacity: 1,
                    filter: 'blur(0px)',
                  }
                : {}
            }
            transition={{
              type: 'spring',
              bounce: 0.2,
              duration: 0.6,
              delay: 0.2,
            }}
            sx={{
              position: 'absolute',
              padding: '8px',
              borderRadius: '14px',
              background: 'rgb(47 48 55)',
              top: '48px',
              left: '8px',
              right: '8px',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow:
                '0 6px 12px rgb(19 19 22 / 0.6), 0 1px rgb(255 255 255 / 0.03) inset',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                backgroundColor: 'rgb(66, 67, 77)',
                flexShrink: 0,
                boxShadow: '0 1px rgb(255 255 255 / 0.05) inset',
                backgroundImage:
                  'radial-gradient(circle at top, rgb(114 233 255 / 0.2), rgb(114 233 255 / 0))',
              }}
            >
              <SMSIcon />
            </Box>
            <Stack sx={{ gap: '2px', minWidth: 0 }}>
              <Box sx={{ color: '#5dff78', fontWeight: 500, fontSize: 11 }}>
                {title}
              </Box>
              <Box
                sx={{
                  color: 'rgb(217 217 222)',
                  fontSize: 11,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {description}
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              mt: '24px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              rowGap: '16px',
              columnGap: '8px',
            }}
          >
            {Array.from({ length: 8 }, (_, index) => (
              <Box
                key={index}
                sx={{
                  boxShadow: '0 1px rgb(255 255 255 / 0.05) inset',
                  background: 'rgb(47 48 55)',
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(to top, #161616, rgba(22,22,22,0))',
        }}
      />
    </Box>
  );
};

const LockIcon = ({ shouldAnimate }: { shouldAnimate: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <motion.path
      initial={{ fill: '#747686' }}
      animate={shouldAnimate ? { fill: '#043048' } : {}}
      transition={{
        duration: 0.4,
      }}
      fill="currentColor"
      d="M80 192v-48C80 64.47 144.5 0 224 0s144 64.47 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V256c0-35.3 28.65-64 64-64h16zm64 0h160v-48c0-44.18-35.8-80-80-80s-80 35.82-80 80v48z"
    />
  </svg>
);

const SMSIcon = () => {
  return (
    <svg viewBox="0 0 40 40" fill="none">
      <g filter="url(#filter0_di_5116_3367)">
        <path
          fill="#5dff78"
          fillRule="evenodd"
          d="M20 32c6.627 0 12-5.373 12-12S26.627 8 20 8 8 13.373 8 20s5.373 12 12 12Zm6-12c0 2.761-2.686 5-6 5a7.2 7.2 0 0 1-1.163-.094 1.227 1.227 0 0 0-.79.14c-.613.34-1.308.571-1.983.72-.82.182-1.314-.759-.895-1.485.04-.07.08-.14.119-.212.21-.382.099-.846-.184-1.178C14.409 22.075 14 21.077 14 20c0-2.761 2.686-5 6-5s6 2.239 6 5Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_5116_3367"
          width="42"
          height="42"
          x="-1"
          y="-1"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="1"
            result="effect1_dropShadow_5116_3367"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.419608 0 0 0 0 0.905882 0 0 0 0 1 0 0 0 0.3 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_5116_3367"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_5116_3367"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="1" />
          <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" />
          <feBlend in2="shape" result="effect2_innerShadow_5116_3367" />
        </filter>
      </defs>
    </svg>
  );
};

export default SMSAlert;
