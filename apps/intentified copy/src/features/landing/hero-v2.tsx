"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const HeroV2 = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-900/20" />
      
      <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Turn Your Competitors' Website Visitors{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Into Your Revenue
              </span>
            </h1>
            
            <p className="mx-auto max-w-3xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
              We track 1.9 trillion intent signals to send real-time emails to people 
              visiting your competitors—100% legal and compliant.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              asChild
            >
              <Link href="/dashboard/onboarding">
                Start Capturing Competitor Traffic
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6 border-2"
              asChild
            >
              <Link href="#how-it-works">
                <PlayCircle className="mr-2 h-5 w-5" />
                See How It Works
              </Link>
            </Button>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                5-10X
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Higher Conversion Rate
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                vs. traditional PPC
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                80%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Lower Cost Per Lead
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                $10-$50 vs. $250+ on paid ads
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                60-70%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Visitor Identity Match
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Know exactly who's shopping
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                150M+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Monthly Email Reach
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Across 8 sending platforms
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};