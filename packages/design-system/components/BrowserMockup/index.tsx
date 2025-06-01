import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface BrowserMockupProps {
  url?: string;
  children: React.ReactNode;
}

const BrowserMockup = (props: BrowserMockupProps) => {
  const { url = 'https://reverseui.com', children } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: {
      height: 34,
      opacity: 0,
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const toolbarVariants = {
    hidden: {
      width: 0,
      opacity: 0,
    },
    visible: {
      width: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const contentVariants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  const contentChildrenVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.85,
        delay: 0.85,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  return (
    <Box sx={{}}>
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <Box
          sx={{
            background:
              'linear-gradient(270deg, rgb(24, 24, 24) 0%, rgb(23, 23, 23) 100%)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            padding: '0 6px 6px 6px',
          }}
        >
          <Box sx={{ display: 'flex', padding: '6px' }}>
            <motion.div
              variants={toolbarVariants}
              style={{
                display: 'flex',
                flex: '1 0 0',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <motion.div
                variants={toolbarVariants}
                style={{ display: 'flex', gap: '6px' }}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={iconVariants}
                    style={{
                      width: 8.5,
                      height: 8.5,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.15)',
                    }}
                  />
                ))}
              </motion.div>

              <motion.div
                variants={toolbarVariants}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                {[WindowIcon, ArrowLeft, ArrowRight, RefreshIcon].map(
                  (Icon, index) => (
                    <Box
                      component={motion.div}
                      key={index}
                      variants={iconVariants}
                      sx={{
                        display: 'flex',
                        svg: { width: 14, fill: 'rgba(255, 255, 255, 0.6)' },
                      }}
                    >
                      <Icon />
                    </Box>
                  )
                )}
              </motion.div>
            </motion.div>

            <Box
              sx={{
                flex: '1 0 0',
                height: 22,
                padding: '6px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                component={motion.div}
                variants={iconVariants}
                sx={{
                  display: 'flex',
                  svg: { width: 12, fill: 'rgba(255, 255, 255, 0.6)' },
                }}
              >
                <LockIcon />
              </Box>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 400,
                }}
              >
                {url}
              </motion.div>

              <Box
                component={motion.div}
                variants={iconVariants}
                sx={{
                  display: 'flex',
                  svg: { width: 12, fill: 'rgba(255, 255, 255, 0.6)' },
                }}
              >
                <LinkIcon />
              </Box>
            </Box>

            <motion.div
              variants={toolbarVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1 0 0',
                justifyContent: 'flex-end',
              }}
            >
              {[DownloadIcon, PlusIcon].map((Icon, index) => (
                <Box
                  component={motion.div}
                  key={index}
                  variants={iconVariants}
                  sx={{
                    display: 'flex',
                    svg: { width: 14, fill: 'rgba(255, 255, 255, 0.6)' },
                  }}
                >
                  <Icon />
                </Box>
              ))}
            </motion.div>
          </Box>

          <motion.div
            variants={contentVariants}
            style={{
              width: '100%',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'flex',
              position: 'relative',
            }}
          >
            <motion.div
              variants={contentChildrenVariants}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                top: 0,
                left: 0,
              }}
            >
              {children}
            </motion.div>
            <div
              style={{
                opacity: 0,
                visibility: 'hidden',
                width: '100%',
                display: 'flex',
              }}
            >
              {children}
            </div>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
};

const WindowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V88H40V56Zm0,144H40V104H216v96Z"></path>
    </g>
  </svg>
);

const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
    </g>
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
    </g>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"></path>
    </g>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96Z"></path>
    </g>
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"></path>
    </g>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm37.66-85.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,148.69V88a8,8,0,0,1,16,0v60.69l18.34-18.35A8,8,0,0,1,165.66,130.34Z"></path>
    </g>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" color="#fff">
    <g color="#fff">
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
    </g>
  </svg>
);

export default BrowserMockup;
