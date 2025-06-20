
import { HeroIntentFocused } from "@/features/landing/hero-intent-focused";
import { IntentSignalsVisualization } from "@/features/landing/intent-signals-visualization";
import { ProcessFlowInteractive } from "@/features/landing/process-flow-interactive";
import { IntentVsPPCComparison } from "@/features/landing/intent-vs-ppc-comparison";
import { IntentDatabaseStats } from "@/features/landing/intent-database-stats";
import { LeadCaptureFormInteractive } from "@/features/landing/lead-capture-form-interactive";
import { TestimonialsV2 } from "@/features/landing/testimonials-v2";
import { FAQV2 } from "@/features/landing/faq-v2";
import { FinalCTA } from "@/features/landing/final-cta";
import { Footer } from "@/features/landing/footer";

export const LandingThree = () => {
  return (
    <main className="min-h-screen">
      
      <HeroIntentFocused />
      <IntentSignalsVisualization />
      <ProcessFlowInteractive />
      <IntentVsPPCComparison />
      <IntentDatabaseStats />
      <LeadCaptureFormInteractive />
      <TestimonialsV2 />
      <FAQV2 />
      <FinalCTA />
      <Footer />
    </main>
  );
};
