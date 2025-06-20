"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  XCircle,
} from "lucide-react";

const comparisonData = [
  {
    category: "Performance Metrics",
    items: [
      {
        metric: "Impressions",
        intent: {
          value: "+83%",
          positive: true,
          description: "More targeted reach",
        },
        ppc: {
          value: "Baseline",
          positive: false,
          description: "Broad, untargeted",
        },
      },
      {
        metric: "Cost Per Click",
        intent: {
          value: "-60%",
          positive: true,
          description: "Lower acquisition cost",
        },
        ppc: {
          value: "High",
          positive: false,
          description: "Bidding wars drive up costs",
        },
      },
      {
        metric: "Conversion Rate",
        intent: {
          value: "5-10X",
          positive: true,
          description: "Ready-to-buy leads",
        },
        ppc: {
          value: "2-5%",
          positive: false,
          description: "Mixed intent visitors",
        },
      },
    ],
  },
  {
    category: "Lead Quality",
    items: [
      {
        metric: "Lead Cost",
        intent: {
          value: "$10-$50",
          positive: true,
          description: "80% cheaper",
        },
        ppc: {
          value: "$100-$250+",
          positive: false,
          description: "Per form fill/click",
        },
      },
      {
        metric: "Buyer Intent",
        intent: {
          value: "High-intent",
          positive: true,
          description: "Pre-qualified buyers",
        },
        ppc: {
          value: "Mixed",
          positive: false,
          description: "Often unqualified",
        },
      },
      {
        metric: "Contact Details",
        intent: {
          value: "Full profile",
          positive: true,
          description: "Name, email, phone",
        },
        ppc: {
          value: "Form only",
          positive: false,
          description: "Limited information",
        },
      },
    ],
  },
  {
    category: "Efficiency",
    items: [
      {
        metric: "Waste Reduction",
        intent: {
          value: "-70%",
          positive: true,
          description: "Focus on buyers only",
        },
        ppc: {
          value: "High waste",
          positive: false,
          description: "70% non-buyers",
        },
      },
      {
        metric: "Speed to Lead",
        intent: {
          value: "5 minutes",
          positive: true,
          description: "Real-time contact",
        },
        ppc: {
          value: "Hours/Days",
          positive: false,
          description: "Delayed response",
        },
      },
      {
        metric: "Long-term ROI",
        intent: {
          value: "Own data",
          positive: true,
          description: "Build your database",
        },
        ppc: {
          value: "Rent traffic",
          positive: false,
          description: "Stops when budget ends",
        },
      },
    ],
  },
];

export const IntentVsPPCComparison = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Intent Beats PPC Hands Down
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl dark:text-gray-400">
            See why smart companies are switching from traditional PPC to
            intent-based marketing
          </p>
        </motion.div>

        {/* Main Comparison Grid */}
        <div className="mx-auto max-w-6xl space-y-12">
          {comparisonData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                {category.category}
              </h3>

              <div className="grid gap-6 md:grid-cols-3">
                {category.items.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                      {item.metric}
                    </h4>

                    {/* Intent Data */}
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Intent Data
                        </span>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">
                          {item.intent.value}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-500">
                          {item.intent.description}
                        </div>
                      </div>
                    </div>

                    {/* PPC */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          PPC/Paid Ads
                        </span>
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                        <div className="text-lg font-bold text-red-700 dark:text-red-400">
                          {item.ppc.value}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-500">
                          {item.ppc.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-4xl rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white"
        >
          <h3 className="mb-4 text-2xl font-bold">Why Intent Data Wins</h3>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="flex flex-col items-center">
              <span className="font-semibold">Superior ROI</span>
            </div>
            <div className="flex flex-col items-center">
              <Target className="mb-2 h-8 w-8" />
              <span className="font-semibold">Precision Targeting</span>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="mb-2 h-8 w-8" />
              <span className="font-semibold">Massive Scale</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="mb-2 h-8 w-8" />
              <span className="font-semibold">Real-Time Signals</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
