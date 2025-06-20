"use client";
import { ArrowAngularTopRight } from "@/components/ai-form-flow/icons";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface WelcomeBentoClientProps {
  onStart: () => void;
}

export function WelcomeBentoClient({ onStart }: WelcomeBentoClientProps) {
  // Pre-load the first form step
  const handleStart = () => {
    // Force any pending layout calculations to complete
    document.body.offsetHeight;

    // Call the onStart callback
    onStart();
  };

  return (
    <motion.button
      onClick={handleStart}
      className="group relative mx-auto block overflow-hidden rounded-xl px-6 py-3 font-medium text-black"
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
        className="from-primary-300/90 via-primary-400/95 to-secondary-400/90 absolute inset-0 bg-gradient-to-r"
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
      <div className="absolute inset-x-0 top-0 h-[40%] rounded-t-xl bg-gradient-to-b from-white/25 to-transparent" />

      {/* Bottom shadow gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[40%] rounded-b-xl bg-gradient-to-t from-black/10 to-transparent" />

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
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.15), 0 2px 5px rgba(0,0,0,0.1)",
          },
          hover: {
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.25), 0 4px 10px rgba(0,0,0,0.15), 0 0 15px rgba(76,175,130,0.15)",
          },
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Button content with proper z-index */}
      <div className="relative z-10 mx-auto flex content-center items-center justify-center">
        <span className="text-center text-black/90">Get Started</span>

        {/* Ultra-smooth arrow animation with optimized transitions */}
        <div className="icon-container relative ml-2 flex h-5 w-5 items-center justify-center will-change-transform">
          {/* Northeast arrow (default state) - Absolutely positioned */}
          <motion.div
            className="absolute inset-0 flex transform-gpu items-center justify-center"
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
            <ArrowAngularTopRight
              size={16}
              color="rgba(0, 0, 0, 0.9)"
              className="pointer-events-none block transform-gpu"
              aria-hidden="true"
            />
          </motion.div>

          {/* East arrow (hover state) - Absolutely positioned with explicit hidden initial state */}
          <motion.div
            className="absolute inset-0 flex transform-gpu items-center justify-center"
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
            <ArrowRight
              size={16}
              color="rgba(0, 0, 0, 0.9)"
              className="pointer-events-none block transform-gpu"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>

      {/* Performance optimization */}
      <div className="will-change-opacity absolute inset-0 will-change-transform" />
    </motion.button>
  );
}
