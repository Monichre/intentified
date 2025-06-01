import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const easeInOutExpo = (e: number) =>
  e < 0.5
    ? 0.5 * Math.pow(2, 20 * e - 10)
    : -0.5 * Math.pow(2, -20 * e + 10) + 1;

const easeOutExpo = (e: number) => (1 === e ? 1 : 1 - Math.pow(2, -10 * e));

const OperatingSystems = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setShouldAnimate(true), 1000);
  }, []);

  return (
    <Box sx={{ pt: '130px' }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box
            component={motion.div}
            initial={{
              transform: 'rotateX(-90deg) translateX(-50%)',
              background: '#c4c3c3',
              width: 230,
            }}
            animate={
              shouldAnimate
                ? {
                    transform: 'rotateX(10deg) translateX(-50%)',
                    background: '#f3f3f3',
                    width: 190,
                  }
                : {
                    transform: 'rotateX(-90deg) translateX(-50%)',
                    background: '#c4c3c3',
                    width: 230,
                  }
            }
            transition={
              shouldAnimate
                ? {
                    background: {
                      duration: 0.5,
                    },
                    duration: 1,
                    ease: easeInOutExpo,
                  }
                : {
                    background: {
                      delay: 0.3,
                    },
                    duration: 1,
                    ease: easeInOutExpo,
                  }
            }
            sx={{
              width: 190,
              height: 132,
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px',
              border: '1px solid #ededed',
              boxShadow: '#e2e0e0 0px 0px 0px 2px inset',
              position: 'absolute',
              left: '50%',
              transformOrigin: 'bottom',
              bottom: 'calc(100% - 1px)',
              transformStyle: 'preserve-3d',
              perspective: '80px',

              '&:after': {
                content: '""',
                transform: 'rotateX(90deg) translateY(-1px)',
                position: 'absolute',
                top: 0,
                left: shouldAnimate ? '1px' : '-2px',
                right: shouldAnimate ? '1px' : '-2px',
                height: 3,
                borderRadius: '9999px',
                background: '#e2e0e0',
              },
            }}
          >
            <Box
              component={motion.div}
              initial={{ rotateX: '90deg' }}
              animate={
                shouldAnimate
                  ? { rotateX: '0deg', opacity: 0 }
                  : { rotateX: '90deg' }
              }
              transition={
                shouldAnimate
                  ? {
                      duration: 1,
                    }
                  : {
                      duration: 2,
                      ease: easeOutExpo,
                      delay: 0.4,
                    }
              }
              sx={{
                position: 'absolute',
                top: 2,
                left: 0,
                right: 0,
                transformOrigin: 'top',
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.3), rgba(255, 255, 255, 0))',
                height: 20,
                filter: 'blur(4px)',
              }}
            />
          </Box>
          <Box
            sx={{
              width: 228,
              height: 8,
              borderTopLeftRadius: '2px',
              borderTopRightRadius: '2px',
              borderBottomLeftRadius: '6px',
              borderBottomRightRadius: '6px',
              position: 'relative',
              boxShadow: '#f7f7f7 0px 1px 0px 0px inset',
              backgroundImage: 'linear-gradient(#e7e7e7 65%, #dcdcdc)',

              '&:before': {
                content: '""',
                width: 22,
                height: 3,
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#cdcdcd',
                borderBottomLeftRadius: '9999px',
                borderBottomRightRadius: '9999px',
                boxShadow:
                  'inset 2px 0 1px -2px rgba(0,0,0,.5),inset -2px 0 1px -2px rgba(0,0,0,.5),0 1px 0 hsla(0,0%,100%,.1)',
              },
            }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: '-94px',
            width: '100%',
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            zIndex: 1,
          }}
        >
          {[<AppleIcon />, <AndroidIcon />, <WindowsIcon />].map((icon, i) => (
            <Box
              component={motion.div}
              key={i}
              initial={{ filter: 'blur(8px)', opacity: 0 }}
              animate={
                shouldAnimate
                  ? { filter: 'blur(0px)', opacity: 1 }
                  : { filter: 'blur(8px)', opacity: 0 }
              }
              transition={{
                delay: 0.25 * i + 0.25,
                duration: 1,
                ease: easeInOutExpo,
              }}
              sx={{
                borderRadius: '14px',
                width: 66,
                height: 66,
                background: '#fff',
                boxShadow:
                  '0 0 0 1px rgb(231 231 231) ,0 1px 2px rgb(231 231 231 / 32%),0 3px 3px rgb(231 231 231 / 24%),0 -2px rgb(231 231 231 / 70%) inset',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                svg: {
                  width: 26,
                },
              }}
            >
              {icon}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const AndroidIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
    <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55" />
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const WindowsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
);

export default OperatingSystems;
