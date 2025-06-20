"use client";

import { useCallback } from "react";
import { MultiStepForm } from "@/components/ai-form-flow/multi-step-form";
import { FULL_ENRICHMENT_STEPS } from "./onboarding-steps";
import type { BusinessFormData } from "./types";

interface AIOnboardingFlowProps {
  onComplete: (data: BusinessFormData) => Promise<void>;
  onProgress?: (step: number, total: number) => void;
  onAnalysisStart?: (website: string) => Promise<void>;
  initialData?: Partial<BusinessFormData>;
  className?: string;
  flowSteps?: any[]; // For backward compatibility
}

export function AIOnboardingFlow({
  onComplete,
  onProgress,
  onAnalysisStart,
  initialData,
  className = "",
}: AIOnboardingFlowProps) {
  const handleComplete = useCallback(
    async (formData: any) => {
      // Transform the form data to match the expected BusinessFormData structure
      const businessFormData: BusinessFormData = {
        companyName: formData.companyName || "",
        companySize: formData.companySize || "",
        industry: formData.industry || "",
        website: formData.website || "",
        socialLinks: formData.socialLinks || {
          twitter: "",
          instagram: "",
          linkedin: "",
          facebook: "",
        },
        goals: formData.goals || [],
        competitors: formData.competitors || [{ name: "", url: "" }],
        keywords: formData.keywords || [""],
      };

      await onComplete(businessFormData);
    },
    [onComplete],
  );

  return (
    <MultiStepForm
      steps={FULL_ENRICHMENT_STEPS}
      mode="onboarding"
      onComplete={handleComplete}
      onProgress={onProgress}
      onAnalysisStart={onAnalysisStart}
      streamHook="enrichment"
      streamOptions={{
        onProgress: (progress) => {
          console.log("Enrichment progress:", progress);
        },
        onError: (error) => {
          console.error("Enrichment error:", error);
        },
      }}
      theme={{
        variant: "onboarding",
        animations: {
          typingSpeed: 20,
          transitionDuration: 0.3,
        },
      }}
      initialData={
        initialData || {
          companyName: "",
          companySize: "",
          industry: "",
          website: "",
          socialLinks: {
            twitter: "",
            instagram: "",
            linkedin: "",
            facebook: "",
          },
          goals: [],
          competitors: [{ name: "", url: "" }],
          keywords: [""],
        }
      }
      welcomeScreen={{
        title: "Welcome to Intentified",
        subtitle: "Let's set up your account with a quick conversation",
        ctaText: "Let's Get Started",
      }}
      className={className}
    />
  );
}
