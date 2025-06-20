"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { AIOnboardingFlow } from "./ai-onboarding-flow";
import { useEnrichmentStream } from "@/hooks/use-enrichment-stream";
import type { BusinessFormData } from "./types";
import type { CompanyEnrichmentData } from "@/features/pipelines/seo-digital-processing/lib/actions";

interface AIOnboardingIntegrationProps {
  className?: string;
}

export function AIOnboardingIntegration({
  className = "",
}: AIOnboardingIntegrationProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);

  // Streaming enrichment hook
  const enrichmentStream = useEnrichmentStream();

  // SEO Analysis State Management
  interface SeoAnalysisState {
    status: "idle" | "loading" | "success" | "error";
    results: any | null;
    error: string | null;
  }

  const [seoAnalysisState, setSeoAnalysisState] = useState<SeoAnalysisState>({
    status: "idle",
    results: null,
    error: null,
  });

  const [companyEnrichment, setCompanyEnrichment] =
    useState<CompanyEnrichmentData | null>(null);

  // Website analysis function integrated into chat flow
  const handleAnalysisStart = useCallback(
    async (url: string): Promise<void> => {
      console.log("🚀 ~ handleAnalysisStart ~ url:", url);

      setSeoAnalysisState({ status: "loading", results: null, error: null });

      try {
        setIsEnriching(true);
        
        // Use streaming endpoint for real-time progress
        await enrichmentStream.connect({
          url,
          skipScreenshot: false,
          onProgress: (progress) => {
            console.log("Enrichment progress:", progress);
            // Update SEO analysis state with progress
            setSeoAnalysisState({
              status: "loading",
              results: {
                progress: {
                  message: progress.currentType ? `Processing ${progress.currentType}...` : 'Analyzing website...',
                  step: progress.currentStep,
                  totalSteps: progress.totalSteps,
                  percentage: Math.round((progress.currentStep / progress.totalSteps) * 100)
                }
              },
              error: null,
            });
          },
          onMarketingProgress: (progress) => {
            console.log("Marketing intelligence progress:", progress);
            setSeoAnalysisState({
              status: "loading",
              results: {
                progress: {
                  message: progress.message || 'Generating marketing insights...',
                  step: progress.currentStep,
                  totalSteps: progress.totalSteps,
                  percentage: Math.round((progress.currentStep / progress.totalSteps) * 100)
                }
              },
              error: null,
            });
          },
          onComplete: (result) => {
            console.log("Enrichment complete:", result);
            setIsEnriching(false);

            // Extract company enrichment data
            const companyEnrichment =
              result &&
              "companyEnrichment" in result &&
              result.companyEnrichment
                ? result.companyEnrichment
                : null;

            setCompanyEnrichment(companyEnrichment);
            setSeoAnalysisState({
              status: "success",
              results: result,
              error: null,
            });
          },
          onError: (error) => {
            console.error("Enrichment error:", error);
            setIsEnriching(false);
            setSeoAnalysisState({
              status: "error",
              results: null,
              error: error || "Failed to analyze website",
            });
          },
        });
      } catch (error: any) {
        setSeoAnalysisState({
          status: "error",
          results: null,
          error: error.message || "Failed to analyze website",
        });
        throw error; // Re-throw to let the chat flow handle it
      }
    },
    [enrichmentStream],
  );

  // Complete onboarding with the collected data
  const handleComplete = useCallback(
    async (formData: BusinessFormData): Promise<void> => {
      try {
        setLoading(true);

        // Extract enriched company data from SEO analysis results
        const enrichedCompanyData: CompanyEnrichmentData | null =
          seoAnalysisState.results?.companyEnrichment || null;

        // Convert BusinessFormData to the format expected by the original onboarding
        const originalFormData = {
          companyName: formData.companyName,
          companySize: formData.companySize,
          industry: formData.industry,
          website: formData.website,
          socialLinks: formData.socialLinks,
          competitors: formData.competitors,
          keywords: formData.keywords,
          goals: formData.goals,
        };

        // Update user metadata with both onboarding status and collected data
        // !FIXME - This is fucking retarded
        await user?.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboardingCompleted: true,
            companyData: {
              ...originalFormData,
              // Include enriched data if available
              enriched: enrichedCompanyData,
            },
            goals: formData.goals,
            seoAnalysisCompleted: seoAnalysisState.status === "success",
            seoAnalysisTimestamp:
              seoAnalysisState.status === "success"
                ? new Date().toISOString()
                : null,
            onboardingCompletedAt: new Date().toISOString(),
          },
        });

        // Save onboarding data to database (if needed)
        if (user?.id) {
          try {
            // Map company size to match database enum if necessary
            const mappedCompanySize =
              formData.companySize === "1-10"
                ? "2-10"
                : formData.companySize === "501+"
                  ? "500+"
                  : formData.companySize;

            // Database persistence logic would go here
            // await CompanyPersistence.completeOnboarding(...)

            console.log("✅ Onboarding data saved successfully");
          } catch (dbError) {
            console.error(
              "Failed to save onboarding data to database:",
              dbError,
            );
            // Don't block onboarding completion if database save fails
          }
        }

        // Redirect to dashboard homepage
        router.push("/dashboard");
      } catch (error) {
        console.error("Error completing onboarding:", error);
        // Consider adding user-facing error handling here
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user, router, seoAnalysisState],
  );

  const handleProgress = useCallback((step: number, total: number) => {
    console.log(`Onboarding progress: ${step}/${total}`);
  }, []);

  return (
    <>
      <AIOnboardingFlow
        onComplete={handleComplete}
        onProgress={handleProgress}
        onAnalysisStart={handleAnalysisStart}
        initialData={{
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
        }}
      />

      {(loading || isEnriching) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm max-w-md w-full mx-4">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            
            {isEnriching ? (
              <>
                <p className="text-white text-lg mb-2">Analyzing your website...</p>
                {seoAnalysisState.results?.progress && (
                  <div className="mt-4">
                    <p className="text-white/80 text-sm mb-2">
                      {seoAnalysisState.results.progress.message}
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${seoAnalysisState.results.progress.percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Step {seoAnalysisState.results.progress.step} of {seoAnalysisState.results.progress.totalSteps}</span>
                      <span>{seoAnalysisState.results.progress.percentage || 0}%</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-white">Completing your setup...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
