"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  MousePointer, 
  Search,
  MessageSquare,
  Building,
  FileText,
  Calendar,
  Mail,
  Briefcase,
  Share2,
  Star
} from "lucide-react";

const signalSources = [
  { name: "Data Co-ops", icon: Share2, color: "from-blue-500 to-cyan-500" },
  { name: "Social Channels", icon: MessageSquare, color: "from-purple-500 to-pink-500" },
  { name: "Publishers", icon: FileText, color: "from-green-500 to-emerald-500" },
  { name: "Technology Platforms", icon: Globe, color: "from-orange-500 to-red-500" },
  { name: "Research Firms", icon: Search, color: "from-indigo-500 to-purple-500" },
  { name: "Event Firms", icon: Calendar, color: "from-pink-500 to-rose-500" },
  { name: "Review Sites", icon: Star, color: "from-yellow-500 to-orange-500" },
  { name: "Job Postings", icon: Briefcase, color: "from-teal-500 to-cyan-500" },
  { name: "Your Website", icon: MousePointer, color: "from-violet-500 to-purple-500" },
  { name: "Email Engagement", icon: Mail, color: "from-red-500 to-pink-500" },
  { name: "Search Results", icon: Search, color: "from-blue-500 to-indigo-500" },
  { name: "Advertising", icon: Building, color: "from-gray-500 to-gray-700" }
];

export const IntentSignalsVisualization = () => {
  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/20 to-transparent dark:via-indigo-900/10" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Where Intent Signals Come From
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We aggregate data from thousands of sources to build the most comprehensive 
            view of buyer intent in real-time
          </p>
        </motion.div>

        {/* Central Hub Visualization */}
        <div className="relative max-w-6xl mx-auto">
          {/* Center Node */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-2xl z-10"
          >
            <div className="text-white text-center">
              <div className="text-2xl md:text-3xl font-bold">1.9T</div>
              <div className="text-xs md:text-sm">Signals</div>
            </div>
          </motion.div>

          {/* Signal Sources */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-8 pt-32 pb-32 md:pt-40 md:pb-40">
            {signalSources.map((source, index) => (
              <motion.div
                key={source.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Connection Line */}
                <svg
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ zIndex: -1 }}
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="0%"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-400 dark:text-gray-600"
                    strokeDasharray="5,5"
                  />
                </svg>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${source.color} flex items-center justify-center mb-3 mx-auto`}>
                    <source.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center font-medium">
                    {source.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              50B
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              URLs tracked daily
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              270M
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              US consumers monitored
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              60-70%
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Visitor identity match
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};