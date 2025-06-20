"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  isCompleted?: boolean
}

export function ProgressIndicator({ currentStep, totalSteps, isCompleted = false }: ProgressIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-md mx-auto">
      {!isCompleted ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/80 font-medium">
              {currentStep}/{totalSteps}
            </span>
            <span className="text-xs text-white/80 font-medium">{Math.round(percentage)}%</span>
          </div>
          <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
            />
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center w-12 h-12"
            style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.4)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M6 12L10 16L18 8"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  )
}
