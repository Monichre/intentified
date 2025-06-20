"use client";

import React from "react";
import { motion } from "motion/react";
import { HoverController, HoverAnimated } from "./ui/hover-controller";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
  SatelliteDishIcon,
} from "lucide-react";
import { cn } from "@/utils/utils";

export interface LayeredDataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorScheme?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
  size?: "sm" | "md" | "lg";
  description?: string;
}

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
  turquoise: "linear-gradient(hsl(173, 90%, 40%), hsl(158, 90%, 40%))",
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`h-2 w-2 w-min ${className || "absolute top-0 right-0"}`}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          className={`icon-btn ${item.customClass || "h-3 w-3"}`}
          aria-label={item.label}
        >
          <span
            className="icon-btn__back h-2 w-2"
            style={getBackgroundStyle(item.color)}
          ></span>
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const colorSchemes = {
  primary: {
    background: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20",
    accent: "bg-blue-500/20",
    text: "text-blue-600",
    icon: "text-blue-500",
  },
  success: {
    background: "from-green-500/10 to-green-600/10",
    border: "border-green-500/20",
    accent: "bg-green-500/20",
    text: "text-green-600",
    icon: "text-green-500",
  },
  warning: {
    background: "from-yellow-500/10 to-yellow-600/10",
    border: "border-yellow-500/20",
    accent: "bg-yellow-500/20",
    text: "text-yellow-600",
    icon: "text-yellow-500",
  },
  danger: {
    background: "from-red-500/10 to-red-600/10",
    border: "border-red-500/20",
    accent: "bg-red-500/20",
    text: "text-red-600",
    icon: "text-red-500",
  },
  info: {
    background: "from-purple-500/10 to-purple-600/10",
    border: "border-purple-500/20",
    accent: "bg-purple-500/20",
    text: "text-purple-600",
    icon: "text-purple-500",
  },
};

const sizeVariants = {
  sm: {
    container: "w-48 h-28",
    padding: "p-3",
    title: "text-xs",
    value: "text-lg",
    subtitle: "text-xs",
  },
  md: {
    container: "w-64 h-46",
    padding: "p-4",
    title: "text-sm",
    value: "text-2xl",
    subtitle: "text-sm",
  },
  lg: {
    container: "w-80 h-44",
    padding: "p-6",
    title: "text-base",
    value: "text-3xl",
    subtitle: "text-base",
  },
};

const getTrendIcon = (trend: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return TrendingUp;
    case "down":
      return TrendingDown;
    case "neutral":
    default:
      return Minus;
  }
};

const getTrendColor = (trend: "up" | "down" | "neutral") => {
  switch (trend) {
    case "up":
      return "text-green-500";
    case "down":
      return "text-red-500";
    case "neutral":
    default:
      return "text-gray-500";
  }
};

export const LayeredDataCard: React.FC<LayeredDataCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  trendValue,
  colorScheme = "primary",
  className,
  description,
  size = "md",
}) => {
  const colors = colorSchemes[colorScheme];
  const sizes = sizeVariants[size];
  const TrendIcon = getTrendIcon(trend);

  // Animation variants for each layer
  const backgroundLayerVariants = {
    initial: {
      translateZ: 0,
      translateX: 0,
      translateY: 0,
    },
    hover: {
      translateZ: 200,
      translateX: -40,
      translateY: -50,
    },
  };

  const accentLayerVariants = {
    initial: {
      translateZ: 0,
      translateX: 0,
      translateY: 0,
    },
    hover: {
      translateZ: 100,
      translateX: 10,
      translateY: 10,
    },
  };

  const contentLayerVariants = {
    initial: {
      translateZ: 0,
      translateX: 0,
      translateY: 0,
      x: 0,
      y: 0,
    },
    hover: {
      translateZ: 100,
      translateX: 20,
      translateY: 20,
      x: 20,
      y: 20,
    },
  };

  const highlightLayerVariants = {
    initial: {
      translateZ: 0,
      rotateY: 0,
      rotateX: 0,
    },
    hover: {
      translateZ: 10,
      rotateY: 1,
      rotateX: -0.5,
      borderColor: colors.accent,
    },
  };

  const accentDotVariants = {
    initial: {
      translateZ: 0,
      scale: 1,
    },
    hover: {
      translateZ: 15,
      scale: 1.5,
    },
  };

  // Common transition settings with different delays
  const getTransition = (delay = 0) => ({
    duration: 0.4,
    ease: "easeOut",
    delay,
  });

  return (
    <HoverController
      className={cn(
        "relative z-40 cursor-pointer rounded-md border-1 border-black/10",
        sizes.container,
        className,
      )}
      style={{ perspective: "1000px" }}
    >
      {/* Background Layer */}
      <HoverAnimated
        className={cn(
          "absolute inset-0 top-0 right-0 z-10 h-full w-full rounded-md bg-black",
          colors.background,
          "backdrop-blur-sm",
        )}
        variants={backgroundLayerVariants}
        customTransition={getTransition(0)}
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* Accent Layer */}
      <HoverAnimated
        className={cn(
          "absolute inset-0 top-0 right-0 h-full w-full rounded-md bg-white",
          colors.border,
          "bg-white/50 dark:bg-black/20",
        )}
        variants={accentLayerVariants}
        customTransition={getTransition(0.05)}
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* Content Layer */}
      <HoverAnimated
        className={cn(
          "relative z-20 flex h-full flex-col justify-between rounded-md border border-white/20 bg-white backdrop-blur dark:bg-black/40",
          sizes.padding,
        )}
        variants={contentLayerVariants}
        customTransition={getTransition(0.1)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Header */}
        <div className="relative flex h-full w-full">
          <div className="flex-1">
            <h3
              className={cn(
                "font-medium text-gray-600 dark:text-gray-300",
                sizes.title,
              )}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={cn(
                  "mt-1 text-gray-500 dark:text-gray-400",
                  sizes.subtitle,
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="absolute top-0 right-0 w-full">
            <GlassIcons
              items={[
                {
                  icon: <SatelliteDishIcon className="h-8 w-8" />,
                  color: "turquoise",
                  label: "Satellite",
                },
              ]}
            />
          </div>
        </div>

        {/* Value */}
        <div className="mt-4">
          {description && (
            <span className="line-clamp-pretty whitespace-ellipsis font-lighter w-[50px] text-xs text-black">
              {description.slice(0, 100)}
            </span>
          )}
        </div>
      </HoverAnimated>

      {/* Highlight Layer */}
      <HoverAnimated
        className={cn(
          "absolute inset-0 rounded-md border",
          colors.border,
          "bg-transparent",
        )}
        variants={highlightLayerVariants}
        customTransition={getTransition(0.15)}
        style={{ transformStyle: "preserve-3d" }}
      />

      {/* Floating accent dot */}
      <HoverAnimated
        className={cn(
          "absolute top-4 right-4 h-2 w-2 rounded-full",
          colors.accent,
        )}
        variants={accentDotVariants}
        customTransition={getTransition(0.2)}
        style={{ transformStyle: "preserve-3d" }}
      />
    </HoverController>
  );
};