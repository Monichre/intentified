'use client'

import React from 'react'
import {motion} from 'framer-motion'
import {cn} from '../../lib/utils'
import {Badge} from './badge'
import {TrendingUp, TrendingDown, Minus, LucideIcon} from 'lucide-react'
import {HoverController, HoverAnimated} from './hover-controller'

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

  // Animation variants for each layer
  const backgroundLayerVariants = {
    initial: {
      translateZ: 0,
      rotateY: 0,
      rotateX: 0,
    },
    hover: {
      translateZ: -20,
      rotateY: -2,
      rotateX: 1,
    },
  }

  const accentLayerVariants = {
    initial: {
      translateZ: 0,
      rotateY: 0,
      rotateX: 0,
    },
    hover: {
      translateZ: -10,
      rotateY: -1,
      rotateX: 0.5,
    },
  }

  const contentLayerVariants = {
    initial: {
      translateZ: 0,
      rotateY: 0,
      rotateX: 0,
    },
    hover: {
      translateZ: 0,
      rotateY: 0,
      rotateX: 0,
    },
  }

  const highlightLayerVariants = {
    initial: {
      translateZ: 0,
      rotateY: 0,
      rotateX: 0,
      borderColor: colors.border,
    },
    hover: {
      translateZ: 10,
      rotateY: 1,
      rotateX: -0.5,
      borderColor: colors.accent,
    },
  }

  const accentDotVariants = {
    initial: {
      translateZ: 0,
      scale: 1,
    },
    hover: {
      translateZ: 15,
      scale: 1.5,
    },
  }

  // Common transition settings with different delays
  const getTransition = (delay = 0) => ({
    duration: 0.4,
    ease: 'easeOut',
    delay,
  })

  return (
    <HoverController
      className={cn('relative cursor-pointer', sizes.container, className)}
      style={{perspective: '1000px'}}
    >
      {/* Background Layer */}
      <HoverAnimated
        className={cn(
          'absolute inset-0 rounded-xl bg-gradient-to-br',
          colors.background,
          'backdrop-blur-sm'
        )}
        variants={backgroundLayerVariants}
        customTransition={getTransition(0)}
        style={{transformStyle: 'preserve-3d'}}
      />

      {/* Accent Layer */}
      <HoverAnimated
        className={cn(
          'absolute inset-0 rounded-xl border-2',
          colors.border,
          'bg-white/50 dark:bg-black/20'
        )}
        variants={accentLayerVariants}
        customTransition={getTransition(0.05)}
        style={{transformStyle: 'preserve-3d'}}
      />

      {/* Content Layer */}
      <HoverAnimated
        className={cn(
          'relative z-10 flex h-full flex-col justify-between rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur border border-white/20',
          sizes.padding
        )}
        variants={contentLayerVariants}
        customTransition={getTransition(0.1)}
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
      </HoverAnimated>

      {/* Highlight Layer */}
      <HoverAnimated
        className={cn(
          'absolute inset-0 rounded-xl border',
          colors.border,
          'bg-transparent'
        )}
        variants={highlightLayerVariants}
        customTransition={getTransition(0.15)}
        style={{transformStyle: 'preserve-3d'}}
      />

      {/* Floating accent dot */}
      <HoverAnimated
        className={cn(
          'absolute top-4 right-4 h-2 w-2 rounded-full',
          colors.accent
        )}
        variants={accentDotVariants}
        customTransition={getTransition(0.2)}
        style={{transformStyle: 'preserve-3d'}}
      />
    </HoverController>
  )
}
