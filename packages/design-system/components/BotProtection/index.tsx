import React from 'react'
import {AnimatePresence, motion, useAnimationFrame} from 'framer-motion'
import {useRef, useState} from 'react'

const useAnimationProgress = (duration: number) => {
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number | null>(null)

  useAnimationFrame((time) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = time
    }

    const elapsed = (time - startTimeRef.current) % (duration * 1000)
    const newProgress = elapsed / (duration * 1000)
    setProgress(newProgress)
  })

  return progress
}

const isDotVisible = (
  dotAngle: number,
  scannerAngle: number,
  scanWidth = 42
) => {
  // Normalize scanner angle to 0-360 range
  const normalizedScannerAngle = ((scannerAngle % 360) + 360) % 360

  // Calculate the range of angles where the scanner is active
  const scannerStart = normalizedScannerAngle
  const scannerEnd = (normalizedScannerAngle + scanWidth) % 360

  // Check if dot is within the active scanning range
  if (scannerStart < scannerEnd) {
    return dotAngle >= scannerStart && dotAngle <= scannerEnd
  } else {
    // Handle the case when the scanner wraps around 360 degrees
    return dotAngle >= scannerStart || dotAngle <= scannerEnd
  }
}

const BotProtection = () => {
  const animationProgress = useAnimationProgress(35)
  const currentScannerAngle = -200 + animationProgress * 360

  const dots = [
    {top: 300, left: 65, angle: 188},
    {top: 180, left: 170, angle: 223},
    {top: 45, left: 290, angle: 260},
    {top: 140, left: 420, angle: 292},
    {top: 280, left: 480, angle: 337},
  ]

  return (
    <div className='h-[340px] relative overflow-hidden w-full'>
      <svg
        className='absolute top-0 left-1/2 w-[680px] h-[680px] -translate-x-1/2'
        viewBox='0 0 680 680'
        fill='none'
      >
        <g
          strokeDasharray='0.25 4'
          stroke='white'
          strokeOpacity='0.195'
          strokeLinecap='round'
        >
          <circle cx='340' cy='340' r='136'></circle>
          <circle cx='340' cy='340' r='184'></circle>
          <circle cx='340' cy='340' r='232'></circle>
          <circle cx='340' cy='340' r='280'></circle>
          <circle cx='340' cy='340' r='328'></circle>
        </g>
      </svg>
      <div className='w-44 h-44 border border-white/[0.055] rounded-full absolute -bottom-[88px] left-1/2 -translate-x-1/2'>
        <div className='relative w-full h-full'>
          <motion.div
            initial={{transform: 'rotate(-60deg)'}}
            animate={{transform: 'rotate(300deg)'}}
            transition={{
              repeat: 1 / 0,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
              repeatDelay: 0,
            }}
            className='absolute -inset-px rounded-full opacity-70'
            style={{
              background:
                'conic-gradient(from calc(-43deg), white 42deg, transparent 42deg)',
              maskImage:
                'radial-gradient(closest-side, transparent calc(100% - 1px), white calc(100% - 1px))',
            }}
          />
          <motion.div
            initial={{transform: 'translate(-50%) rotate(-60deg)'}}
            animate={{transform: 'translate(-50%) rotate(300deg)'}}
            transition={{
              repeat: 1 / 0,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
              repeatDelay: 0,
            }}
            className='absolute w-[680px] h-[680px] rounded-full left-1/2 -top-[252px] -translate-x-1/2'
            style={{
              background:
                'conic-gradient(from calc(-44.85deg), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1) 3deg, rgba(255, 255, 255, 0.1) calc(43deg), rgba(255, 255, 255, 0) calc(46deg))',
              maskImage:
                'radial-gradient(closest-side, transparent 5.5rem, black 5.5rem, transparent 21.25rem)',
            }}
          />
        </div>
      </div>

      {dots.map((dot, index) => (
        <Dot
          key={index}
          top={dot.top}
          left={dot.left}
          isVisible={isDotVisible(dot.angle, currentScannerAngle)}
        />
      ))}
    </div>
  )
}

const Dot = ({
  top,
  left,
  isVisible,
}: {
  top: number
  left: number
  isVisible?: boolean
}) => {
  return (
    <div className='absolute' style={{top, left}}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            exit={{opacity: 0}}
            className='relative w-8 h-8 flex items-center justify-center'
          >
            <motion.div
              initial={{
                opacity: 0,
                transform: 'scale(0.6)',
              }}
              animate={{
                opacity: 1,
                transform: 'scale(1)',
                transition: {
                  opacity: {
                    delay: 0.5,
                    repeat: 1 / 0,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  },
                  transform: {
                    delay: 0.35,
                    repeat: 1 / 0,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  },
                },
              }}
              exit={{
                opacity: 0,
                transform: 'scale(0.6)',
                transition: {duration: 0.4},
              }}
              className='absolute w-8 h-8 rounded-full'
              style={{
                background: 'rgb(22 22 22/.1)',
                boxShadow:
                  '0 0 10px 2px rgba(255,45,60,0.15), inset 0 0 0 calc(1px + 0px) rgb(240 66 66/0.1)',
              }}
            />
            <motion.div
              initial={{
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0.9)',
              }}
              animate={{
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)',
                transition: {
                  transform: {
                    delay: 0.4,
                    repeat: 1 / 0,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  },
                },
              }}
              className='absolute top-1/2 left-1/2 w-[22px] h-[22px] rounded-full'
              style={{
                background: 'rgb(22 22 22/.5)',
                boxShadow:
                  '0 0 3px 1px rgba(255,45,60,0.15), inset 0 0 0 calc(1px + 0px) rgb(240 66 66/0.3)',
              }}
            />

            <div
              className='z-[2] w-[6px] h-[6px] rounded-[2px] bg-red-500'
              style={{
                boxShadow:
                  '0 0 8px 1px #f42937,0 1px rgba(255,255,255,0.2) inset',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BotProtection
