"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Database, TrendingUp, Zap, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const metrics = [
  {
    icon: <Database />,
    value: "1.9T",
    label: "Intent Signals",
    description: "Tracked in real-time",
  },
  {
    icon: <Users />,
    value: "270M",
    label: "US Consumers",
    description: "Monitored daily",
  },
  {
    icon: <TrendingUp />,
    value: "5-10X",
    label: "Higher Conversion",
    description: "vs. traditional PPC",
  },
  {
    icon: <Zap />,
    value: "5 min",
    label: "Speed to Lead",
    description: "Real-time delivery",
  },
];

export const HeroIntentFocused = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden py-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20" />
        <div className="bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02] absolute inset-0" />
      </div>

      {/* Floating particles animation */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-indigo-500/20"
            initial={{
              x: 0,
              y: 0,
            }}
            animate={{
              x: "100%",
              y: "100%",
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div> */}

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                <Database className="h-4 w-4" />
                Powered by 1.9 Trillion Intent Signals
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Turn Intent Data Into
                <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Revenue-Generating Leads
                </span>
              </h1>

              <p className="mb-8 text-lg text-gray-600 md:text-xl dark:text-gray-300">
                Stop guessing who's interested. We track real-time buying
                behavior across 50 billion URLs daily, delivering hot leads
                directly to your inbox—at 80% less cost than traditional
                advertising.
              </p>

              <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-white hover:from-indigo-700 hover:to-violet-700"
                  asChild
                >
                  <Link href="/dashboard/onboarding">
                    Start Your Free Intent Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2"
                  asChild
                >
                  <Link href="#process">See Our Process</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span>100% Legal & Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <span>150M+ Emails Monthly</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <motion.div className="mb-4 h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {metric.label}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {metric.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
