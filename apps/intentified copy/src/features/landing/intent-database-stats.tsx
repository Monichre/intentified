"use client";

import { motion } from "framer-motion";
import { Database, Globe, Activity, Users } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";

const stats = [
  {
    label: "Intent signals processed",
    value: 1.9,
    suffix: "T",
    icon: Activity,
    description: "Real-time behavioral data points"
  },
  {
    label: "US consumers monitored",
    value: 270,
    suffix: "M",
    icon: Users,
    description: "Active online shoppers tracked"
  },
  {
    label: "URLs tracked daily",
    value: 50,
    suffix: "B",
    icon: Globe,
    description: "Across competitor websites"
  },
  {
    label: "Visitor identity resolution",
    value: 70,
    suffix: "%",
    icon: Database,
    description: "Match rate for website visitors"
  }
];

const dataSources = [
  "Data Co-ops",
  "Social Networks",
  "Publishers",
  "Technology Platforms",
  "Research Firms",
  "Event Companies",
  "Review Sites",
  "Publishing Networks",
  "Job Postings",
  "Search Results",
  "Your Website",
  "Email Engagement"
];

export const IntentDatabaseStats = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-violet-900/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            The Largest Intent Database in America
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-Time Intent Tracking at Unprecedented Scale
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </div>
              
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {stat.label}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-8">
            Where Our Intent Signals Come From
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {dataSources.map((source, index) => (
              <motion.div
                key={source}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 shadow-sm"
              >
                {source}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};