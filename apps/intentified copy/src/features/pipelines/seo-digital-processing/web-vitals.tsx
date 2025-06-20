"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paintbrush, Zap, Move, Watch, PaintRollerIcon } from "lucide-react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge } from "@/components/ui/gauge";

import { cn } from "@/utils/utils";
import { CrUXApiResponse } from "@/lib/types";
import { AnimatedNumber } from "@/components/ui/animated-number";

const metricConfig = {
  interaction_to_next_paint: {
    thresholds: [200, 500], // in milliseconds
    labels: ["Good", "Needs Improvement", "Poor"],
    colors: ["bg-green-light", "bg-yellow-light", "bg-red-light"],
    time: "ms",
    conversionFactor: 1, // No conversion needed, display as milliseconds
  },
  largest_contentful_paint: {
    thresholds: [2500, 4000], // in milliseconds
    labels: ["Good", "Needs Improvement", "Poor"],
    colors: ["bg-green-light", "bg-yellow-light", "bg-red-light"],
    time: "sec",
    conversionFactor: 0.001, // Convert milliseconds to seconds
  },
  cumulative_layout_shift: {
    thresholds: [0.1, 0.25], // unitless scores
    labels: ["Good", "Needs Improvement", "Poor"],
    colors: ["bg-green-light", "bg-yellow-light", "bg-red-light"],
    time: "",
    conversionFactor: 1, // No conversion needed, display unitless
  },
};

