// Server Component (no "use client" directive)
import { WelcomeBentoClient } from "./welcome-bento-client";

interface StaticWelcomeProps {
  onStart: () => void;
}

export function StaticWelcome({ onStart }: StaticWelcomeProps) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Main container with proper sizing - pre-rendered */}
      <div className="relative z-10 overflow-hidden rounded-2xl">
        {/* Glass background with proper borders - pre-rendered */}
        <div className="absolute inset-0 border border-white/10 bg-black/40 backdrop-blur-xl" />

        {/* Subtle top highlight - pre-rendered */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Content container with proper padding - pre-rendered */}
        <div className="relative z-10 px-8 py-10 text-center">
          {/* Heading with controlled width to prevent wrapping - pre-rendered */}
          <h1 className="font-display mb-5 text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl">
            Hello there!
          </h1>

          <p className="text-secondary-300/90 mb-8 font-sans text-sm font-light sm:text-base">
            Answer a few questions to get started, Count Dooku.
          </p>

          {/* Client component for interactive button */}
          <WelcomeBentoClient onStart={onStart} />
        </div>
      </div>

      {/* Subtle glow effect - properly sized and positioned - pre-rendered */}
      <div className="from-primary-500/5 via-secondary-500/5 to-primary-500/5 absolute -inset-0.5 -z-10 rounded-[inherit] bg-gradient-to-r blur-lg" />

      {/* Bottom reflection - properly sized and positioned - pre-rendered */}
      <div className="bg-primary-500/10 absolute -bottom-6 left-1/2 -z-10 h-6 w-4/5 -translate-x-1/2 rounded-full blur-xl" />
    </div>
  );
}
