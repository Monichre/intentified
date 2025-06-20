"use client"

import React from "react"
import { motion } from "framer-motion"

interface WelcomeBentoProps {
  onStart: () => void
}

export const WelcomeBento = React.memo(({ onStart }: WelcomeBentoProps) => {
  // Pre-load the first form step
  const handleStart = () => {
    // Force any pending layout calculations to complete
    document.body.offsetHeight

    // Call the onStart callback
    onStart()
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main container with proper sizing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0, transition: { duration: 0 } }} // Instant exit
        transition={{ duration: 0.5 }}
        className="relative z-10 overflow-hidden rounded-2xl"
      >
        {/* Glass background with proper borders */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10" />

        {/* Subtle top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Content container with proper padding */}
        <div className="relative z-10 px-8 py-10 text-center">
          {/* Heading with controlled width to prevent wrapping */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-white tracking-tight mb-5">
            Hello there!
          </h1>

          <p className="text-sm sm:text-base text-secondary-300/90 font-sans font-light mb-8">
            Answer a few questions to get started, Count Dooku.
          </p>

          {/* Advanced gradient button with sophisticated glass effects */}
          <motion.button
            onClick={handleStart}
            className="relative overflow-hidden group px-6 py-3 rounded-xl text-black font-medium"
            initial="default"
            whileHover="hover"
            whileTap="tap"
            variants={{
              default: { scale: 1 },
              hover: { scale: 1.03 },
              tap: { scale: 0.98 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* Multi-layered gradient background system */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary-300/90 via-primary-400/95 to-secondary-400/90"
              variants={{
                default: { opacity: 1 },
                hover: { opacity: 1 },
              }}
            />

            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-50" />

            {/* Subtle inner shadow */}
            <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.1)]" />

            {/* Top highlight gradient */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/25 to-transparent rounded-t-xl" />

            {/* Bottom shadow gradient */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/10 to-transparent rounded-b-xl" />

            {/* Sleek hover effect - smoothened animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ backgroundSize: "200% 100%" }}
              variants={{
                default: { backgroundPosition: "100% 0", opacity: 0 },
                hover: { backgroundPosition: "0% 0", opacity: 1 },
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Animated border glow - smoothened animation */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              variants={{
                default: {
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 2px 5px rgba(0,0,0,0.1)",
                },
                hover: {
                  boxShadow:
                    "0 0 0 1.5px rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.15), 0 0 15px rgba(76,175,130,0.15)",
                },
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Button content with proper z-index */}
            <div className="relative z-10 flex items-center justify-center">
              <span className="text-black/90">Get Started</span>

              {/* Ultra-smooth arrow animation with optimized transitions */}
              <div className="ml-2 flex items-center justify-center relative w-5 h-5 will-change-transform icon-container">
                {/* Northeast arrow (default state) - Absolutely positioned */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center transform-gpu"
                  style={{
                    position: "absolute",
                    zIndex: 2,
                    opacity: 1,
                    visibility: "visible",
                    willChange: "transform, opacity, visibility",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    contain: "strict",
                  }}
                  initial={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    visibility: "visible",
                  }}
                  variants={{
                    default: {
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      y: 0,
                      visibility: "visible",
                    },
                    hover: {
                      opacity: 0,
                      scale: 0.8,
                      x: 2,
                      y: -2,
                      transitionEnd: { visibility: "hidden" },
                    },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.2, 0.0, 0.0, 1.0],
                  }}
                >
                  <i
                    className="lni lni-arrow-angular-top-right text-black/90"
                    style={{
                      fontSize: "16px",
                      display: "block",
                      pointerEvents: "none",
                      transform: "translateZ(0)",
                    }}
                    aria-hidden="true"
                  ></i>
                </motion.div>

                {/* East arrow (hover state) - Absolutely positioned with explicit hidden initial state */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center transform-gpu"
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    opacity: 0,
                    visibility: "hidden",
                    willChange: "transform, opacity, visibility",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    contain: "strict",
                    contentVisibility: "auto",
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    x: -2,
                    visibility: "hidden",
                  }}
                  variants={{
                    default: {
                      opacity: 0,
                      scale: 0.8,
                      x: -2,
                      visibility: "hidden",
                    },
                    hover: {
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      visibility: "visible",
                    },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.2, 0.0, 0.0, 1.0],
                    delay: 0.05,
                  }}
                >
                  <i
                    className="lni lni-arrow-right text-black/90"
                    style={{
                      fontSize: "16px",
                      display: "block",
                      pointerEvents: "none",
                      transform: "translateZ(0)",
                    }}
                    aria-hidden="true"
                  ></i>
                </motion.div>
              </div>
            </div>

            {/* Performance optimization */}
            <div className="absolute inset-0 will-change-transform will-change-opacity" />
          </motion.button>
        </div>
      </motion.div>

      {/* Subtle glow effect - properly sized and positioned */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/5 via-secondary-500/5 to-primary-500/5 rounded-[inherit] blur-lg -z-10" />

      {/* Bottom reflection - properly sized and positioned */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-primary-500/10 blur-xl rounded-full -z-10" />
    </div>
  )
})

WelcomeBento.displayName = "WelcomeBento"
