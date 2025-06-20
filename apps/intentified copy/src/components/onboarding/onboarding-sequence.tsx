"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Check,
  ChevronRight,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingForm } from "@/components/onboarding-form";
import SeoPipelineLayout from "@/features/pipelines/seo-digital-processing/_layout";
import WebsiteFormSection from "@/features/pipelines/seo-digital-processing/website-form";
import { WebsiteUrlInput } from "./website-url-input";
import { useActionState } from "react";

import { SEOScoreSection } from "@/features/pipelines/seo-digital-processing/seo-score";
import { WebVitalsSection } from "@/features/pipelines/seo-digital-processing/web-vitals";
import { AnalyzeWithAISection } from "@/features/pipelines/seo-digital-processing/analyze-with-ai";
import {
  OgImageSection,
  OgInfoFacts,
} from "@/features/pipelines/seo-digital-processing/og-images";
import { CompanyEnrichmentSection } from "@/features/pipelines/seo-digital-processing/company-enrichment-section";

import { combinedUrlActions } from "@/features/pipelines/seo-digital-processing/lib/actions";
import { evaluateAll } from "@/features/pipelines/seo-digital-processing/lib/seo";
import { AnimatePresence, motion } from "motion/react";
import { EnrichmentProgressDisplay } from "@/components/enrichment-progress";
import { useEnrichmentStream } from "@/hooks/use-enrichment-stream";
// import "./onboarding.css";
interface OnboardingSequenceProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  formData: {
    companyName: string;
    companySize: string;
    industry: string;
    website: string;
    socialLinks: {
      twitter: string;
      instagram: string;
      linkedin: string;
      facebook: string;
    };
    goals: string[];
    competitors: { name: string; url: string }[];

    keywords: string[];
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleGoalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  completeOnboarding: () => Promise<void>;
  loading: boolean;

  // New SEO-related props
  seoAnalysisState: {
    status: "idle" | "loading" | "success" | "error";
    results: any;
    error: string | null;
  };
  triggerSeoAnalysis: (url: string) => Promise<boolean>;
  // New handlers for digital intents
  handleCompetitorChange: (
    index: number,
    field: "name" | "url",
    value: string,
  ) => void;
  addCompetitor: () => void;
  removeCompetitor: (index: number) => void;
  handleSocialIntentChange: (index: number, value: string) => void;
  addSocialIntent: () => void;
  removeSocialIntent: (index: number) => void;
  handleKeywordIntentChange: (index: number, value: string) => void;
  addKeywordIntent: () => void;
  removeKeywordIntent: (index: number) => void;
  companyEnrichment: any;
  enrichmentStream: ReturnType<typeof useEnrichmentStream>;
}

