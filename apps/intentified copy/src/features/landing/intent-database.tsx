"use client";

import { FC, useState, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  MousePointer2,
  Database,
  Users,
  Globe,
  Activity,
  ArrowRight,
  CheckCircle,
  Target,
  Share2,
  FileText,
  Network,
  Brain,
  Calendar,
  MessageSquare,
  BookOpen,
  Building2,
  Search,
  MonitorDot,
  Mail,
} from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { IdentityResolutionEngine } from "./identity-resolution-engine";
import { IntentDataSources } from "./intent-data-sources";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/utils/utils";
import { capitalize } from "@/utils/capitalize";
import { GridBackgroundWithBlur } from "@/components/backgrounds/grid-backgrounds/grid-background-with-blur";
import { Badge } from "@/components/ui/badge";
import { TrueFocus } from "@/components/ui/true-focus";

const databaseMetrics = [
  {
    value: 1.9,
    suffix: "T",
    label: "Intent Signals Processed",
    description: "Trillion signals analyzed daily",
    icon: Activity,
    color: "text-blue-600",
  },
  {
    value: 270,
    suffix: "M",
    label: "US Consumers Monitored",
    description: "Real-time behavioral tracking",
    icon: Users,
    color: "text-green-600",
  },
  {
    value: 50,
    suffix: "B",
    label: "URLs Tracked Daily",
    description: "Across all major platforms",
    icon: Globe,
    color: "text-purple-600",
  },
  {
    value: 70,
    suffix: "%",
    label: "Visitor Identity Resolution",
    description: "Industry-leading accuracy",
    icon: Target,
    color: "text-orange-600",
  },
];

const TITLES = [
  { text: "1.9T Intent Signals", subtext: "processed every day" },
  { text: "270M US Consumers", subtext: "tracked in real-time" },
  { text: "50B URLs Daily", subtext: "across all platforms" },
  { text: "70% Identity Resolution", subtext: "industry-leading accuracy" },
];

const dataSourcesWithIcons = [
  { name: "Data Co-ops", icon: Share2 },
  { name: "Social Networks", icon: Users },
  { name: "Publishers", icon: FileText },
  { name: "Technology Platforms", icon: Network },
  { name: "Research Firms", icon: Brain },
  { name: "Event Companies", icon: Calendar },
  { name: "Review Sites", icon: MessageSquare },
  { name: "Publishing Networks", icon: BookOpen },
  { name: "Job Postings", icon: Building2 },
  { name: "Search Results", icon: Search },
  { name: "Your Website", icon: MonitorDot },
  { name: "Email Engagement", icon: Mail },
];

const IntegrationCard = ({
  children,
  className,
  borderClassName,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        borderClassName,
        "border-border/70 rounded-full border backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "bg-background relative z-20 flex size-12 rounded-full",
          className,
          isCenter && "size-16",
        )}
      >
        <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
          {children}
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = () => {
  return (
    <div className="absolute top-4 left-4 flex gap-1">
      <div className="h-2 w-2 rounded-full bg-red-400 group-hover:animate-bounce" />
      <div className="h-2 w-2 rounded-full bg-yellow-400 delay-100 group-hover:animate-bounce" />
      <div className="h-2 w-2 rounded-full bg-green-400 delay-200 group-hover:animate-bounce" />
    </div>
  );
};

