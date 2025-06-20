"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Search,
  Sparkles,
  Send,
  ChevronRight,
  Globe,
  Users,
  Brain,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { processSteps } from "@/features/landing/process-steps"


export const ProcessFlowInteractive = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="bg-white py-20 lg:py-32 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            Our Process: From Data to Customers in Minutes
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl dark:text-gray-400">
            Four powerful steps that transform anonymous website visitors into
            qualified leads
          </p>
        </motion.div>

        {/* Process Steps Navigation */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {processSteps.map((step, index) => (
            <motion.button
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setActiveStep(index)}
              className={`flex items-center gap-3 rounded-full px-6 py-3 transition-all ${
                activeStep === index
                  ? "bg-gradient-to-r " +
                    step.color +
                    " scale-105 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <step.icon className="h-5 w-5" />
              <span className="font-semibold">{step.title}</span>
              {index < processSteps.length - 1 && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Active Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-5xl"
          >
            <div className="rounded-2xl bg-gray-50 p-8 md:p-12 dark:bg-gray-900">
              <div className="grid items-center gap-8 md:grid-cols-2">
                {/* Left Content */}
                <div>
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${processSteps[activeStep].color} mb-6`}
                  >
                    {processSteps[activeStep].icon &&
                      React.createElement(processSteps[activeStep].icon, {
                        className: "w-8 h-8 text-white",
                      })}
                  </div>

                  <h3 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                    {processSteps[activeStep].title}
                  </h3>
                  <p className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
                    {processSteps[activeStep].subtitle}
                  </p>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    {processSteps[activeStep].description}
                  </p>

                  {/* Progress Indicator */}
                  <div className="mb-6 flex items-center gap-2">
                    {processSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          index <= activeStep
                            ? "bg-gradient-to-r " +
                              processSteps[activeStep].color
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Content - Details */}
                <div className="space-y-4">
                  {processSteps[activeStep].details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-4 rounded-xl bg-white p-4 dark:bg-gray-800"
                    >
                      <div
                        className={`h-10 w-10 rounded-lg bg-gradient-to-r ${processSteps[activeStep].color} flex flex-shrink-0 items-center justify-center`}
                      >
                        {detail.icon && (
                          <detail.icon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {detail.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA for last step */}
              {activeStep === processSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 text-center"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                    asChild
                  >
                    <a href="#lead-capture">
                      Start Capturing Intent Leads
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Powered by our massive infrastructure:
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>150M+</strong> emails sent monthly
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>8</strong> different ISPs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>SMS</strong> follow-up for hot leads
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
