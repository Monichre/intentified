"use client";

import { motion } from "framer-motion";
import { 
  Headphones, 
  Search, 
  Sparkles, 
  Send,
  Activity,
  Globe,
  MessageSquare,
  Calendar
} from "lucide-react";

const steps = [
  {
    number: "1",
    title: "LISTEN",
    subtitle: "Trillions of Signals",
    description: "We monitor 50 billion URLs daily across 270 million US consumers, tracking real-time buying behavior from:",
    features: [
      "Competitor websites",
      "Social media engagement",
      "Search queries",
      "Review sites",
      "Industry publications"
    ],
    icon: Headphones,
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: "2",
    title: "DISCOVER",
    subtitle: "Extreme Precision",
    description: "Our AI identifies prospects actively researching solutions like yours:",
    features: [
      "Which competitors they're visiting",
      "What products they're comparing",
      "When they're ready to buy",
      "Full contact details (name, email, phone)"
    ],
    icon: Search,
    color: "from-purple-500 to-pink-500"
  },
  {
    number: "3",
    title: "CREATE",
    subtitle: "Automated Excellence",
    description: "Personalized campaigns created in real-time:",
    features: [
      "Dynamic content based on intent signals",
      "Industry-specific messaging",
      "Behavior-triggered sequences",
      "Multi-channel coordination"
    ],
    icon: Sparkles,
    color: "from-orange-500 to-red-500"
  },
  {
    number: "4",
    title: "SEND",
    subtitle: "Speed to Lead",
    description: "Reach prospects while they're still shopping:",
    features: [
      "Near real-time email delivery (5 minutes or less)",
      "8 different ISPs for maximum deliverability",
      "Automated text follow-up for hot leads",
      "Direct appointment scheduling"
    ],
    icon: Send,
    color: "from-green-500 to-emerald-500"
  }
];

export const HowItWorksV2 = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How We Turn Intent Into Revenue
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stop Losing to Competitors. Start Winning Their Customers
          </p>
          <p className="text-md text-gray-500 dark:text-gray-500 max-w-2xl mx-auto mt-2">
            Every second, thousands of potential customers visit your competitors' websites. 
            With Intentified, those visitors become your opportunities—at 80% less cost than traditional advertising.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full">
                {/* Step Number */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  {step.subtitle}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {step.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};