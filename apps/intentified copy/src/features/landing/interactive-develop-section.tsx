"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  MousePointer2,
  Target,
  TrendingUp,
  Zap,
  BarChart3,
  Puzzle,
} from "lucide-react";
import { useState } from "react";

const TITLES = [
  "1.9T Intent Signals",
  "270M US Consumers",
  "50B URLs Daily",
  "70% Identity Resolution",
];

const StatusIndicator = () => {
  return (
    <div className="absolute top-4 left-4 flex gap-1">
      <div className="h-2 w-2 rounded-full bg-red-400 group-hover:animate-bounce" />
      <div className="h-2 w-2 rounded-full bg-yellow-400 delay-100 group-hover:animate-bounce" />
      <div className="h-2 w-2 rounded-full bg-green-400 delay-200 group-hover:animate-bounce" />
    </div>
  );
};

function CardContent({
  type,
  currentIndex,
}: {
  type: "intent" | "scoring" | "automation" | "analytics" | "integration";
  currentIndex: boolean;
}) {
  switch (type) {
    case "intent":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Target
            className={`text-foreground h-6 w-6 transition-all duration-300 ${
              currentIndex ? "text-primary scale-125" : ""
            }`}
          />
        </div>
      );
    case "scoring":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <TrendingUp
            className={`text-foreground h-6 w-6 transition-all duration-300 ${
              currentIndex ? "text-primary scale-125" : ""
            }`}
          />
        </div>
      );
    case "automation":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Zap
            className={`text-foreground h-6 w-6 transition-all duration-300 ${
              currentIndex ? "text-primary scale-125 animate-pulse" : ""
            }`}
          />
        </div>
      );
    case "analytics":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <BarChart3
            className={`text-foreground h-6 w-6 transition-all duration-300 ${
              currentIndex ? "text-primary scale-125" : ""
            }`}
          />
        </div>
      );
    case "integration":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Puzzle
            className={`text-foreground h-6 w-6 transition-all duration-300 ${
              currentIndex ? "text-primary scale-125" : ""
            }`}
          />
        </div>
      );
  }
}

