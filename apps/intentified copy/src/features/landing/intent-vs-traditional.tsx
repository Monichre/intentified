"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const comparisons = [
  {
    feature: "Cost Per Lead",
    intentified: "$10-$50",
    traditional: "$100-$250+",
    intentifiedBetter: true,
  },
  {
    feature: "Lead Quality",
    intentified: "High-intent, in-market buyers",
    traditional: "Mixed, often unqualified",
    intentifiedBetter: true,
  },
  {
    feature: "Timing",
    intentified: "Real-time, while shopping",
    traditional: "Days or weeks later",
    intentifiedBetter: true,
  },
  {
    feature: "Data Ownership",
    intentified: "You own all prospect data",
    traditional: "Only form submissions",
    intentifiedBetter: true,
  },
  {
    feature: "Competitor Advantage",
    intentified: "Capture their visitors",
    traditional: "Bidding wars",
    intentifiedBetter: true,
  },
];

export const IntentVsTraditional = () => {
  return (
    <section className="bg-white py-20 lg:py-32 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Intent Data vs. Traditional Marketing
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl dark:text-gray-400">
            See why smart companies are switching to intent-based marketing
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl dark:border-gray-700"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white"></th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Intentified</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span>PPC/Paid Ads</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisons.map((item, index) => (
                  <motion.tr
                    key={item.feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {item.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-gray-700 dark:bg-green-900/20 dark:text-gray-300">
                          {item.intentified}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.traditional}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
