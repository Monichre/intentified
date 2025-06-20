import { HeroV2 } from "@/features/landing/hero-v2";
import { HowItWorksV2 } from "@/features/landing/how-it-works-v2";
import { IntentVsTraditional } from "@/features/landing/intent-vs-traditional";
import { IntentDatabaseStats } from "@/features/landing/intent-database-stats";
import { LeadCaptureCTA } from "@/features/landing/lead-capture-cta";
import { TestimonialsV2 } from "@/features/landing/testimonials-v2";
import { FAQV2 } from "@/features/landing/faq-v2";
import { FinalCTA } from "@/features/landing/final-cta";
import { Footer } from "@/features/landing/footer";

export const LandingTwo = () => {
  return (
    <main className="min-h-screen">
      <HeroV2 />
      <HowItWorksV2 />
      <IntentVsTraditional />
      <IntentDatabaseStats />
      <LeadCaptureCTA />
      <TestimonialsV2 />
      <FAQV2 />
      <FinalCTA />
      <Footer />
    </main>
  );
};
