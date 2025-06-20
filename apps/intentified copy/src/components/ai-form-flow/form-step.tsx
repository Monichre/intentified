"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { SelectInput } from "./select-input";
import type { OnboardingStep, Option, ValidationResult } from "./types";

interface FormStepProps {
  step: number; // Current step index (0-based)
  currentStep: number; // Current active step index (0-based), for showing/hiding logic
  question: string;
  onSubmit: (answer: any) => void; // Answer can be string, string[], etc.
  stepConfig: OnboardingStep; // Configuration for the current step
}

export function FormStep({
  step,
  currentStep,
  question,
  onSubmit,
  stepConfig,
}: FormStepProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<any>(""); // Can be string, string[], etc.
  const mountedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (currentStep === step) {
      setAnswered(false);
      setUserAnswer("");
      setMessageVisible(false);
      setIsTyping(true);

      // Safety check for question prop to prevent runtime errors
      const safeQuestion = question || "";
      const typingTime = Math.min(safeQuestion.length * 15, 1200);

      timerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setIsTyping(false);
          setMessageVisible(true);
        }
      }, typingTime);
    }
  }, [currentStep, step, question]);

  const handleInternalSubmit = (answer: any) => {
    if (
      (typeof answer === "string" && !answer.trim()) ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      return; // Don't submit empty answers
    }

    if (!mountedRef.current) return;

    setUserAnswer(answer);
    setAnswered(true);

    setTimeout(() => {
      if (mountedRef.current) {
        onSubmit(answer);
      }
    }, 300);
  };

  // Validation wrapper that handles the stepConfig validation format
  const validateInput = (
    value: string,
  ): { isValid: boolean; errorMessage?: string } => {
    if (stepConfig.validate) {
      const result = stepConfig.validate(value);
      return {
        isValid: result.isValid,
        errorMessage: result.errorMessage,
      };
    }
    return { isValid: true };
  };

  if (currentStep < step) return null;

  // Render input based on step type
  const renderInput = () => {
    switch (stepConfig.type) {
      case "simple":
      case "url":
      case "email":
        return (
          <ChatInput
            onSubmit={handleInternalSubmit}
            placeholder={stepConfig.placeholder || "Type your answer..."}
            autoFocus
            validate={validateInput}
            inputType={stepConfig.inputType || "text"}
          />
        );
      case "select":
        if (!stepConfig.options || stepConfig.options.length === 0) {
          return (
            <div className="rounded-md bg-red-900/30 p-2 text-sm text-red-400">
              No options provided for select input
            </div>
          );
        }
        return (
          <SelectInput
            options={stepConfig.options}
            onSubmit={handleInternalSubmit}
            placeholder={stepConfig.placeholder || "Select an option..."}
            autoFocus
            multiSelect={false}
          />
        );
      case "multi-select":
        if (!stepConfig.options || stepConfig.options.length === 0) {
          return (
            <div className="rounded-md bg-red-900/30 p-2 text-sm text-red-400">
              No options provided for multi-select input
            </div>
          );
        }
        return (
          <SelectInput
            options={stepConfig.options}
            onSubmit={handleInternalSubmit}
            placeholder={stepConfig.placeholder || "Select options..."}
            autoFocus
            multiSelect={true}
          />
        );
      case "array":
      case "social-links":
        // Placeholder for array/social-links UI
        return (
          <div className="rounded-md bg-amber-900/30 p-2 text-sm text-amber-400">
            Input type '{stepConfig.type}' not yet implemented.
            <ChatInput
              onSubmit={handleInternalSubmit}
              placeholder="Temp: type value(s)"
              autoFocus
            />
          </div>
        );
      default:
        return (
          <p className="text-red-500">Unknown step type: {stepConfig.type}</p>
        );
    }
  };

  const displayUserAnswer = () => {
    if (Array.isArray(userAnswer)) {
      return userAnswer.join(", ");
    }
    return userAnswer.toString();
  };

  // Safety check for question prop
  const safeQuestion = question || "";

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <ChatMessage type="system" content={safeQuestion} isTyping={isTyping} />

      {!answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: messageVisible && !isTyping ? 1 : 0,
            y: messageVisible && !isTyping ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
          style={{
            pointerEvents: messageVisible && !isTyping ? "auto" : "none",
          }}
        >
          <ChatMessage type="input" content={renderInput()} />
        </motion.div>
      )}

      {answered && userAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChatMessage
            type="user"
            content={displayUserAnswer()}
            animate={false}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
