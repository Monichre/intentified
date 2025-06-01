import React, {useEffect, useState} from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion'

export interface TimelineProgressProps {
  actions?: string[]
}

const timelineVariants = {
  hidden: {},
  visible: {
    transition: {
      when: 'afterChildren',
      staggerChildren: 3,
      delayChildren: 0.5,
    },
  },
}

const badgeVariants = {
  hidden: {},
  visible: {
    backgroundColor: '#37401c',
    color: '#c2da91',
    borderColor: '#37401c',
  },
}

const lineVariants = {
  hidden: {
    width: 0,
  },
  visible: {
    width: '100%',
  },
}

const TimelineProgress = (props: TimelineProgressProps) => {
  const {actions = []} = props
  const [currentItem, setCurrentItem] = useState(0)

  return (
    <div>
      <motion.div
        variants={timelineVariants}
        initial='hidden'
        animate='visible'
        className='flex flex-col gap-2 relative items-center justify-center'
      >
        {actions.map((action, i) => (
          <TimelineItem
            isActive={i <= currentItem}
            key={i}
            actions={actions}
            action={action}
            index={i}
            onAnimationComplete={() =>
              setCurrentItem(Math.min(actions.length - 1, i + 1))
            }
          />
        ))}
      </motion.div>
    </div>
  )
}

const TimelineItem = ({
  actions,
  action,
  index,
  isActive,
  onAnimationComplete,
}: {
  actions: string[]
  action: string
  index: number
  isActive: boolean
  onAnimationComplete: () => void
}) => {
  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {},
      }}
      className='flex flex-col gap-2'
      onAnimationComplete={onAnimationComplete}
    >
      <motion.div
        variants={badgeVariants}
        className='text-[#171717] bg-white border border-[#e2e2e2] px-3 py-2 rounded-2xl text-[15px] flex items-center gap-2 [&_svg]:w-5 [&_svg]:h-5'
      >
        {isActive && <CircularProgress />}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{x: -20}}
              animate={{x: 0}}
              transition={{
                duration: 0.25,
                ease: 'easeOut',
              }}
            >
              {action}
            </motion.div>
          )}
        </AnimatePresence>
        {!isActive && action}
      </motion.div>
      {index !== actions.length - 1 && (
        <div className='h-[54px] flex justify-center items-center'>
          <div className='w-[54px] h-[2px] rotate-90 bg-[#e8e8e8]'>
            <motion.div
              variants={lineVariants}
              transition={{
                duration: 2.75,
                ease: 'linear',
              }}
              className='h-full w-0 bg-[#37401c]'
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

const CircularProgress = () => {
  const progress = useMotionValue(0)
  const circleFill = useTransform(
    progress,
    [0, 94, 100],
    ['transparent', 'transparent', 'rgb(194, 218, 145)']
  )
  const circleLength = useTransform(progress, [0, 100], [0, 1])
  const checkmarkPathLength = useTransform(progress, [0, 95, 100], [0, 0, 1])
  const circleColor = useTransform(
    progress,
    [0, 95, 100],
    ['#FFCC66', '#FFCC66', '#c2da91']
  )

  useEffect(() => {
    animate(progress, 100, {delay: 0.5, duration: 1})
  }, [progress])

  return (
    <motion.svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 258 258'
    >
      <motion.path
        d='M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z'
        fill={circleFill}
      />

      <motion.path
        transform='translate(60 85)'
        d='M3 50L45 92L134 3'
        fill='transparent'
        stroke='#37401c'
        strokeWidth={14}
        style={{pathLength: checkmarkPathLength}}
      />
      <motion.path
        d='M 130 6 C 198.483 6 254 61.517 254 130 C 254 198.483 198.483 254 130 254 C 61.517 254 6 198.483 6 130 C 6 61.517 61.517 6 130 6 Z'
        fill='transparent'
        strokeWidth='8'
        stroke={circleColor}
        style={{
          pathLength: circleLength,
        }}
      />
    </motion.svg>
  )
}

export default TimelineProgress