export function OnboardingSequence({
  currentStep,
  setCurrentStep,
  companyEnrichment,
  formData,
  enrichmentStream,
  handleInputChange,
  handleGoalChange,
  completeOnboarding,
  loading,
  seoAnalysisState,
  triggerSeoAnalysis,
  handleCompetitorChange,
  addCompetitor,
  removeCompetitor,
  handleSocialIntentChange,
  addSocialIntent,
  removeSocialIntent,
  handleKeywordIntentChange,
  addKeywordIntent,
  removeKeywordIntent,
}: OnboardingSequenceProps) {
  console.log("🚀 ~ companyEnrichment:", companyEnrichment);

  console.log("🚀 ~ seoAnalysisState:", seoAnalysisState);

  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <TabsContent value="welcome">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Intentified</CardTitle>
              <CardDescription>
                We're excited to have you on board. Let's get to know you
                better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">What you'll be able to do:</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>
                      Track customer intent signals across all touchpoints
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>Convert more leads with AI-powered insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>
                      Optimize your marketing ROI with data-driven decisions
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-primary h-4 w-4" />
                    <span>
                      Streamline your customer journey from awareness to loyalty
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Your account details:</h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {user?.fullName || "Not provided"}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {user?.primaryEmailAddress?.emailAddress || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button onClick={() => setCurrentStep("company")}>
                Next Step <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </TabsContent>

      {/* Company Step */}
      <TabsContent value="company">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="text-black">
            <CardHeader className="text-black">
              <CardTitle>Tell us about your company</CardTitle>
              <CardDescription>
                This information helps us personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="company-name"
                    className="text-sm font-medium text-black"
                  >
                    Company Name
                  </label>
                  <input
                    id="company-name"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company-size" className="text-sm font-medium">
                    Company Size
                  </label>
                  <select
                    id="company-size"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    value={formData.companySize}
                    onChange={handleInputChange}
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </label>
                  <select
                    id="industry"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    value={formData.industry}
                    onChange={handleInputChange}
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("welcome")}
              >
                Previous
              </Button>
              <Button onClick={() => setCurrentStep("goals")}>
                Next Step <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </TabsContent>

      {/* Goals Step */}
      <TabsContent value="goals">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>What are your goals?</CardTitle>
              <CardDescription>
                Help us understand what you're looking to achieve
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Select your primary goals:</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="goal-1"
                      className="border-input bg-background mt-1 h-4 w-4 rounded border"
                      onChange={handleGoalChange}
                      checked={formData.goals.includes("1")}
                    />
                    <div>
                      <label htmlFor="goal-1" className="font-medium">
                        Increase lead conversion rates
                      </label>
                      <p className="text-muted-foreground text-sm">
                        Convert more website visitors and leads into customers
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="goal-2"
                      className="border-input bg-background mt-1 h-4 w-4 rounded border"
                      onChange={handleGoalChange}
                      checked={formData.goals.includes("2")}
                    />
                    <div>
                      <label htmlFor="goal-2" className="font-medium">
                        Reduce customer acquisition costs
                      </label>
                      <p className="text-muted-foreground text-sm">
                        Optimize marketing spend and improve ROI
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="goal-3"
                      className="border-input bg-background mt-1 h-4 w-4 rounded border"
                      onChange={handleGoalChange}
                      checked={formData.goals.includes("3")}
                    />
                    <div>
                      <label htmlFor="goal-3" className="font-medium">
                        Improve customer retention
                      </label>
                      <p className="text-muted-foreground text-sm">
                        Keep customers engaged and reduce churn
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="goal-4"
                      className="border-input bg-background mt-1 h-4 w-4 rounded border"
                      onChange={handleGoalChange}
                      checked={formData.goals.includes("4")}
                    />
                    <div>
                      <label htmlFor="goal-4" className="font-medium">
                        Enhance customer journey analytics
                      </label>
                      <p className="text-muted-foreground text-sm">
                        Get better insights into your customer's path to
                        purchase
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("company")}
              >
                Previous
              </Button>
              <Button onClick={() => setCurrentStep("digital")}>
                Next Step <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </TabsContent>

      {/* Digital Step - Website and Social Links */}
      <TabsContent value="digital">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Digital Presence</CardTitle>
              <CardDescription>
                Help us understand your online presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Website URL */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Company Website</h3>
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    Website URL
                  </label>
                  <WebsiteUrlInput
                    value={formData.website}
                    onChange={(url) =>
                      handleInputChange({
                        target: { id: "website", value: url },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    placeholder="https://example.com"
                    disabled={seoAnalysisState.status === "loading"}
                  />
                </div>
              </div>

              <Separator />

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Social Media Links</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="social-twitter"
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </label>
                    <input
                      id="social-twitter"
                      type="url"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      placeholder="https://twitter.com/yourcompany"
                      value={formData.socialLinks.twitter}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="social-instagram"
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </label>
                    <input
                      id="social-instagram"
                      type="url"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      placeholder="https://instagram.com/yourcompany"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="social-linkedin"
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </label>
                    <input
                      id="social-linkedin"
                      type="url"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={formData.socialLinks.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="social-facebook"
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </label>
                    <input
                      id="social-facebook"
                      type="url"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      placeholder="https://facebook.com/yourcompany"
                      value={formData.socialLinks.facebook}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  Social links are optional but help us analyze your complete
                  digital presence
                </p>
              </div>

              <Separator />

              {/* Competitors */}
              <div className="space-y-2">
                <h3 className="font-medium">Competitors</h3>
                <p className="text-muted-foreground text-sm">
                  Add your competitors' names and websites.
                </p>
                {formData.competitors.length === 0 ? (
                  <Button type="button" onClick={addCompetitor}>
                    Add First Competitor
                  </Button>
                ) : (
                  <>
                    {formData.competitors.map((competitor, idx) => (
                      <div
                        key={idx}
                        className="mb-2 flex flex-col gap-2 md:flex-row"
                      >
                        <input
                          type="text"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:w-1/3"
                          placeholder="Competitor Name (e.g., Acme Inc.)"
                          value={competitor.name}
                          onChange={(e) =>
                            handleCompetitorChange(idx, "name", e.target.value)
                          }
                        />
                        <input
                          type="url"
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:w-2/3"
                          placeholder="Competitor Website (e.g., https://acme.com)"
                          value={competitor.url}
                          onChange={(e) =>
                            handleCompetitorChange(idx, "url", e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeCompetitor(idx)}
                          disabled={formData.competitors.length === 1}
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="link"
                      className="px-0"
                      onClick={addCompetitor}
                      disabled={formData.competitors.length >= 10}
                    >
                      Add Another Competitor
                    </Button>
                  </>
                )}
              </div>

              <Separator />

              {/* 3. Keyword Intent */}
              <div className="space-y-2">
                <h3 className="font-medium">3. Keyword Intent</h3>
                <p className="text-muted-foreground text-sm">
                  Provide a list of 5–10 keywords or search phrases for your
                  service or product. Longer, more specific keywords help us
                  target more effectively (e.g., "used ford F150's near
                  minneapolis" vs. "Ford f150s").
                </p>
                {formData.keywords?.map((kw, idx) => (
                  <div key={idx} className="mb-2 flex gap-2">
                    <input
                      type="text"
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      placeholder="e.g., used ford F150's near minneapolis"
                      value={kw}
                      onChange={(e) =>
                        handleKeywordIntentChange(idx, e.target.value)
                      }
                    />
                    {formData.keywords?.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeKeywordIntent(idx)}
                      >
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={addKeywordIntent}
                  disabled={formData.keywords?.length >= 10}
                >
                  Add Another Keyword
                </Button>
              </div>
            </CardContent>

            {/* Show enrichment progress if analyzing */}
            {(enrichmentStream.isProcessing ||
              enrichmentStream.isConnected) && (
              <div className="px-6 pb-4">
                <EnrichmentProgressDisplay
                  progress={enrichmentStream.state.progress}
                  marketingProgress={enrichmentStream.state.marketingProgress}
                  status={enrichmentStream.state.status}
                  error={enrichmentStream.state.error}
                />
              </div>
            )}

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("goals")}>
                Previous
              </Button>
              <Button
                onClick={async () => {
                  if (formData.website && formData.website !== "https://") {
                    const success = await triggerSeoAnalysis(formData.website);
                    if (success) {
                      setCurrentStep("seo");
                    }
                  } else {
                    alert("Please enter a valid website URL");
                  }
                }}
                disabled={
                  !formData.website ||
                  formData.website === "https://" ||
                  seoAnalysisState.status === "loading" ||
                  enrichmentStream.isProcessing
                }
              >
                {seoAnalysisState.status === "loading" ||
                enrichmentStream.isProcessing
                  ? "Analyzing..."
                  : "Analyze Website"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </TabsContent>

      {/* SEO Digital Processing Step */}
      <TabsContent value="seo">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis Results</CardTitle>
              {formData.website && formData.website !== "https://" && (
                <CardDescription>
                  Analysis for: {formData.website}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {/* Show real-time enrichment progress */}
              {(enrichmentStream.isProcessing ||
                enrichmentStream.isConnected) && (
                <div className="mb-6">
                  <EnrichmentProgressDisplay
                    progress={enrichmentStream.state.progress}
                    marketingProgress={enrichmentStream.state.marketingProgress}
                    status={enrichmentStream.state.status}
                    error={enrichmentStream.state.error}
                  />
                </div>
              )}

              {/* Fallback loading state */}
              {seoAnalysisState.status === "loading" &&
                !enrichmentStream.isProcessing && (
                  <div className="flex items-center justify-center py-12">
                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                    <span className="ml-2">Analyzing your website...</span>
                  </div>
                )}

              {seoAnalysisState.status === "error" && (
                <div className="rounded-lg border border-red-500 p-4">
                  <p className="text-red-500">
                    Analysis failed: {seoAnalysisState.error}
                  </p>
                  <Button
                    onClick={() => triggerSeoAnalysis(formData.website)}
                    className="mt-2"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {seoAnalysisState.status === "success" &&
                seoAnalysisState.results && (
                  <div className="space-y-6">
                    {/* Company Intelligence */}
                    <CompanyEnrichmentSection
                      enrichmentData={
                        seoAnalysisState.results.companyEnrichment || {}
                      }
                    />

                    {/* SEO Analysis Results */}
                    {seoAnalysisState.results.seoFeedback && (
                      <SEOScoreSection
                        seoFeedback={seoAnalysisState.results.seoFeedback}
                      />
                    )}
                    {seoAnalysisState.results.rawWebVitals &&
                      seoAnalysisState.results.rawWebVitals.record &&
                      seoAnalysisState.results.rawWebVitals.record.metrics && (
                        <WebVitalsSection
                          vitals={seoAnalysisState.results.rawWebVitals}
                        />
                      )}
                    {seoAnalysisState.results.ogImageData && (
                      <OgImageSection
                        ogData={seoAnalysisState.results.ogImageData}
                      />
                    )}
                    <AnalyzeWithAISection seoData={seoAnalysisState.results} />
                  </div>
                )}

              {seoAnalysisState.status === "idle" && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Enter a website URL in the previous step to analyze its SEO
                    performance.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("digital")}
              >
                Back
              </Button>
              <Button onClick={completeOnboarding} disabled={loading}>
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </TabsContent>
    </>
  );
}