export function WebVitalsSection({ vitals }: { vitals: CrUXApiResponse }) {
  const [selectedMetric, setSelectedMetric] = useState<string>(
    "interaction_to_next_paint",
  );

  const [selectedMetricScore, setSelectedMetricScore] = useState(
    vitals.record.metrics["interaction_to_next_paint"].percentiles.p75 ?? null,
  );

  const handleMetricSelect = (metricKey: string) => {
    setSelectedMetric(metricKey);
    const normalizedKey = normalizeKey(metricKey);

    setSelectedMetricScore(vitals.record.metrics[metricKey].percentiles.p75);
  };

  const vitalsExplainers = vitals.record.metrics
    ? Object.entries(vitals.record.metrics)
        .filter(
          ([key, data]) =>
            data.percentiles &&
            data.percentiles.p75 !== undefined &&
            key !== "first_input_delay" &&
            key !== "first_contentful_paint" &&
            key !== "experimental_time_to_first_byte",
        )
        .map(([key, data]) => {
          const p75 = data.percentiles.p75;
          const label = getAssessmentLabel(p75, key);
          const threshold = getThreshold(key);
          const isGood = p75 <= threshold;
          const gaugeValue =
            typeof p75 === "number" ? calculateGaugeValue(p75, threshold) : 0;

          const gaugeColor =
            typeof p75 === "number"
              ? isGood
                ? "text-green-light"
                : p75 <= threshold * 1.5
                  ? "text-yellow-light"
                  : "text-red-light"
              : "text-gray-light"; // Default color if p75 is not a number

          const vibe = getDescription(p75, key);

          return {
            metricKey: key,
            label,
            icon: ICON_MAP[key] || <span>No Icon</span>,
            vibe,
            gaugeValue,
            gaugeColor,
            p75,
          };
        })
    : [];

  return (
    <Card className="bg-base-900 w-full px-6 py-6">
      <CardHeader>
        <CardTitle>Web Vitals</CardTitle>
        <CardDescription>
          {vitals.record.key.url || "URL Not Available"}
        </CardDescription>
        <motion.div layout className="flex flex-col items-center">
          <AnimatePresence>
            {selectedMetric && (
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="pt-1 pb-4"
              >
                <div className="w-full text-center">
                  <p className="pointer-events-none text-base italic">
                    {vitalDetailsMap[selectedMetric].measures}
                  </p>
                  <h2 className="text-blue-light text-[90px] font-black">
                    {vitalDetailsMap[selectedMetric].short}
                  </h2>
                  <p>{vitalDetailsMap[selectedMetric].long}</p>
                </div>

                <div className="md:w-96">
                  <PerformanceChart
                    metricType={selectedMetric}
                    actualResult={selectedMetricScore}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardHeader>
      <CardContent className="bg-base-975 relative mx-2 mb-4 grid grid-cols-1 gap-2 rounded-[19px] px-2 py-2 shadow lg:mx-3">
        {vitalsExplainers.map(
          ({ metricKey, label, icon, vibe, p75, gaugeValue, gaugeColor }) => {
            // Safely get metric config with fallback values
            const metricConf = metricConfig[metricKey] || {
              time: "",
              conversionFactor: 1,
              thresholds: [0, 0],
              labels: ["Unknown", "Unknown", "Unknown"],
              colors: ["bg-gray-light", "bg-gray-light", "bg-gray-light"],
            };
            const { time, conversionFactor } = metricConf;
            const convertedActualResult = (label?.p75 || 0) * conversionFactor;
            const isActive = metricKey === selectedMetric;
            return (
              <motion.div
                key={metricKey}
                className={cn(
                  "shadow-inner-shadow relative cursor-pointer rounded-[11px] p-3 transition-colors",
                  isActive ? "bg-base-800" : "bg-base-900",
                )}
                onClick={() => handleMetricSelect(metricKey)}
                whileHover="hover"
                variants={iconHoverVariants}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 rounded px-3 py-3">
                    <span className={cn(" ", isActive ? "fill-green-100" : "")}>
                      {icon}
                    </span>
                    <Badge variant="outline" className={label.badgeColor}>
                      {label.text}
                    </Badge>
                  </div>

                  <div
                    className={cn(
                      "absolute top-2 right-2 rounded-xl px-2 py-2",
                    )}
                  >
                    <Gauge
                      size="small"
                      showValue={false}
                      alternateValue={`${
                        metricKey === "largest_contentful_paint"
                          ? convertedActualResult.toPrecision(2)
                          : convertedActualResult
                      }${time}`}
                      value={gaugeValue}
                      color={gaugeColor}
                      bgcolor="text-base-800"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <CardDescription className="text-base-100 text-base leading-5">
                    {vibe}
                  </CardDescription>
                  <CardDescription className="text-base-300">{`The ${p75} percentile of ${metricKey.replace(
                    /_/g,
                    " ",
                  )} is ${
                    label.p75
                  }, indicating ${label.text.toLowerCase()} performance.`}</CardDescription>
                </div>
              </motion.div>
            );
          },
        )}
      </CardContent>
    </Card>
  );
}

const PerformanceChart = ({ metricType, actualResult }) => {
  if (!metricType) return null;

  // Safely get metric config with fallback values
  const metricConf = metricConfig[metricType] || {
    thresholds: [100, 200],
    labels: ["Good", "Needs Improvement", "Poor"],
    colors: ["bg-green-light", "bg-yellow-light", "bg-red-light"],
    time: "",
    conversionFactor: 1,
  };
  const { thresholds, labels, colors, time, conversionFactor } = metricConf;
  const convertedActualResult = (actualResult || 0) * conversionFactor;
  const convertedThresholds = thresholds.map((t) => t * conversionFactor);
  const totalRange = Math.max(...convertedThresholds) * 1.5; // Extended range to accommodate labels
  // Set each segment width to one-third
  const segmentWidths = Array(3).fill(33.33);
  const actualResultPosition = (convertedActualResult / totalRange) * 100;

  const resultNumber = convertedActualResult.toFixed(1);
  console.log(convertedActualResult);

  return (
    <div className="relative w-full max-w-xl p-4">
      <div className="flex h-12">
        {segmentWidths.map((width, index) => (
          <div
            key={`${index}-segment-width-${width}`}
            style={{ width: `${width}%` }}
            className={`text-base-900 flex items-center justify-center px-3 text-center text-xs leading-1 font-bold first:rounded-l-xl last:rounded-r-xl md:px-2 md:text-sm md:leading-4 ${colors[index]}`}
          >
            {labels[index]}
          </div>
        ))}
      </div>
      <div className="relative mt-9">
        {convertedThresholds.map((threshold, index) => (
          <div
            key={`${index}-${threshold}`}
            style={{ left: `${index === 0 ? "36%" : "70%"}` }}
            className="absolute -translate-x-1/2 transform"
          >
            <div className="text-base-300 mt-1 text-center text-sm">
              {threshold.toFixed(1)}
              {time}
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-1">
        {/* Actual result marker */}
        <motion.div
          layoutId="actual-result"
          style={{ left: `${actualResultPosition}%` }}
          className="absolute -top-9 -translate-x-1/2 transform"
        >
          <div className="bg-base-200 h-1 w-1"></div>
          <div className="text-base-200 mt-1 text-center font-bold">
            {/* @ts-ignore */}
            <AnimatedNumber value={convertedActualResult} />
            {time}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const vitalDetailsMap = {
  interaction_to_next_paint: {
    short: "INP",
    measures: "Interactivity",
    full: "Interaction to Next Paint",
  },
  cumulative_layout_shift: {
    short: "CLS",
    measures: "Visual Stability",
    full: "Cumulative Layout Shift",
  },
  largest_contentful_paint: {
    short: "LCP",
    measures: "Loading",
    full: "Largest Contentful Paint",
  }, // Largest Contentful Paint
};
// Normalize keys to match image map keys
const normalizeKey = (key: string): string => {
  const keyMap = {
    interaction_to_next_paint: "inp",
    cumulative_layout_shift: "cls",
    largest_contentful_paint: "lcp",
    first_contentful_paint: "fcp",
    experimental_time_to_first_byte: "ttfb",
  };
  return keyMap[key] || key; // return the mapped key, or the original if not mapped
};

// prettier-ignore
const ICON_MAP: Record<string, JSX.Element> = {
  experimental_time_to_first_byte: <Watch className="fill-base-950/30 stroke-1 stroke-base-200 w-7 h-7" />,
  first_contentful_paint: <Paintbrush className="fill-base-950/30 stroke-1 stroke-base-200 w-7 h-7" />,
  interaction_to_next_paint: <Zap className="fill-base-950/30 stroke-1 stroke-base-200 w-7 h-7" />,
  largest_contentful_paint: <PaintRollerIcon className="fill-base-950/30 stroke-1 stroke-base-200 w-7 h-7" />,
  cumulative_layout_shift: <Move className="fill-base-950/30 stroke-1 stroke-base-200 w-7 h-7" />,
};

// Good FCP is less than 1800ms | Good TTFB is less than 800ms | Good LCP is less than 2500ms | Good INP is less than 200ms
// prettier-ignore
const getThreshold = (metricKey) => {
  const thresholds = {cumulative_layout_shift: 0.1,first_contentful_paint: 1800,experimental_time_to_first_byte: 800,largest_contentful_paint: 2500,interaction_to_next_paint: 200};
  return thresholds[metricKey] || 2500; // Default threshold if not specified
};

const calculateGaugeValue = (p75, threshold) => {
  const numericP75 = parseFloat(p75.toString());
  let gaugeValue;
  if (numericP75 <= threshold) {
    // If the performance is within the acceptable threshold, calculate it inversely to reflect better performance with a higher gauge value
    gaugeValue = 100 - (numericP75 / threshold) * 100;
  } else {
    // If the performance exceeds the threshold, use an exponential decay to bring it down, this helps keep some sensitivity in the gauge beyond the threshold
    gaugeValue = 100 * Math.exp(-((numericP75 - threshold) / threshold));
  }
  return Math.max(0, Math.min(100, gaugeValue)); // Ensure the value is clamped between 0 and 100
};

// Enhance getAssessmentLabel to use dynamic thresholds
function getAssessmentLabel(p75, metricKey) {
  const threshold = getThreshold(metricKey);
  const numericP75 = parseFloat(p75.toString());
  const passes = numericP75 <= threshold;
  return {
    p75: numericP75,
    text: passes ? "Good" : "Poor",
    color: passes ? "text-green-light" : "text-red-light",
    badgeColor: passes
      ? "bg-base-950  text-green-light"
      : "bg-red-light text-black ",
    time:
      metricKey === "largest_contentful_paint"
        ? "s"
        : metricKey === "interaction_to_next_paint"
          ? "ms"
          : "",
  };
}

const getDescription = (p75: number | string, metricKey: string) => {
  const numericP75 = parseFloat(p75.toString());
  const threshold = getThreshold(metricKey);
  const passes = numericP75 <= threshold;
  const descriptions = {
    largest_contentful_paint: passes
      ? `Main content loads quickly, enhancing user engagement.`
      : "Main content loads slowly, possibly deterring users.",
    interaction_to_next_paint: passes
      ? "Interactions feel snappy, keeping users happy and engaged."
      : "Slow to react to interactions, which may irritate users.",
    cumulative_layout_shift: passes
      ? "Page elements stay in place as they load, ensuring a stable experience."
      : "Page elements shift during loading, creating a disorienting experience.",
    first_contentful_paint: passes
      ? "First glimpse comes fast, making the site feel speedy."
      : "First glimpse is slow, making the site feel sluggish.",
    experimental_time_to_first_byte: passes
      ? "Smooth interaction without delays, maintaining user focus."
      : "Notable delays during interaction, which may distract users.",
  };
  return descriptions[metricKey];
};

const imageVariants = {
  hidden: { y: -20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    y: 20,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const iconHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.006,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};
