"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/utils";

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  color?: string;
}

export function AnimatedUnderline({
  children,
  className,
  delay = 0,
  duration = 0.3,
  color = "turquoise",
}: AnimatedUnderlineProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={cn("relative inline-block cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <motion.span
        className="absolute bottom-[-4px] left-0 h-[2px] w-full origin-left"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
        }}
      />
    </span>
  );
}
