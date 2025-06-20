"use client";

import { cn } from "@/utils/utils";
import { useEffect, useRef } from "react";

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number;
  /**
   * The duration of the border beam.
   */
  duration?: number;
  /**
   * The delay of the border beam.
   */
  delay?: number;
  /**
   * The color of the border beam from.
   */
  colorFrom?: string;
  /**
   * The color of the border beam to.
   */
  colorTo?: string;
  /**
   * The class name of the border beam.
   */
  className?: string;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) => {
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (beamRef.current) {
      // Create and inject keyframes
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @keyframes border-beam-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `;
      document.head.appendChild(styleSheet);

      return () => {
        document.head.removeChild(styleSheet);
      };
    }
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      <div
        ref={beamRef}
        className="absolute inset-[-1000%] opacity-50"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${colorFrom}, ${colorTo}, transparent 30%)`,
          animation: `border-beam-spin ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
};
