"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { FormStep } from "./form-step";
import { WelcomeBentoClient } from "./welcome-bento-client";
import { ProgressIndicator } from "./progress-indicator";
import { CompletionScreen } from "./completion-screen";
import { Footer } from "./footer";
import { useTypingAnimation } from "@/app/dashboard/onboarding/components/hooks/use-typing-animation";
import { useEnrichmentStream } from "@/hooks/use-enrichment-stream";
import { useCompetitorAnalysisStream } from "@/hooks/use-competitor-analysis-stream";
import type {
  OnboardingStep,
  FormFlowState,
  GetProcessedQuestionFunction,
  QuestionProcessingContext,
} from "@/components/ai-form-flow/types";
import { cn } from "@/utils/utils";

export interface MultiStepFormProps {
  // Core configuration
  steps: OnboardingStep[];
  mode: "full-enrichment" | "competitor-analysis" | "custom";

  // Callbacks
  onComplete: (formData: any) => Promise<void>;
  onProgress?: (step: number, total: number) => void;
  onAnalysisStart?: (website: string) => Promise<void>;

  // Stream hook configuration
  streamHook?: "enrichment" | "competitor-analysis" | null;
  streamOptions?: {
    onProgress?: (progress: any) => void;
    onError?: (error: string) => void;
    onComplete?: (result: any) => void;
    onMarketingProgress?: (progress: any) => void;
  };

  // UI configuration
  theme?: {
    variant?: "onboarding" | "landing" | "minimal";
    animations?: {
      typingSpeed?: number;
      transitionDuration?: number;
    };
  };

  // Initial data
  initialData?: Record<string, any>;

  // Welcome screen
  welcomeScreen?: {
    title: string;
    subtitle: string;
    ctaText: string;
  };

  className?: string;
}

