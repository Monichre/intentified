import { DottedVignetteBackground } from "@/components/ui/dotted-vignette-background";
import { AIOnboardingIntegration } from "./components/ai-onboarding-integration";

export default function OnboardingPage() {
  return (
    <div
      id={"ai-onboarding-container"}
      className={`ai-onboarding-container fixed top-0 left-0 h-full w-full bg-black`}
    >
      <div className="absolute top-0 left-0 z-50 h-full w-full bg-none">
        <DottedVignetteBackground />
        <AIOnboardingIntegration />;
      </div>
    </div>
  );
}
