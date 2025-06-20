"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import Clock from "@/components/clock";

const tabs = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" }
];

export default function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <>
      <div className="flex justify-between items-center py-10 w-full text-sm font-mono text-neutral-600 h-24 animate-entry">
        <Link href="/craft" className="flex items-center space-x-1 text-xs font-semibold text-neutral-500 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="group-hover:text-neutral-400 transition-colors">Back to Craft</span>
        </Link>
        <div>
          <div style={{ opacity: 1, filter: "blur(0px)", transform: "none" }}>
            <Clock />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-full animate-entry delay-100">
        <p className="text-lg font-semibold text-zinc-300 font-geistSans">Animated Tabs</p>
        <p className="text-xs font-semibold text-neutral-500 font-geistMono mb-12">
          Elevate your navigation with fluid, eye-catching transitions
        </p>
      </div>

      {/* Animated Tabs Demo */}
      <div className="mt-8 mb-16 animate-entry delay-200">
        <div className="relative overflow-hidden bg-neutral-800/20 p-8 rounded-lg shadow-inner flex flex-col items-center">
          <nav className="relative mb-6">
            <div className="flex space-x-4 md:space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
                    activeTab === tab.id ? "text-zinc-200" : "text-neutral-500 hover:text-neutral-400"
                  }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-purple-dark/20 border border-purple/20 rounded-md"
                      style={{ borderRadius: 8 }}
                      transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="w-full max-w-md overflow-hidden">
            <div className="relative mt-6">
              {tabs.map((tab) => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: activeTab === tab.id ? 1 : 0,
                    y: activeTab === tab.id ? 0 : 20,
                    pointerEvents: activeTab === tab.id ? "auto" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                  style={{
                    display: activeTab === tab.id ? "block" : "none",
                  }}
                >
                  <div className="p-6 bg-neutral-800/30 rounded-lg border border-neutral-700/50">
                    <h3 className="text-lg font-medium text-zinc-200 mb-2">
                      {tab.label} Content
                    </h3>
                    <p className="text-neutral-400">
                      This is the {tab.label.toLowerCase()} content area. The smooth transition between tabs
                      creates an elegant user experience that guides users through your application's interface.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-neutral-500">
            <p>
              The animated indicator smoothly transitions between tabs, creating a fluid and intuitive navigation experience.
            </p>
          </div>
        </div>
      </div>

      {/* Code explanation */}
      <div className="animate-entry delay-300 mb-16">
        <div className="bg-neutral-800/20 p-6 rounded-lg border border-neutral-700/50">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">How It Works</h3>
          <p className="text-neutral-400 mb-4">
            This animated tabs component uses Framer Motion for the smooth transitions between tabs. The key features include:
          </p>
          <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-2">
            <li>Layout animations with <code className="text-purple-light bg-neutral-800 px-1 py-0.5 rounded">layoutId</code> for the active tab indicator</li>
            <li>Opacity and position transitions for tab content</li>
            <li>Consistent animation timing for a fluid experience</li>
            <li>Accessibility considerations with proper focus states</li>
          </ul>
          <p className="text-neutral-400 mt-4">
            The component is designed to be responsive and adapts well to different screen sizes. The animations are subtle
            but effective in guiding the user's attention.
          </p>
        </div>
      </div>

      <div className="animate-entry delay-400">
        <Footer />
      </div>
    </>
  );
}
