import { MultiStepForm } from "@/components/ai-form-flow/multi-step-form";

// Simple demo steps for the tour
const DEMO_STEPS = [
  {
    id: 1,
    type: "simple" as const,
    field: "name",
    question: "Welcome! What's your name?",
    placeholder: "Enter your name",
    validate: (value: string) => (value.length > 0 ? null : "Name is required"),
  },
  {
    id: 2,
    type: "simple" as const,
    field: "email",
    question: "Nice to meet you, {name}! What's your email address?",
    placeholder: "Enter your email",
    inputType: "email" as const,
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : "Please enter a valid email";
    },
  },
  {
    id: 3,
    type: "simple" as const,
    field: "company",
    question: "Thanks! Which company do you work for?",
    placeholder: "Enter your company name",
    validate: (value: string) =>
      value.length > 0 ? null : "Company is required",
  },
  {
    id: 4,
    type: "simple" as const,
    field: "details",
    question: "Tell me more about your project, {name}.",
    placeholder: "Describe your project or goals",
    validate: (value: string) =>
      value.length > 0 ? null : "Please provide some details",
  },
];

export const AiOnboardTour = () => {
  const handleComplete = async (formData: any) => {
    console.log("Tour completed with data:", formData);
    // Handle completion - could redirect, show success message, etc.
  };

  return (
    <MultiStepForm
      steps={DEMO_STEPS}
      mode="custom"
      onComplete={handleComplete}
      theme={{
        variant: "onboarding",
        animations: {
          typingSpeed: 30,
          transitionDuration: 0.3,
        },
      }}
      welcomeScreen={{
        title: "Welcome to Intentified",
        subtitle: "Let's take a quick tour together",
        ctaText: "Start Tour",
      }}
    />
  );
};