function SpecialCardContent({
  type,
  currentIndex,
}: {
  type: "line" | "line-dot" | "dot" | "gradient" | "circle";
  currentIndex: boolean;
}) {
  switch (type) {
    case "line":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`h-1 w-16 rounded-full bg-black bg-white transition-transform duration-300 ${
              currentIndex ? "scale-110 rotate-180" : ""
            }`}
          />
        </div>
      );
    case "line-dot":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative transition-all duration-700 group-hover:rotate-90">
            <div className="h-1 w-8 origin-right rounded-full bg-white" />
            <div className="absolute -top-3 -right-1 origin-bottom-right transition-all duration-700 group-hover:rotate-[360deg]">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
      );
    case "dot":
      return (
        <div
          className={`absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black bg-white transition-all duration-300 ${
            currentIndex ? "scale-150 animate-ping" : ""
          }`}
        />
      );
    case "gradient":
      return (
        <div
          className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1 transition-all duration-300 ${
            currentIndex ? "scale-110" : ""
          }`}
        >
          <div className="h-6 w-6 rounded bg-gray-200 bg-gray-700 transition-transform duration-300 group-hover:translate-y-1" />
          <div className="h-6 w-6 rounded bg-gray-400 bg-gray-500 transition-transform delay-100 duration-300 group-hover:-translate-y-1" />
          <div className="h-6 w-6 rounded bg-black bg-white transition-transform delay-200 duration-300 group-hover:translate-y-1" />
        </div>
      );
    case "circle":
      return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-6 w-6 rounded-full bg-black bg-white transition-transform duration-700 ease-in-out group-hover:scale-[2] hover:scale-50" />
        </div>
      );
  }
}

export const IntentDatabase: FC = () => {
  const [showValues, setShowValues] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [currentIndexTitle, setCurrentIndexTitle] = useState(0);

  // <h1 className="">
  {
    /* className="lg:text-5x !font-bolder block max-w-6xl text-center uppercase sm:text-5xl md:text-4xl md:text-6xl lg:text-7xl" */
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowValues(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-cycle through titles when details are shown
  useEffect(() => {
    if (showDetails && currentIndexTitle !== 0) {
      const timer = setTimeout(() => {
        setCurrentIndexTitle((prev) => {
          const next = prev + 1;
          return next > TITLES.length ? 1 : next;
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showDetails, currentIndexTitle]);

  return (
    <section className="mt-24 w-full bg-transparent py-16">
      <div className="container mx-auto px-6">
        <div className="relative mb-16 flex flex-col items-center justify-center space-y-4 text-center">
          {/* <GridBackgroundWithBlur /> */}
          <div className="relative w-full">
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setShowDetails(false);
                    setCurrentIndexTitle(0);
                  }}
                >
                  {/* Card 1: Activity - line */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -50 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={`group border-border absolute bottom-10 left-[20%] size-60 -rotate-6 cursor-pointer rounded-3xl border bg-black p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] ${
                      currentIndexTitle === 1 &&
                      "scale-[1.15] rotate-0 shadow-xl"
                    } ${
                      currentIndexTitle !== 0 &&
                      currentIndexTitle !== 1 &&
                      "opacity-30"
                    }`}
                    onMouseEnter={() => setCurrentIndexTitle(1)}
                    onMouseLeave={() => setCurrentIndexTitle(0)}
                  >
                    <div className="relative h-full w-full">
                      <Activity className="absolute top-0 right-0 h-6 w-6 text-blue-600" />
                      <MousePointer2 className="absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                    </div>
                    <StatusIndicator />
                    <SpecialCardContent
                      type="line"
                      currentIndex={currentIndexTitle === 1}
                    />
                  </motion.div>

                  {/* Card 2: Users - line-dot */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className={`group border-border absolute bottom-10 left-[35%] size-60 rotate-12 cursor-pointer rounded-3xl border bg-black p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] ${
                      currentIndexTitle === 2 &&
                      "scale-[1.15] rotate-0 shadow-xl"
                    } ${
                      currentIndexTitle !== 0 &&
                      currentIndexTitle !== 2 &&
                      "opacity-30"
                    }`}
                    onMouseEnter={() => setCurrentIndexTitle(2)}
                    onMouseLeave={() => setCurrentIndexTitle(0)}
                  >
                    <div className="relative h-full w-full">
                      <Users className="absolute top-0 right-0 h-6 w-6 text-green-600" />
                      <MousePointer2 className="absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                    </div>
                    <StatusIndicator />
                    <SpecialCardContent
                      type="line-dot"
                      currentIndex={currentIndexTitle === 2}
                    />
                  </motion.div>

                  {/* Card 3: Globe - dot */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className={`group border-border absolute right-[30%] bottom-10 size-60 -rotate-[4deg] cursor-pointer rounded-3xl border bg-black p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] ${
                      currentIndexTitle === 3 &&
                      "scale-[1.15] rotate-0 shadow-xl"
                    } ${
                      currentIndexTitle !== 0 &&
                      currentIndexTitle !== 3 &&
                      "opacity-30"
                    }`}
                    onMouseEnter={() => setCurrentIndexTitle(3)}
                    onMouseLeave={() => setCurrentIndexTitle(0)}
                  >
                    <div className="relative h-full w-full">
                      <Globe className="absolute top-0 right-0 h-6 w-6 text-purple-600" />
                      <MousePointer2 className="absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                    </div>
                    <StatusIndicator />
                    <SpecialCardContent
                      type="dot"
                      currentIndex={currentIndexTitle === 3}
                    />
                  </motion.div>

                  {/* Card 4: Target - gradient */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 50 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className={`group border-border absolute right-[20%] bottom-10 size-60 -rotate-12 cursor-pointer rounded-3xl border bg-black p-4 shadow-lg transition-all duration-300 hover:scale-[1.15] ${
                      currentIndexTitle === 4 &&
                      "scale-[1.15] rotate-0 shadow-xl"
                    } ${
                      currentIndexTitle !== 0 &&
                      currentIndexTitle !== 4 &&
                      "opacity-30"
                    }`}
                    onMouseEnter={() => setCurrentIndexTitle(4)}
                    onMouseLeave={() => setCurrentIndexTitle(0)}
                  >
                    <div className="relative h-full w-full">
                      <Target className="absolute top-0 right-0 h-6 w-6 text-orange-600" />
                      <MousePointer2 className="absolute right-2 bottom-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-12" />
                    </div>
                    <StatusIndicator />
                    <SpecialCardContent
                      type="gradient"
                      currentIndex={currentIndexTitle === 4}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* <GridBackgroundWithBlur /> */}
          <div className="relative flex flex-col items-center justify-center">
            <h2 className="relative z-50 mb-8 flex items-baseline gap-3 text-6xl leading-none tracking-tight">
              <span className="text-white">We</span>
              <span
                className={`relative !block max-w-6xl cursor-pointer leading-none transition-all duration-300 ${
                  showDetails
                    ? "text-primary scale-105 opacity-100"
                    : "opacity-80 hover:opacity-100"
                } `}
                onMouseEnter={() => setShowDetails(true)}
                onClick={() => setShowDetails(false)}
              >
                <span className="relative z-10 font-bold tracking-tight italic sm:text-5xl md:text-6xl lg:text-7xl">
                  PROCESS
                </span>
                {/* <span
                  className="animate-shimmer pointer-events-none absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300 opacity-70 blur-[2px]"
                  aria-hidden="true"
                  style={{
                    backgroundSize: "200% 200%",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
                <style>
                  {`
                    @keyframes shimmer {
                      0% {
                        background-position: 0% 50%;
                      }
                      100% {
                        background-position: 100% 50%;
                      }
                    }
                  `}
                </style> */}
              </span>
            </h2>

            {/* Enhanced animation with subtitle */}
            <div className="relative mt-24 flex h-[60px] flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {currentIndexTitle === 0 ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {/* <h2 className="max-w-6xl text-5xl leading-none font-bold tracking-tight text-white"> */}
                    <h2
                      className="lg:text-5x !font-bolder block max-w-6xl text-center uppercase sm:text-5xl md:text-4xl md:text-6xl lg:text-7xl"
                      style={{
                        fontFamily: "Geist Mono",
                        fontWeight: "600",
                      }}
                    >
                      Industry-leading data
                    </h2>
                    <p className="mt-1 text-5xl font-semibold tracking-tight text-white">
                      at unprecedented scale
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentIndexTitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative text-center"
                  >
                    <h2 className="max-w-6xl text-5xl leading-none font-bold tracking-tight text-white uppercase">
                      <TrueFocus
                        sentence={capitalize(
                          TITLES[currentIndexTitle - 1].text,
                        )}
                        full={true}
                        // manualMode={true}
                      />
                    </h2>
                    <p className="mt-1 text-5xl font-semibold tracking-tight text-white">
                      {TITLES[currentIndexTitle - 1].subtext}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-muted-gray-500 mt-12 w-1/2 px-16">
                We aggregate data from multiple trusted sources to provide
                comprehensive intent insights across your entire market.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sources Section */}

        {/* Identity Resolution Engine */}
      </div>
    </section>
  );
};

export default IntentDatabase;
