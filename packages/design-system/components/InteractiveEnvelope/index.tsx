import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { useState } from 'react';

export interface InteractiveEnvelopeProps {
  onOpen?: () => void;
  onClose?: () => void;
}

const InteractiveEnvelope = ({ onOpen, onClose }: InteractiveEnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isOpen) {
      setTimeout(() => {
        onOpen?.();
      }, 500);
    } else {
      setTimeout(() => {
        onClose?.();
      }, 500);
    }

    setIsOpen(prev => !prev);
  };

  const shakeVariants: any = {
    initial: {
      rotate: 0,
      x: 0,
    },
    shake: {
      rotate: [0, -2, 2, -2, 2, -1, 1, 0],
      x: [0, -3, 3, -3, 3, -1, 1, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        repeatDelay: 3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={shakeVariants}
      initial="initial"
      animate={!isOpen ? 'shake' : undefined}
      sx={{
        position: 'relative',
        display: 'inline-block',
      }}
      onClick={handleClick}
    >
      <Box
        component={motion.div}
        initial={{ scaleY: 1 }}
        animate={
          isOpen
            ? {
                scaleY: -1,
              }
            : undefined
        }
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
        sx={{
          position: 'absolute',
          top: 5.95,
          left: 0,
          transformOrigin: '50% 0.3px',
        }}
      >
        <EnvelopeTopFold />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          mt: '-15px',
        }}
      >
        <Box
          component={motion.img}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: isOpen ? 60 : 0,
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.8 : 1,
            rotate: isOpen ? -10 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          src={'/images/stamp.png'}
          sx={{
            width: 58,
          }}
        />
      </Box>
      <Envelope />
    </Box>
  );
};

const EnvelopeTopFold = () => (
  <svg
    width="170px"
    height="142px"
    viewBox="0 0 144 142"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      style={{ mixBlendMode: 'multiply' }}
      clipPath="url(#envelopeClip)"
      opacity="0.7"
    >
      <g filter="url(#filter0_f_3_73)">
        <path
          d="M3 0L141 0L80.5551 54.3128C77.5309 57.0302 76.0187 58.389 74.3091 58.9044C72.8032 59.3584 71.1968 59.3584 69.6909 58.9044C67.9813 58.389 66.4691 57.0302 63.4449 54.3128L3 0Z"
          fill="#334155"
          fill-opacity="0.4"
        />
      </g>
      <g filter="url(#filter1_f_3_73)">
        <path
          d="M11 0L133 0L81.5281 57.3785C78.2296 61.0556 76.5803 62.8941 74.6365 63.5726C72.9294 64.1685 71.0706 64.1685 69.3635 63.5726C67.4197 62.8941 65.7704 61.0556 62.4719 57.3785L11 0Z"
          fill="#334155"
          fill-opacity="0.2"
        />
      </g>
      <g filter="url(#filter2_f_3_73)">
        <path
          d="M3 0L141 0L81.3617 63.9599C78.1077 67.4498 76.4806 69.1947 74.5783 69.8424C72.9065 70.4115 71.0935 70.4115 69.4217 69.8424C67.5194 69.1947 65.8924 67.4498 62.6383 63.9599L3 0Z"
          fill="#334155"
          fill-opacity="0.1"
        />
      </g>
      <g filter="url(#filter3_f_3_73)">
        <path
          d="M8 0L136 0L76.4282 65.1567C74.0493 67.7585 69.9507 67.7585 67.5718 65.1567L8 0Z"
          fill="#334155"
          fill-opacity="0.05"
        />
      </g>
      <g filter="url(#filter4_f_3_73)">
        <path
          d="M2 -1L142 -1L76.0827 60.2089C73.7806 62.3466 70.2194 62.3466 67.9173 60.2089L2 -1Z"
          fill="#334155"
          fill-opacity="0.1"
        />
      </g>
    </g>
    <path
      clipPath="url(#envelopeClip)"
      d="M1.5 2L63.6546 55.3383C66.616 57.8797 68.0967 59.1504 69.7575 59.6339C71.2211 60.0601 72.7761 60.0592 74.2393 59.6314C75.8994 59.1459 77.3787 57.8736 80.3373 55.3288L143.5 1"
      stroke="#475569"
      stroke-opacity="0.06"
    />
    <g filter="url(#filter5_i_3_73)" clipPath="url(#envelopeClip)">
      <path
        d="M0 0L144 0L80.3523 54.8078C77.389 57.3595 75.9073 58.6354 74.2444 59.1214C72.7788 59.5498 71.2212 59.5498 69.7556 59.1214C68.0927 58.6354 66.611 57.3595 63.6477 54.8077L0 0Z"
        fill="url(#paint0_linear_3_73)"
      />
    </g>
    <defs>
      <clipPath id="envelopeClip">
        <rect x="0" y="0" width="145" height="96" rx="3.5px" />
      </clipPath>
      <filter
        id="filter0_f_3_73"
        x="-1"
        y="-4"
        width="146"
        height="67.2449"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_3_73" />
      </filter>
      <filter
        id="filter1_f_3_73"
        x="-1"
        y="-12"
        width="146"
        height="88.0195"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_3_73" />
      </filter>
      <filter
        id="filter2_f_3_73"
        x="-21"
        y="-24"
        width="186"
        height="118.269"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="12"
          result="effect1_foregroundBlur_3_73"
        />
      </filter>
      <filter
        id="filter3_f_3_73"
        x="-2"
        y="-10"
        width="148"
        height="87.1081"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="5" result="effect1_foregroundBlur_3_73" />
      </filter>
      <filter
        id="filter4_f_3_73"
        x="-2"
        y="-5"
        width="148"
        height="70.8122"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_3_73" />
      </filter>
      <filter
        id="filter5_i_3_73"
        x="0"
        y="0"
        width="144"
        height="59.4427"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-1" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_73" />
      </filter>
      <linearGradient
        id="paint0_linear_3_73"
        x1="72"
        y1="0"
        x2="72"
        y2="62"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.25" stop-color="#FAFAFB" />
        <stop offset="1" stop-color="#F4F5F6" />
      </linearGradient>
    </defs>
  </svg>
);

