"use client";
// https://buildui.com/recipes/animated-number
import React, { useEffect, useState } from "react";
import { cn } from "@/utils/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  formatFn?: (value: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 2000,
  className,
  formatFn = (val) => val.toString(),
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easeOutCubic for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOutCubic);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={cn("inline-block", className)}>
      {formatFn(Math.round(displayValue))}
    </span>
  );
};