export const InteractiveDevelopSection = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentIndexTitle, setCurrentIndexTitle] = useState(0);

  return (
    <section className="relative flex w-full items-center justify-center px-4 py-20">
      <div className="relative">
        <div className="relative flex flex-col items-center justify-center gap-1">
          <h1 className="text-muted-foreground relative z-50 flex gap-2 text-4xl font-medium md:text-6xl">
            <span className="block">We</span>
            <span
              className={`text-foreground block cursor-pointer text-4xl font-semibold transition-colors duration-300 md:text-6xl ${
                showDetails ? "opacity-100" : "opacity-70"
              }`}
              onMouseEnter={() => setShowDetails(true)}
              onClick={() => setShowDetails(false)}
              role="button"
              tabIndex={0}
              aria-label="Show development solutions"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowDetails(!showDetails);
                }
              }}
            >
              PROCESS
            </span>
          </h1>
          <div className="relative flex h-[60px] flex-col items-center justify-start overflow-hidden text-4xl font-medium md:h-[76px] md:text-6xl">
            {TITLES.map((item, index) => (
              <h2
                key={index}
                className={`${
                  index === 0 ? "text-muted-foreground" : "text-foreground"
                } py-2 text-center transition-transform duration-300`}
                style={{
                  transform: `translateY(${currentIndexTitle * -76}px)`,
                  lineHeight: "normal",
                }}
                aria-live="polite"
              >
                {item}
              </h2>
            ))}
            {/* <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b"></div> */}
            {/* <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t"></div> */}
          </div>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.8 }}
              onClick={() => {
                setShowDetails(false);
                setCurrentIndexTitle(0);
              }}
              role="dialog"
              aria-label="Development solutions details"
            >
              {/* Card 1: Intent Signals */}
              <div
                className={`group border-border bg-card absolute bottom-16 left-4 h-32 w-32 -rotate-6 cursor-pointer rounded-3xl border p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] md:bottom-24 md:left-20 md:h-40 md:w-40 ${
                  currentIndexTitle === 1 && "scale-[1.15] rotate-0"
                } ${
                  currentIndexTitle !== 0 &&
                  currentIndexTitle !== 1 &&
                  "opacity-30"
                }`}
                onMouseEnter={() => setCurrentIndexTitle(1)}
                onMouseLeave={() => setCurrentIndexTitle(0)}
                role="button"
                tabIndex={0}
                aria-label="Intent-driven pipelines"
              >
                <div className="relative h-full w-full">
                  <MousePointer2 className="text-muted-foreground absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                </div>
                <StatusIndicator />
                <CardContent
                  type="intent"
                  currentIndex={currentIndexTitle === 1}
                />
              </div>

              {/* Card 2: Lead Scoring */}
              <div
                className={`group border-border bg-card absolute bottom-48 left-32 h-32 w-32 rotate-12 cursor-pointer rounded-3xl border p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] md:bottom-[264px] md:left-52 md:h-40 md:w-40 ${
                  currentIndexTitle === 2 && "scale-[1.15] rotate-0"
                } ${
                  currentIndexTitle !== 0 &&
                  currentIndexTitle !== 2 &&
                  "opacity-30"
                }`}
                onMouseEnter={() => setCurrentIndexTitle(2)}
                onMouseLeave={() => setCurrentIndexTitle(0)}
                role="button"
                tabIndex={0}
                aria-label="Qualified lead scoring"
              >
                <div className="relative h-full w-full">
                  <MousePointer2 className="text-muted-foreground absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                </div>
                <StatusIndicator />
                <CardContent
                  type="scoring"
                  currentIndex={currentIndexTitle === 2}
                />
              </div>

              {/* Card 3: Automation */}
              <div
                className={`group border-border bg-card absolute right-16 bottom-32 h-32 w-32 -rotate-[4deg] cursor-pointer rounded-3xl border p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] md:bottom-40 md:left-96 md:h-40 md:w-40 ${
                  currentIndexTitle === 3 && "scale-[1.15] rotate-0"
                } ${
                  currentIndexTitle !== 0 &&
                  currentIndexTitle !== 3 &&
                  "opacity-30"
                }`}
                onMouseEnter={() => setCurrentIndexTitle(3)}
                onMouseLeave={() => setCurrentIndexTitle(0)}
                role="button"
                tabIndex={0}
                aria-label="Automated workflows"
              >
                <div className="relative h-full w-full">
                  <MousePointer2 className="text-muted-foreground absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                </div>
                <StatusIndicator />
                <CardContent
                  type="automation"
                  currentIndex={currentIndexTitle === 3}
                />
              </div>

              {/* Card 4: Analytics */}
              <div
                className={`group border-border bg-card absolute right-8 bottom-56 h-32 w-32 -rotate-12 cursor-pointer rounded-3xl border p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] md:right-32 md:bottom-80 md:h-40 md:w-40 ${
                  currentIndexTitle === 4 && "scale-[1.15] rotate-0"
                } ${
                  currentIndexTitle !== 0 &&
                  currentIndexTitle !== 4 &&
                  "opacity-30"
                }`}
                onMouseEnter={() => setCurrentIndexTitle(4)}
                onMouseLeave={() => setCurrentIndexTitle(0)}
                role="button"
                tabIndex={0}
                aria-label="Actionable analytics"
              >
                <div className="relative h-full w-full">
                  <MousePointer2 className="text-muted-foreground absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                </div>
                <StatusIndicator />
                <CardContent
                  type="analytics"
                  currentIndex={currentIndexTitle === 4}
                />
              </div>

              {/* Card 5: Integration */}
              <div
                className={`group border-border bg-card absolute right-4 bottom-8 h-32 w-32 rotate-6 cursor-pointer rounded-3xl border p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] md:right-20 md:bottom-[104px] md:h-40 md:w-40 ${
                  currentIndexTitle === 5 && "scale-[1.15] rotate-0"
                } ${
                  currentIndexTitle !== 0 &&
                  currentIndexTitle !== 5 &&
                  "opacity-30"
                }`}
                onMouseEnter={() => setCurrentIndexTitle(5)}
                onMouseLeave={() => setCurrentIndexTitle(0)}
                role="button"
                tabIndex={0}
                aria-label="Seamless integrations"
              >
                <div className="relative h-full w-full">
                  <MousePointer2 className="text-muted-foreground absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                </div>
                <StatusIndicator />
                <CardContent
                  type="integration"
                  currentIndex={currentIndexTitle === 5}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