const Envelope = () => (
  <svg
    width="170"
    height="145"
    viewBox="0 0 170 145"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_dddd_3_7)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M157 89.2C157 93.6804 157 95.9206 156.128 97.6319C155.361 99.1372 154.137 100.361 152.632 101.128C150.921 102 148.68 102 144.2 102H25.8C21.3196 102 19.0794 102 17.3681 101.128C15.8628 100.361 14.6389 99.1372 13.8719 97.6319C13 95.9206 13 93.6804 13 89.2V9.00002C13 7.34316 14.3431 6.00002 16 6.00002V6.00002H154.5V6.00002C155.881 6.00002 157 7.11931 157 8.50002V89.2Z"
        fill="url(#paint0_linear_3_7)"
      />
      <path
        d="M144.2 102.5H25.8H25.7767C23.5562 102.5 21.8593 102.5 20.5049 102.389C19.14 102.278 18.079 102.051 17.1411 101.574C15.5417 100.759 14.2414 99.4583 13.4264 97.8589C12.9486 96.9211 12.7222 95.8601 12.6107 94.4951C12.5 93.1407 12.5 91.4438 12.5 89.2233V89.2V9.00002C12.5 7.06702 14.067 5.50002 16 5.50002H154.5C156.157 5.50002 157.5 6.84316 157.5 8.50002V89.2V89.2229C157.5 91.4436 157.5 93.1407 157.389 94.4951C157.278 95.8601 157.051 96.9211 156.574 97.8589C155.759 99.4583 154.458 100.759 152.859 101.574C151.921 102.051 150.86 102.278 149.495 102.389C148.141 102.5 146.444 102.5 144.223 102.5H144.2Z"
        stroke="url(#paint1_linear_3_7)"
      />
    </g>
    <mask
      id="mask0_3_7"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="13"
      y="-41"
      width="144"
      height="143"
    >
      <path
        d="M13 12.8503C13 10.3458 13 9.0935 13.3452 7.95679C13.6508 6.95047 14.1518 6.01428 14.8196 5.2018C15.5739 4.28404 16.6159 3.58939 18.6998 2.20011L77.8998 -37.2666C80.4659 -38.9773 81.7489 -39.8326 83.1357 -40.1649C84.3612 -40.4586 85.6388 -40.4586 86.8643 -40.1649C88.2511 -39.8326 89.5341 -38.9773 92.1002 -37.2666L151.3 2.20011C153.384 3.58939 154.426 4.28404 155.18 5.2018C155.848 6.01428 156.349 6.95047 156.655 7.95679C157 9.0935 157 10.3458 157 12.8504V89.2C157 93.6804 157 95.9206 156.128 97.6319C155.361 99.1372 154.137 100.361 152.632 101.128C150.921 102 148.68 102 144.2 102H25.8C21.3196 102 19.0794 102 17.3681 101.128C15.8628 100.361 14.6389 99.1372 13.8719 97.6319C13 95.9206 13 93.6804 13 89.2V12.8503Z"
        fill="black"
      />
    </mask>
    <g mask="url(#mask0_3_7)">
      <g filter="url(#filter1_di_3_7)">
        <path
          d="M13 6L13 102L61.9267 64.1213C66.3785 60.6747 68.6044 58.9514 69.4054 56.8541C70.1073 55.0161 70.1073 52.9839 69.4054 51.1459C68.6044 49.0486 66.3785 47.3253 61.9267 43.8787L13 6Z"
          fill="url(#paint2_linear_3_7)"
        />
      </g>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 3.96118L12 104.039L67.4414 61.1166C72.0953 57.5135 72.0953 50.4866 67.4414 46.8835L12 3.96118ZM13 6.00004L66.8292 47.6743C70.966 50.877 70.966 57.1231 66.8292 60.3258L13 102L13 6.00004Z"
        fill="#475569"
        fill-opacity="0.1"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M157.932 3.96118L157.932 104.039L102.491 61.1166C97.8366 57.5135 97.8366 50.4866 102.491 46.8835L157.932 3.96118ZM156.932 6.00004L103.103 47.6743C98.9659 50.877 98.9659 57.1231 103.103 60.3258L156.932 102L156.932 6.00004Z"
        fill="#475569"
        fill-opacity="0.1"
      />
      <g filter="url(#filter2_di_3_7)">
        <path
          d="M157 6L157 102L108.073 64.1213C103.621 60.6747 101.396 58.9514 100.595 56.8541C99.8927 55.0161 99.8927 52.9839 100.595 51.1459C101.396 49.0486 103.621 47.3253 108.073 43.8787L157 6Z"
          fill="url(#paint3_linear_3_7)"
        />
      </g>
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.4">
        <g filter="url(#filter3_f_3_7)">
          <path
            d="M16 102L154 102L93.5551 47.6872C90.5309 44.9698 89.0187 43.611 87.3091 43.0956C85.8032 42.6416 84.1968 42.6416 82.6909 43.0956C80.9813 43.611 79.4691 44.9698 76.4449 47.6872L16 102Z"
            fill="#334155"
            fill-opacity="0.4"
          />
        </g>
        <g filter="url(#filter4_f_3_7)">
          <path
            d="M24 102L146 102L94.5281 44.6215C91.2296 40.9444 89.5803 39.1059 87.6365 38.4274C85.9294 37.8315 84.0706 37.8315 82.3635 38.4274C80.4197 39.1059 78.7704 40.9444 75.4719 44.6215L24 102Z"
            fill="#334155"
            fill-opacity="0.2"
          />
        </g>
        <g filter="url(#filter5_f_3_7)">
          <path
            d="M16 102L154 102L94.3617 38.0401C91.1077 34.5502 89.4806 32.8053 87.5783 32.1576C85.9065 31.5885 84.0935 31.5885 82.4217 32.1576C80.5194 32.8053 78.8924 34.5502 75.6383 38.0401L16 102Z"
            fill="#344256"
            fill-opacity="0.1"
          />
        </g>
      </g>
      <g filter="url(#filter6_i_3_7)">
        <path
          d="M13 102L157 102L93.3523 47.1923C90.389 44.6405 88.9073 43.3647 87.2444 42.8786C85.7788 42.4502 84.2212 42.4502 82.7556 42.8786C81.0927 43.3647 79.611 44.6405 76.6477 47.1923L13 102Z"
          fill="url(#paint4_linear_3_7)"
        />
      </g>
      <path
        d="M14.5 100L76.5242 46.7736C79.5319 44.1925 81.0357 42.902 82.7224 42.4108C84.209 41.978 85.7882 41.9789 87.2743 42.4134C88.9604 42.9065 90.4628 44.1987 93.4675 46.7833L156.5 101"
        stroke="#475569"
        stroke-opacity="0.06"
      />
    </g>
    <defs>
      <filter
        id="filter0_dddd_3_7"
        x="0"
        y="3.00002"
        width="170"
        height="142"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.117647 0 0 0 0 0.160784 0 0 0 0 0.231373 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3_7"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.117647 0 0 0 0 0.160784 0 0 0 0 0.231373 0 0 0 0.07 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_3_7"
          result="effect2_dropShadow_3_7"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="17" />
        <feGaussianBlur stdDeviation="5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.117647 0 0 0 0 0.160784 0 0 0 0 0.231373 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow_3_7"
          result="effect3_dropShadow_3_7"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="30" />
        <feGaussianBlur stdDeviation="6" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.117647 0 0 0 0 0.160784 0 0 0 0 0.231373 0 0 0 0.01 0"
        />
        <feBlend
          mode="normal"
          in2="effect3_dropShadow_3_7"
          result="effect4_dropShadow_3_7"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect4_dropShadow_3_7"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_di_3_7"
        x="11"
        y="0"
        width="76.9318"
        height="116"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="8" dy="4" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3_7"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3_7"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"
        />
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3_7" />
      </filter>
      <filter
        id="filter2_di_3_7"
        x="82.0682"
        y="0"
        width="76.9318"
        height="116"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-8" dy="4" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3_7"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3_7"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"
        />
        <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3_7" />
      </filter>
      <filter
        id="filter3_f_3_7"
        x="12"
        y="38.7551"
        width="146"
        height="67.2449"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_3_7" />
      </filter>
      <filter
        id="filter4_f_3_7"
        x="12"
        y="25.9805"
        width="146"
        height="88.0195"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_3_7" />
      </filter>
      <filter
        id="filter5_f_3_7"
        x="-8"
        y="7.73079"
        width="186"
        height="118.269"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="12" result="effect1_foregroundBlur_3_7" />
      </filter>
      <filter
        id="filter6_i_3_7"
        x="13"
        y="42.5573"
        width="144"
        height="59.4429"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_3_7" />
      </filter>
      <linearGradient
        id="paint0_linear_3_7"
        x1="85"
        y1="-17.9999"
        x2="85"
        y2="102"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#E6E8EA" />
        <stop offset="1" stop-color="#DDE0E3" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_3_7"
        x1="85"
        y1="102"
        x2="85"
        y2="-17.9999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#475569" stop-opacity="0.06" />
        <stop offset="1" stop-color="#475569" stop-opacity="0.04" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_3_7"
        x1="44"
        y1="102"
        x2="44"
        y2="6"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.28125" stop-color="#EEF0F1" />
        <stop offset="0.78125" stop-color="#F9FAFA" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_3_7"
        x1="126"
        y1="102"
        x2="126"
        y2="6"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.28125" stop-color="#EEF0F1" />
        <stop offset="0.78125" stop-color="#F9FAFA" />
      </linearGradient>
      <linearGradient
        id="paint4_linear_3_7"
        x1="85"
        y1="40"
        x2="85"
        y2="102"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.322581" stop-color="#FAFAFB" />
        <stop offset="1" stop-color="#EEF0F1" />
      </linearGradient>
    </defs>
  </svg>
);

export default InteractiveEnvelope;
