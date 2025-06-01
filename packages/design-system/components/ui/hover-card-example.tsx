'use client'

import React from 'react'
import { HoverController, HoverAnimated } from './hover-controller'
import { cn } from '../../lib/utils'

interface HoverCardExampleProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
}

export const HoverCardExample: React.FC<HoverCardExampleProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  // Define variants for different elements
  const cardVariants = {
    initial: {
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  }

  const iconVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.2,
      rotate: 5,
    },
  }

  const titleVariants = {
    initial: {
      y: 0,
    },
    hover: {
      y: -2,
    },
  }

  const lineVariants = {
    initial: {
      width: '2rem',
      backgroundColor: '#e2e8f0',
    },
    hover: {
      width: '4rem',
      backgroundColor: '#3b82f6',
    },
  }

  return (
    <HoverController className={cn('cursor-pointer', className)}>
      <HoverAnimated
        className="relative rounded-lg bg-white p-6 dark:bg-gray-800"
        variants={cardVariants}
        customTransition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <HoverAnimated
              variants={titleVariants}
              customTransition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
            </HoverAnimated>

            <HoverAnimated
              variants={lineVariants}
              className="h-1 rounded-full"
              customTransition={{ duration: 0.5 }}
            />

            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          </div>

          {icon && (
            <HoverAnimated
              variants={iconVariants}
              customTransition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-blue-500"
            >
              {icon}
            </HoverAnimated>
          )}
        </div>
      </HoverAnimated>
    </HoverController>
  )
}