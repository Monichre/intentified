"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { motion, MotionProps, Variant, Variants } from "motion/react";

// Context to share hover state with child components
interface HoverContextType {
  isHovered: boolean;
}

const HoverContext = createContext<HoverContextType>({ isHovered: false });

// Hook to use the hover context in child components
export const useHoverContext = () => useContext(HoverContext);

interface HoverControllerProps {
  children: ReactNode;
  className?: string;
  onHover?: () => void;
  onHoverEnd?: () => void;
  style?: React.CSSProperties;
  /**
   * Additional HTML attributes to pass to the div
   */
  [key: string]: any;
}

/**
 * HoverController - Parent component that manages hover state and passes it to children
 * through context. This allows child components to react to parent hover state.
 */
export const HoverController: React.FC<HoverControllerProps> = ({
  children,
  className,
  onHover,
  onHoverEnd,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      <HoverContext.Provider value={{ isHovered }}>
        {children}
      </HoverContext.Provider>
    </div>
  );
};

interface HoverAnimatedProps extends MotionProps {
  children?: ReactNode;
  className?: string;
  variants: Variants;
  /**
   * Initial variant name
   */
  initial?: string | Variant;
  /**
   * The variant to use when hovered
   */
  hoverVariant?: string;
  /**
   * The variant to use when not hovered
   */
  restVariant?: string;
  /**
   * Custom transition properties
   */
  customTransition?: any;
  /**
   * Additional HTML attributes to pass to the motion.div
   */
  [key: string]: any;
}

/**
 * HoverAnimated - Child component that animates based on parent hover state.
 * Use this inside a HoverController to automatically animate when the parent is hovered.
 */
export const HoverAnimated: React.FC<HoverAnimatedProps> = ({
  children,
  className,
  variants,
  initial = "initial",
  hoverVariant = "hover",
  restVariant = "initial",
  customTransition,
  ...props
}) => {
  const { isHovered } = useHoverContext();

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={isHovered ? hoverVariant : restVariant}
      transition={customTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
};
