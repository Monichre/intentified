"use client";

import { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { FormStep } from "./form-step";
import { useTypingAnimation } from "@/app/dashboard/onboarding/components/hooks/use-typing-animation";
import type { FormFlowConfig, FormFlowState, OnboardingStep } from "./types";
import { cn } from "@/utils/utils";
import "./ai-onboarding.css";

export interface AIFormFlowProps {
  config: FormFlowConfig;
  className?: string;
}

export const AIFormFlow = memo(function AIFormFlow({
  config,
  className = "",
}: AIFormFlowProps) {
  const [state, setState] = useState<FormFlowState>({
    currentStep: 0,
    isTyping: false,
    isProcessing: false,
    isFirstTransition: true,
    formData: config.initialData || {},
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter steps based on mode
  const activeSteps = config.steps.filter(
    (step) => !step.skipInMode?.includes(config.mode),
  );

  const totalSteps = activeSteps.length;

  // Progress tracking
  useEffect(() => {
    if (config.onProgress) {
      config.onProgress(state.currentStep, totalSteps);
    }
  }, [state.currentStep, totalSteps, config]);

  const getCurrentStep = (): OnboardingStep | null => {
    return activeSteps[state.currentStep - 1] || null;
  };

  const getQuestionText = useCallback(
    (step: OnboardingStep): string => {
      let question = step.question;
      // Replace placeholders with actual data
      Object.keys(state.formData).forEach((key) => {
        const placeholder = `{${key}}`;
        if (question.includes(placeholder)) {
          question = question.replace(placeholder, state.formData[key]);
        }
      });
      return question;
    },
    [state.formData],
  );

  // Get the current question text for typing animation
  const currentStep = getCurrentStep();
  const currentQuestionText = currentStep ? getQuestionText(currentStep) : "";

  // Use typing animation for the current question
  const { displayedText: typedQuestion, isComplete: typingComplete } =
    useTypingAnimation(
      state.currentStep > 0 && state.currentStep <= totalSteps
        ? currentQuestionText
        : "",
      config.theme?.animations?.typingSpeed || 20,
    );

  const handleStepSubmit = useCallback(
    async (stepAnswer: any) => {
      const currentStep = getCurrentStep();
      if (!currentStep) return;

      // Update form data
      setState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          [currentStep.field]: stepAnswer,
        },
      }));

      // Special handling for website step - trigger analysis
      if (currentStep.field === "website" && config.onAnalysisStart) {
        setState((prev) => ({ ...prev, isProcessing: true }));
        try {
          await config.onAnalysisStart(stepAnswer as string);
        } catch (error) {
          console.error("Analysis failed:", error);
        } finally {
          setState((prev) => ({ ...prev, isProcessing: false }));
        }
      }

      // Move to next step or complete
      if (state.currentStep < totalSteps) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
            isTyping: false,
          }));
        }, 400);
      } else {
        // Complete form flow
        const finalFormData = {
          ...state.formData,
          [currentStep.field]: stepAnswer,
        };

        setTimeout(() => {
          config.onComplete(finalFormData);
        }, 500);
      }
    },
    [state.currentStep, state.formData, totalSteps, config, activeSteps],
  );

  const handleStart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: 1,
      isFirstTransition: false,
      isTyping: false,
    }));
  }, []);

  const getThemeClasses = () => {
    const variant = config.theme?.variant || "onboarding";
    const baseClasses =
      "absolute top-0 left-0 z-50 h-full w-full overflow-hidden";

    switch (variant) {
      case "landing":
        return cn(
          baseClasses,
          "bg-gradient-to-br from-gray-900 via-black to-gray-800",
        );
      case "minimal":
        return cn(baseClasses, "bg-white dark:bg-gray-950");
      default:
        return cn(baseClasses, "bg-transparent");
    }
  };

  const welcomeConfig = config.welcomeScreen || {
    title: "Welcome to Intentified",
    subtitle: "Let's set up your account with a quick conversation",
    ctaText: "Let's Get Started",
  };

  return (
    <div className={cn(getThemeClasses(), className)}>
      <div
        ref={containerRef}
        className="relative z-10 mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* Welcome screen */}
          {state.currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center"
            >
              <motion.h1
                className="mb-6 text-4xl font-bold text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {welcomeConfig.title}
              </motion.h1>
              <motion.p
                className="mb-8 text-xl text-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {welcomeConfig.subtitle}
              </motion.p>
              <motion.button
                onClick={handleStart}
                className={cn(
                  "rounded-xl border border-white/10 bg-white/20 px-8 py-3",
                  "text-white backdrop-blur-sm transition-all duration-200",
                  "hover:bg-white/30",
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {welcomeConfig.ctaText}
                <ChevronRight className="ml-2 inline-block h-4 w-4" />
              </motion.button>
            </motion.div>
          )}

          {/* Form steps */}
          {state.currentStep > 0 && state.currentStep <= totalSteps && (
            <motion.div
              key={`step-${state.currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Question display */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  {typedQuestion}
                  {!typingComplete && (
                    <motion.span
                      className="ml-1 inline-block h-6 w-0.5 bg-white/70"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </h2>
              </motion.div>

              {/* Input area */}
              {typingComplete && currentStep && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormStep
                    step={currentStep}
                    formData={state.formData}
                    onSubmit={handleStepSubmit}
                    isProcessing={state.isProcessing}
                    theme={config.theme}
                  />
                </motion.div>
              )}

              {/* Processing indicator */}
              {state.isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 py-4 text-center"
                >
                  <div className="inline-flex items-center space-x-2 text-white/70">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white/50"></div>
                    <span>Analyzing...</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        {state.currentStep > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 transform"
          >
            <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <div className="text-sm text-white/70">
                Step {state.currentStep} of {totalSteps}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
});
