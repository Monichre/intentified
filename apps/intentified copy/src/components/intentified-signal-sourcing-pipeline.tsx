"use client";

import {
  Radar,
  Search,
  Wand2,
  Send,
  Database,
  Globe,
  Users,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { motion, AnimatePresence } from "framer-motion";
import { CTAButton } from "@/features/landing/hero";
import { Button } from "@/components/ui/button";
import { LEAD_GEN_COMPETITOR_ANALYSIS_CONFIG } from "@/app/dashboard/onboarding/components/onboarding-steps";
import { RealtimeCollaboration } from "@/components/RealtimeCollaboration";
import { MultiStepForm } from "@/components/ai-form-flow/multi-step-form";

const timelineData = [
  {
    id: 1,
    title: "Listen",
    date: "Real-time",
    content:
      "We track online activity across billions of daily interactions. Using real-time data, we identify who's interested in your products, enabling precise marketing and lead prioritization. Track 1.9 trillion intent signals from 270 million US consumers across 50 billion URLs daily with 60-70% visitor matching to profiles.",
    category: "Data Collection",
    icon: Radar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Discover",
    date: "Analysis",
    content:
      "We identify prospects actively researching solutions like yours by analyzing online behaviors—competitor visits, social media engagement, and keyword searches. Target high-intent leads ready to buy and get faster, qualified sales leads through advanced behavioral analysis.",
    category: "Intent Analysis",
    icon: Search,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Create",
    date: "Generation",
    content:
      "Automated content creation and campaigns with extreme targeting of matching in-market prospects. Our AI-powered system generates personalized messaging and campaigns tailored to each prospect's specific intent signals and behavioral patterns.",
    category: "Content Creation",
    icon: Wand2,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 4,
    title: "Send",
    date: "Delivery",
    content:
      "Multi-channel outreach using 8 different ISPs, sending over 150M emails. Once a lead is hot or opts in, text message outreach is activated for immediate engagement and appointment setting with qualified prospects.",
    category: "Outreach",
    icon: Send,
    relatedIds: [3],
    status: "pending" as const,
    energy: 60,
  },
];

const signalSources = [
  { name: "Data Co-op", icon: Database },
  { name: "Social Channels", icon: Users },
  { name: "Publishers", icon: Globe },
  { name: "Technology Platforms", icon: TrendingUp },
  { name: "Research Firms", icon: Search },
  { name: "Event Firms", icon: Users },
  { name: "Review Sites", icon: TrendingUp },
  { name: "Publishing Networks", icon: Globe },
  { name: "Advertising", icon: TrendingUp },
  { name: "Job Postings", icon: Users },
  { name: "Search Engine Results", icon: Search },
  { name: "Your Website", icon: Globe },
  { name: "Emails", icon: Send },
];

interface IntentifiedSignalSourcingPipelineProps {
  showMetrics?: boolean;
}

export function IntentifiedSignalSourcingPipeline({
  showMetrics = true,
}: IntentifiedSignalSourcingPipelineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleStartTracking = () => {
    console.log("Starting competitive analysis modal...");
    setIsModalOpen(true);
  };

  // const handleAnalysisComplete = (analysis: CompetitorAnalysisResponse) => {
  //   console.log("Competitor analysis completed:", analysis);
  //   // You can handle the completed analysis here
  //   // For now, we'll just close the modal
  //   setTimeout(() => {
  //     setIsModalOpen(false);
  //   }, 1000);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative w-full">
        {/* <GridBackgroundWithBlur noBlur={true} /> */}
        <div className="relative mt-24 flex flex-col items-center justify-center space-y-3 text-center">
          {/* <h2 className="relative z-50 mb-8 flex items-baseline gap-3 text-3xl text-6xl font-bold tracking-tight tracking-tighter text-white sm:text-3xl md:text-5xl"> */}
          {/* <TrueFocus
              sentence="How We Turn Intent Into Revenue"
              activeIndices={[3, 5]}
            /> */}
          <h2 className="relative z-50 mb-8 flex items-baseline gap-3 text-6xl leading-none tracking-tight">
            <span className="text-white"> How We </span>

            <span className="relative z-10 font-bold tracking-tight italic sm:text-5xl md:text-6xl lg:text-7xl">
              Turn
            </span>
          </h2>

          <div className="relative flex h-[60px] flex-col items-center justify-center">
            <span className="relative z-10 font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Intent Into Revenue
            </span>
          </div>

          <p className="mt-16 max-w-[600px] text-sm text-gray-400 md:text-base lg:text-sm xl:text-base">
            Our proven four-step process captures competitor traffic and
            converts it into qualified leads for your business.
          </p>
          <RealtimeCollaboration />
        </div>
        {/* Signal Sources Sidebar */}
        {showMetrics && (
          <div className="h-[600px]] absolute top-1/2 left-8 z-10 -translate-y-1/2 rounded-lg border border-white/10 bg-black/50 p-4 backdrop-blur-lg">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Signal Sources
            </h3>
            <div className="space-y-2">
              {signalSources.slice(0, 8).map((source) => {
                const Icon = source.icon;
                return (
                  <div
                    key={source.name}
                    className="flex items-center gap-2 text-xs text-white/70"
                  >
                    <Icon size={12} className="text-white/50" />
                    <span>{source.name}</span>
                  </div>
                );
              })}
              <div className="mt-2 text-xs text-white/50">
                +{signalSources.length - 8} more sources
              </div>
            </div>
          </div>
        )}

        {/* Metrics Panel */}
        {showMetrics && (
          <div className="absolute top-1/2 right-8 z-10 -translate-y-1/2 rounded-lg border border-white/10 bg-black/50 p-4 backdrop-blur-lg">
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Live Metrics
            </h3>
            <div className="space-y-3">
              <div className="text-xs">
                <div className="mb-1 text-white/70">Visitor Matching</div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-auto w-[65%] bg-gradient-to-r from-green-500 to-blue-500"></div>
                  </div>
                  <span className="text-xs text-white">65%</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="mb-1 text-white/70">Intent Accuracy</div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-auto w-[92%] bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  </div>
                  <span className="text-xs text-white">92%</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="mb-1 text-white/70">Email Delivery</div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-auto w-[88%] bg-gradient-to-r from-blue-500 to-teal-500"></div>
                  </div>
                  <span className="text-xs text-white">88%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Timeline Component */}
        <RadialOrbitalTimeline timelineData={timelineData} />

        {/* Bottom CTA */}
        <div className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2 text-center">
          <CTAButton
            onClick={handleStartTracking}
            className="border-turquoise-500 transform rounded-lg border border-1 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105"
          >
            Start Tracking Intent Signals
          </CTAButton>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-gray-100 p-0 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={handleCloseModal}
              >
                <X size={16} />
              </Button>

              <div className="mt-4">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Competitive Analysis Setup
                </h2>

                {/* Debug info */}
                <div className="mb-4 text-sm text-gray-600">
                  Steps: {LEAD_GEN_COMPETITOR_ANALYSIS_CONFIG.steps.length}
                </div>

                <div className="min-h-[400px]">
                  <MultiStepForm
                    steps={LEAD_GEN_COMPETITOR_ANALYSIS_CONFIG.steps}
                    mode="competitor-analysis"
                    initialData={LEAD_GEN_COMPETITOR_ANALYSIS_CONFIG.formData}
                    onComplete={async (data) => {
                      console.log("Lead capture and competitive analysis completed:", data);
                      
                      // Extract lead information
                      const leadData = {
                        name: data.userName,
                        email: data.userEmail,
                        company: data.companyName,
                        industry: data.industry,
                        website: data.website,
                        source: 'competitor-analysis-landing',
                        timestamp: new Date().toISOString(),
                        analysisResult: data.analysisResult
                      };
                      
                      console.log("Lead data captured:", leadData);
                      
                      // TODO: Send lead data to your CRM/database
                      // await sendLeadToDatabase(leadData);
                      
                      setIsModalOpen(false);
                      
                      // Optional: Show success message or redirect to thank you page
                      // You could also send a follow-up email with the analysis results
                    }}
                    onProgress={(step, total) => {
                      console.log(`Progress: ${step}/${total}`);
                    }}
                    streamHook="competitor-analysis"
                    streamOptions={{
                      onProgress: (progress) => {
                        console.log('Analysis progress:', progress);
                      },
                      onError: (error) => {
                        console.error('Analysis error:', error);
                      },
                      onComplete: (result) => {
                        console.log('Analysis completed:', result);
                      },
                      onMarketingProgress: (progress) => {
                        console.log('Marketing progress:', progress);
                      }
                    }}
                    onAnalysisStart={async (website) => {
                      console.log('Starting analysis for website:', website);
                    }}
                    welcomeScreen={{
                      title: "Get Your Free Competitive Analysis",
                      subtitle:
                        "Discover how your competitors are capturing leads and get actionable insights to improve your strategy",
                      ctaText: "Get Free Analysis",
                    }}
                    theme={{ variant: "landing" }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Demo component for testing

// Export for Storybook and other uses
export { timelineData, signalSources };
export type { IntentifiedSignalSourcingPipelineProps };
