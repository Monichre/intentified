'use client'

import React from 'react'
import {motion} from 'framer-motion'
import {cn} from '../../lib/utils'
import {Badge} from './badge'
import {TrendingUp, TrendingDown, Minus, LucideIcon} from 'lucide-react'

export interface LayeredDataCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const colorSchemes = {
  primary: {
    background: 'from-blue-500/10 to-blue-600/10',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500/20',
    text: 'text-blue-600',
    icon: 'text-blue-500',
  },
  success: {
    background: 'from-green-500/10 to-green-600/10',
    border: 'border-green-500/20',
    accent: 'bg-green-500/20',
    text: 'text-green-600',
    icon: 'text-green-500',
  },
  warning: {
    background: 'from-yellow-500/10 to-yellow-600/10',
    border: 'border-yellow-500/20',
    accent: 'bg-yellow-500/20',
    text: 'text-yellow-600',
    icon: 'text-yellow-500',
  },
  danger: {
    background: 'from-red-500/10 to-red-600/10',
    border: 'border-red-500/20',
    accent: 'bg-red-500/20',
    text: 'text-red-600',
    icon: 'text-red-500',
  },
  info: {
    background: 'from-purple-500/10 to-purple-600/10',
    border: 'border-purple-500/20',
    accent: 'bg-purple-500/20',
    text: 'text-purple-600',
    icon: 'text-purple-500',
  },
}

const sizeVariants = {
  sm: {
    container: 'w-48 h-28',
    padding: 'p-3',
    title: 'text-xs',
    value: 'text-lg',
    subtitle: 'text-xs',
  },
  md: {
    container: 'w-64 h-36',
    padding: 'p-4',
    title: 'text-sm',
    value: 'text-2xl',
    subtitle: 'text-sm',
  },
  lg: {
    container: 'w-80 h-44',
    padding: 'p-6',
    title: 'text-base',
    value: 'text-3xl',
    subtitle: 'text-base',
  },
}

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    case 'neutral':
    default:
      return Minus
  }
}

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return 'text-green-500'
    case 'down':
      return 'text-red-500'
    case 'neutral':
    default:
      return 'text-gray-500'
  }
}

export const LayeredDataCard: React.FC<LayeredDataCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  colorScheme = 'primary',
  className,
  size = 'md',
}) => {
  const colors = colorSchemes[colorScheme]
  const sizes = sizeVariants[size]
  const TrendIcon = getTrendIcon(trend)

  return (
    <div
      className={cn('relative cursor-pointer', sizes.container, className)}
      style={{perspective: '1000px'}}
    >
      {/* Background Layer */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl bg-gradient-to-br',
          colors.background,
          'backdrop-blur-sm'
        )}
        whileHover={{
          translateZ: -20,
          rotateY: -2,
          rotateX: 1,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
        style={{transformStyle: 'preserve-3d'}}
      />

      {/* Accent Layer */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl border-2',
          colors.border,
          'bg-white/50 dark:bg-black/20'
        )}
        whileHover={{
          translateZ: -10,
          rotateY: -1,
          rotateX: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.05,
        }}
        style={{transformStyle: 'preserve-3d'}}
      />

      {/* Content Layer */}
      <motion.div
        className={cn(
          'relative z-10 flex h-full flex-col justify-between rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur border border-white/20',
          sizes.padding
        )}
        whileHover={{
          translateZ: 0,
          rotateY: 0,
          rotateX: 0,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.1,
        }}
        style={{transformStyle: 'preserve-3d'}}
      >
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3
              className={cn(
                'font-medium text-gray-600 dark:text-gray-300',
                sizes.title
              )}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={cn(
                  'text-gray-500 dark:text-gray-400 mt-1',
                  sizes.subtitle
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          {Icon && <Icon className={cn('h-5 w-5', colors.icon)} />}
        </div>

        {/* Value */}
        <div className='flex items-end justify-between'>
          <span
            className={cn(
              'font-bold text-gray-900 dark:text-white',
              sizes.value
            )}
          >
            {value}
          </span>

          {(trend !== 'neutral' || trendValue) && (
            <div className='flex items-center space-x-1'>
              <TrendIcon className={cn('h-4 w-4', getTrendColor(trend))} />
              {trendValue && (
                <span
                  className={cn('text-sm font-medium', getTrendColor(trend))}
                >
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Highlight Layer */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl border',
          colors.border,
          'bg-transparent'
        )}
        whileHover={{
          translateZ: 10,
          rotateY: 1,
          rotateX: -0.5,
          borderColor: colors.accent,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.15,
        }}
        style={{transformStyle: 'preserve-3d'}}
      />

      {/* Floating accent dot */}
      <motion.div
        className={cn(
          'absolute top-4 right-4 h-2 w-2 rounded-full',
          colors.accent
        )}
        whileHover={{
          translateZ: 15,
          scale: 1.5,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: 0.2,
        }}
        style={{transformStyle: 'preserve-3d'}}
      />
    </div>
  )
}