export function MultiStepForm({
  steps,
  mode,
  onComplete,
  onProgress,
  onAnalysisStart,
  streamHook,
  streamOptions,
  theme = { variant: "onboarding" },
  initialData = {},
  welcomeScreen = {
    title: "Welcome",
    subtitle: "Let's get started",
    ctaText: "Get Started",
  },
  className = "",
}: MultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); // -1 for welcome, 0 onwards for steps
  const [formData, setFormData] = useState(initialData);

  console.log("🚀 ~ formData:", formData);

  const [isProcessing, setIsProcessing] = useState(false);

  // Filter steps based on mode
  const activeSteps = steps.filter((step) => {
    if (!step.skipInMode) return true;
    if (mode === "custom") return true; // Custom mode includes all steps
    return !step.skipInMode.includes(mode as "full-enrichment" | "competitor-analysis");
  });
  const totalSteps = activeSteps.length;

  // Initialize stream hooks
  const enrichmentStream = useEnrichmentStream();

  console.log("🚀 ~ enrichmentStream:", enrichmentStream);

  const competitorStream = useCompetitorAnalysisStream();

  console.log("🚀 ~ competitorStream:", competitorStream);

  const currentConfig = useMemo(() => {
    if (currentStepIndex >= 0 && currentStepIndex < totalSteps) {
      return activeSteps[currentStepIndex];
    }
    return null;
  }, [currentStepIndex, activeSteps, totalSteps]);

  // This function generates the current question string for the form step,
  // replacing any placeholders (e.g., {fieldName}) in the question text
  // with the corresponding values from the formData object.
  // It uses useCallback to memoize the function based on currentConfig and formData.
  const getProcessedQuestion = useCallback((): string => {
    if (!currentConfig) return "";
    let questionText = currentConfig.question;
    Object.keys(formData).forEach((key) => {
      const placeholder = `{${key}}`;
      if (questionText.includes(placeholder)) {
        questionText = questionText.replace(
          new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          formData[key] || "",
        );
      }
    });
    return questionText;
  }, [currentConfig, formData]) satisfies GetProcessedQuestionFunction;

  // Use typing animation for the current question
  const { displayedText: typedQuestion, isComplete: typingComplete } =
    useTypingAnimation(
      currentStepIndex >= 0 ? getProcessedQuestion() : "",
      theme?.animations?.typingSpeed || 20,
    );

  // Progress tracking
  const currentDisplayStep = currentStepIndex + 1; // For 1-based display

  // Progress tracking
  useEffect(() => {
    if (onProgress && currentStepIndex >= 0) {
      onProgress(currentDisplayStep, totalSteps);
    }
  }, [currentDisplayStep, totalSteps, onProgress, currentStepIndex]);

  const handleSubmit = useCallback(
    async (answer: any) => {
      console.log("🚀 ~ answer:", answer);

      if (!currentConfig) return;

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [currentConfig.field]: answer,
      }));

      // Special handling for website step - trigger analysis
      if (currentConfig.field === "website" && onAnalysisStart) {
        setIsProcessing(true);
        try {
          await onAnalysisStart(answer as string);
        } catch (error) {
          console.error("Analysis failed:", error);
        } finally {
          setIsProcessing(false);
        }
      }

      // Move to next step or complete
      if (currentStepIndex < totalSteps - 1) {
        const delay = 300;
        setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, delay);
      } else {
        // Complete form flow
        const finalFormData = {
          ...formData,
          [currentConfig.field]: answer,
        };

        // Start stream if configured
        if (streamHook && streamOptions) {
          let streamResult = null;
          let streamCompleted = false;
          
          // Create a promise that resolves when the stream completes
          const streamPromise = new Promise<any>((resolve, reject) => {
            const streamOptionsWithCapture = {
              ...streamOptions,
              onComplete: (result: any) => {
                console.log('Stream analysis result:', result);
                streamResult = result;
                streamCompleted = true;
                // Call original onComplete if provided
                if (streamOptions.onComplete) {
                  streamOptions.onComplete(result);
                }
                resolve(result);
              },
              onError: (error: string) => {
                console.error('Stream error:', error);
                // Call original onError if provided
                if (streamOptions.onError) {
                  streamOptions.onError(error);
                }
                reject(new Error(error));
              }
            };

            if (streamHook === "enrichment" && enrichmentStream) {
              enrichmentStream.connect({
                url: finalFormData.website,
                skipScreenshot: false,
                ...streamOptionsWithCapture,
              }).catch(reject);
            } else if (
              streamHook === "competitor-analysis" &&
              competitorStream
            ) {
              competitorStream.connect({
                websiteUrl: finalFormData.website,
                companyName: finalFormData.companyName,
                industry: finalFormData.industry,
                focusAreas: finalFormData.focusAreas,
                skipScreenshot: true,
                ...streamOptionsWithCapture,
              }).catch(reject);
            }
          });

          try {
            // Wait for the stream to complete
            await streamPromise;
            
            // Move to completion and pass both form data and stream results
            setCurrentStepIndex(totalSteps);
            const completeData = {
              ...finalFormData,
              analysisResult: streamResult
            };
            onComplete(completeData);
          } catch (error) {
            console.error("Stream failed:", error);
            // Still complete but without stream result
            setCurrentStepIndex(totalSteps);
            onComplete(finalFormData);
          }
        } else {
          // No streaming - just complete with form data
          const delay = 500;
          setTimeout(() => {
            setCurrentStepIndex(totalSteps);
            onComplete(finalFormData);
          }, delay);
        }
      }
    },
    [
      currentConfig,
      currentStepIndex,
      totalSteps,
      formData,
      onAnalysisStart,
      streamHook,
      streamOptions,
      enrichmentStream,
      competitorStream,
      onComplete,
    ],
  );

  const handleStart = useCallback(() => {
    setCurrentStepIndex(0);
  }, []);

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col overflow-hidden",
        className,
      )}
    >
      <div className="border-turquoise-500 z-10 flex flex-1 flex-col items-center justify-center border border-1 p-4 md:px-6 md:py-16">
        {currentStepIndex >= 0 && ( // Show progress only after welcome
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-[10px] mb-12 w-full max-w-md"
          >
            <ProgressIndicator
              currentStep={Math.min(currentDisplayStep, totalSteps)}
              totalSteps={totalSteps}
              isCompleted={currentStepIndex >= totalSteps}
            />
          </motion.div>
        )}

        <motion.div
          className="relative w-full max-w-md"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30" />
          </div>

          <div className="relative z-10 rounded-xl p-4 md:p-6">
            {currentStepIndex === -1 && (
              <WelcomeBentoClient
                onStart={handleStart}
                welcomeScreen={welcomeScreen}
              />
            )}

            <div className={`${currentStepIndex === -1 ? "hidden" : "block"}`}>
              <AnimatePresence mode="wait" initial={false}>
                {currentConfig && currentStepIndex < totalSteps && (
                  <motion.div
                    key={`step-${currentConfig.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                    {typingComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <FormStep
                          stepConfig={currentConfig}
                          formData={formData}
                          onSubmit={handleSubmit}
                          isProcessing={isProcessing}
                          theme={theme}
                        />
                      </motion.div>
                    )}

                    {/* Processing indicator */}
                    {isProcessing && (
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
                {currentStepIndex >= totalSteps && (
                  <CompletionScreen formData={formData} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
