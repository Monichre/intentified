"use client";
import { CTA } from "@/features/landing/cta";
// import CustomerTestimonials from "@/features/landing/customer-testimonials";
// import FAQTrustIndicators from "@/features/landing/faq-trust-indicators";
import FeaturesSection, {
  Features,
  IntegrationFeaturesSection,
} from "@/features/landing/features";
// import { Header } from "@/components/header";
import { Hero } from "@/features/landing/hero";
import Image from "next/image";
// import HijackingSystemFeatureSection from "@/features/landing/hijacking-system-feature-section";
import IntentDatabase from "@/features/landing/intent-database";
import MetricsComparison from "@/features/landing/metrics-comparison";
import ProcessFramework from "@/features/landing/process-framework";
import { Clients } from "@/features/landing/testimonials";

import { ProcessFrameworkWorkflow } from "@/features/landing/process-framework-workflow";
import { ProcessFrameworkAnimatedWorkflow } from "@/features/landing/ProcessFrameworkWithWorkflow";
import { CloudSyncing } from "@/components/cloud-sync";

// import { TimelineProgress } from "@/components/TimelineProgress";
import { HijackHero } from "@/components/hijack-hero";
import { AnimatedTestimonials } from "@/components/AnimatedTestimonials";
import { CardCarousel } from "@/components/ui/card-carousel";

import { IntentifiedSignalSourcingPipeline } from "@/components/intentified-signal-sourcing-pipeline";

import { Header } from "@/components/header/header";

import { Button } from "@/components/ui/button";
import { Footer } from "@/features/landing/footer";

import HijackingSystemFeatureSection from "@/features/landing/hijacking-system-feature-section";
import { GridBackgroundWithBlur } from "@/components/backgrounds/grid-backgrounds/grid-background-with-blur";
import IntentDataSources from "@/features/landing/intent-data-sources";

import { IntentVsTraditional } from "@/features/landing/intent-vs-traditional";
import { IntentVsPPCComparison } from "@/features/landing/intent-vs-ppc-comparison";
import { IntentSignalsVisualization } from "@/features/landing/intent-signals-visualization";
import { IntentDatabaseStats } from "@/features/landing/intent-database-stats";

import IdentityResolutionEngine from "@/features/landing/identity-resolution-engine";

import { HijackingSystemWorkflow } from "@/features/landing/hijacking-system-workflow";

import { HeroV2 } from "@/features/landing/hero-v2";
import { HeroIntentFocused } from "@/features/landing/hero-intent-focused";
import FaqTrustIndicators from "@/features/landing/faq-trust-indicators";
import CustomerTestimonials from "@/features/landing/customer-testimonials";
import AnimatedWorkflowDiagram from "@/features/landing/AnimatedWorkflowDiagram";
import { InteractiveDevelopSection } from "@/features/landing/interactive-develop-section";
import DataFeedingIn from "@/components/DataFeedingIn";
import { LeadCaptureCTA } from "@/features/landing/lead-capture-cta";
import { BackgroundDots } from "@/components/background";
import { Card } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/utils/utils";

const images = [
  { src: "/krakenimages-376KN_ISplE-unsplash.jpg", alt: "Jenny W." },
  {
    src: "/imgi_49_smiling-young-asian-man-checking-electronic-banking-on-his-smartphone-as-he-received.png",
    alt: "Bruce",
  },
  { src: "/bruce-mars-8YG31Xn4dSw-unsplash.jpg", alt: "Piper" },
];

/*

Look, 
we got one marketing savant, one creative savant, and one savant to rule them all... our dev, obviously.  Honesty though, no one has ever even seen him before.
Anyway my point here's the jargon soaked breakdown of the masterpiece we built....



{WEbsite Jargon Copy}


Real talk though, we got a lot of people who wanna buy a thing, you're selling a thing, sell them the thing. OVer and over again.

*/

// Section wrapper component for consistent spacing and layout
const Section = ({
  children,
  className = "",
  id,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: "compact" | "default" | "spacious";
}) => {
  const sizeClasses = {
    compact: "py-12 md:py-16",
    default: "py-16 md:py-20 lg:py-24",
    spacious: "py-20 md:py-24 lg:py-32",
  };

  return (
    <section
      id={id}
      className={`bg-black px-4 md:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
};

const BackgroundElements = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[-10px] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:12px_12px]"
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] right-[40%] z-[-10px] h-[400px] w-[400px] rounded-full bg-[turquoise]/10 blur-2xl"
        aria-hidden="true"
      ></div>
      <div
        className="bg-primary/20 absolute bottom-16 left-0 -z-10 h-36 w-36 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
    </>
  );
};

export const LandingOne = () => {
  return (
    <div className="bg-black">
      {/* Fixed header with proper z-index */}
      {/* <Header />
       */}

      <div className="relative sticky top-0 z-50 w-full bg-black">
        <nav
          className="flex h-16 items-center justify-between px-4 sm:px-6"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="Intentified homepage"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo-white.png"
                alt="Intentified"
                width={200}
                height={100}
                className="h-auto w-auto"
              />
            </div>
          </Link>
        </nav>
      </div>
      <GridBackgroundWithBlur />
      {/* Background layer */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="bg-grid-pattern pointer-events-none absolute inset-0 z-[-10px] bg-black" />

        <BackgroundElements />
      </div>

      {/* Main content with proper layout flow */}
      <main className="relative min-h-screen">
        {/* Hero section with proper spacing */}
        <Section
          size="spacious"
          className="bg-black pt-20 md:p-12 md:pt-24 lg:pt-28"
        >
          <Hero />
        </Section>

        {/* Data feeding section */}
        {/* <Section size="default">
          <DataFeedingIn />
        </Section> */}

        {/* Intent database section */}
        <Section size="default" id="intent-database">
          {/* <BackgroundDots /> */}
          <IntentDatabase />
        </Section>
        <IntentDataSources />

        <Section size="compact">
          <IntentifiedSignalSourcingPipeline showCompetitorAnalysis={true} />
          <BackgroundElements />
          {/* <div className="bg-grid-pattern pointer-events-none absolute inset-0 z-[-10px]" /> */}
        </Section>

        {/* Cloud syncing */}
        {/* <Section size="compact">
          <CloudSyncing />
        </Section> */}

        {/* Features section */}
        <Section size="default">
          {/* <GridBackgroundWithBlur /> */}
          {/* <FeaturesSection /> */}
          <IntegrationFeaturesSection />
        </Section>

        {/* Metrics comparison */}
        <Section size="default">
          <MetricsComparison />
        </Section>

        {/* Lead capture CTA */}
        <Section size="spacious" id="lead-capture">
          <LeadCaptureCTA />
        </Section>
      </main>

      <style jsx global>{`
        @import "../../../styles/typography.css";

        .bg-grid-pattern {
          background-image:
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Improve text rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};
