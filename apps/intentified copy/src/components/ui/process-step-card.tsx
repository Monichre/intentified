"use client";
import { FC, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { LucideIcon, ChevronDown } from "lucide-react";
import { cn } from "@/utils/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessStep {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  description: string;
  features: string[];
  metrics?: {
    urls?: number;
    consumers?: number;
  };
}

interface ProcessStepCardProps {
  step: ProcessStep;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ProcessStepCard: FC<ProcessStepCardProps> = ({
  step,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => {
  const IconComponent = step.icon;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={cn(
        "relative cursor-pointer overflow-visible border-white/30 bg-black/90 shadow-xl shadow-white/10 backdrop-blur-lg transition-all duration-300 hover:scale-105",
        isActive
          ? "shadow-lg ring-2 shadow-white/30 ring-white"
          : "hover:border-white/40 hover:shadow-md hover:shadow-white/20",
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top connector line - similar to IntentifiedProcessCard */}
      <div className="absolute -top-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white/50"></div>

      <CardHeader className="pt-2 pb-1">
        <div className="mb-1 flex items-center justify-between">
          <div className={cn("rounded-full p-1 text-white", step.color)}>
            <IconComponent className="h-3 w-3" />
          </div>
          <Badge className="border-white bg-white px-1 py-0 text-[9px] text-black">
            STEP {step.id}
          </Badge>
        </div>
        <CardTitle className="text-sm text-white">{step.title}</CardTitle>
        <span className="text-[10px] font-medium text-white/70">
          {step.subtitle}
        </span>
      </CardHeader>

      <CardContent className="space-y-1.5 pt-0 pb-1.5 text-xs text-white/80">
        <p className="text-[10px] leading-relaxed">{step.description}</p>

        {/* Metrics Section - styled like Energy Level */}
        {step.id === 1 && step.metrics?.urls && step.metrics?.consumers && (
          <div className="border-t border-white/10 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-white/70">URLs Daily</span>
                  <span className="font-mono text-white">
                    <AnimatedNumber value={step.metrics.urls} />B
                  </span>
                </div>
                <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-white/70">Consumers</span>
                  <span className="font-mono text-white">
                    <AnimatedNumber value={step.metrics.consumers} />M
                  </span>
                </div>
                <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features List - expandable */}
        <div className="border-t border-white/10 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex w-full items-center justify-between text-left transition-colors hover:text-white"
          >
            <h4 className="text-[9px] font-medium tracking-wider text-white/70 uppercase">
              Key Features ({step.features.length})
            </h4>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-2.5 w-2.5 text-white/50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 space-y-1 overflow-hidden"
              >
                {step.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start text-[9px] text-white/80"
                  >
                    <div className="mt-0.5 mr-1 h-0.5 w-0.5 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
