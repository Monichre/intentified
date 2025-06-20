import React from 'react'
import {motion} from 'framer-motion'

const easeCirc = (e: number) => (1 === e ? 1 : 1 - Math.pow(2, -10 * e))

export interface CloudSyncingProps {
  actionText?: string
}

const CloudSyncing = (props: CloudSyncingProps) => {
  const {actionText = 'Syncing'} = props

  return (
    <div className='py-20 px-[60px]'>
      <div className='flex justify-between items-center gap-6'>
        <motion.div
          initial={{
            y: 48,
            opacity: 0,
          }}
          animate={{y: 0, opacity: 1}}
          transition={{
            duration: 1.25,
            ease: easeCirc,
            delay: 0.15,
          }}
          className='relative'
        >
          <div className='w-[46px] h-[46px] rounded-lg flex items-center justify-center relative bg-white z-[2] shadow-[rgba(29,29,32,0.04)_0px_0px_0px_1px,rgba(99,102,241,0.1)_0px_0px_0px_5px,0_1px_3px_0_rgba(79,70,229,.25),0_1px_2px_-1px_rgba(79,70,229,.25)]'>
            <CloudIcon />
          </div>
          {Array.from({length: 4}).map((_, i) => (
            <motion.div
              key={i}
              style={{x: '-50%', y: '-50%'}}
              initial={{opacity: 0, scale: 0}}
              animate={{
                scale: [0, 1],
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: 0.825 * i,
                duration: 4.25,
                ease: easeCirc,
                times: [0, 0.25, 1],
                repeat: 1 / 0,
              }}
              className='absolute border-2 border-[#e0e7ff] w-40 aspect-square top-1/2 left-1/2 rounded-full'
            />
          ))}
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: easeCirc,
          }}
          className='[mask:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] py-4 flex-1 relative'
        >
          <div className='absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-[rgb(238_238_240)] rounded-full' />
          <motion.div
            initial={{
              x: '-100%',
            }}
            animate={{
              x: '100%',
              rotate: [0, 180, 180, 0],
            }}
            transition={{
              repeat: 1 / 0,
              repeatType: 'mirror',
              ease: 'easeInOut',
              duration: 2,
              delay: 0.25,
              rotate: {
                times: [0.49, 0.5, 0.99, 1],
                duration: 4,
                repeat: 1 / 0,
              },
            }}
            className='absolute inset-0'
          >
            <div className='[mask:linear-gradient(90deg,transparent,#000)] pr-3 w-1/3 h-full flex items-center'>
              <div className='w-full bg-[rgb(99_102_241)] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(99,102,241,0.15)_0px_0px_8px_2px] rounded-[999px] h-0.5 relative' />
              <div className='w-1 h-1 -ml-1 bg-[rgb(99_102_241)] rounded-full shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(99,102,241,0.4)_0px_0px_8px_2px]' />
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{
            y: 48,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.25,
            ease: easeCirc,
            delay: 0.25,
          }}
        >
          <div className='shadow-[rgba(29,29,32,0.08)_0px_0px_0px_1px,0_4px_6px_-1px_rgba(0,0,0,.1),0_2px_4px_-2px_rgba(0,0,0,.1)] text-[#1d1d20] font-medium text-sm px-3 py-1 bg-white rounded-full flex items-center justify-center gap-1.5'>
            {actionText}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: 1 / 0,
                ease: 'linear',
              }}
              className='p-[3px] bg-[#1d1d20] rounded-[999px] flex'
            >
              <CircleIcon />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const CircleIcon = () => (
  <svg
    width='10'
    height='10'
    viewBox='0 0 10 10'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect width='10' height='10'></rect>
    <circle
      cx='5'
      cy='5'
      r='4.25'
      stroke='white'
      strokeOpacity='0.2'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></circle>
    <path
      d='M5 0.75C7.34721 0.75 9.25 2.65279 9.25 5C9.25 7.34721 7.34721 9.25 5 9.25C3.82904 9.25 2.76868 8.77644 2 8.0104'
      stroke='white'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    ></path>
  </svg>
)

const CloudIcon = () => (
  <svg
    width='28'
    height='28'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M0 12C0 14.7614 2.23858 17 5 17H15C17.7614 17 20 14.7614 20 12C20 9.23858 17.7614 7 15 7C15 4.23858 12.7614 2 10 2C7.23858 2 5 4.23858 5 7C2.23858 7 0 9.23858 0 12Z'
      fill='#716FFF'
    />
    <path
      d='M14.5 7V7.5H15C17.4853 7.5 19.5 9.51472 19.5 12C19.5 14.4853 17.4853 16.5 15 16.5H5C2.51472 16.5 0.5 14.4853 0.5 12C0.5 9.51472 2.51472 7.5 5 7.5H5.5V7C5.5 4.51472 7.51472 2.5 10 2.5C12.4853 2.5 14.5 4.51472 14.5 7Z'
      stroke='black'
      strokeOpacity='0.2'
    />
  </svg>
)

export default CloudSyncing
