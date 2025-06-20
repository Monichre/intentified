"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompetitorAnalysisStream } from "@/hooks/use-competitor-analysis-stream";
import type { CompetitorAnalysisResponse } from "@/app/actions/stream-competitor-analysis";
import "./ai-onboarding.css";
export type { CompetitorAnalysisResponse };

interface FormData {
  name: string;
  email: string;
  companyName: string;
}

interface CompetitorAnalysisFlowProps {
  onComplete?: (analysis: CompetitorAnalysisResponse) => void;
  className?: string;
}

export function CompetitorAnalysisFlow({
  onComplete,
  className = "",
}: CompetitorAnalysisFlowProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    companyName: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitiveAnalysis, setCompetitiveAnalysis] =
    useState<CompetitorAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const competitorStream = useCompetitorAnalysisStream();

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }

      setIsAnalyzing(true);
      setError(null);
      setCompetitiveAnalysis(null);
      
      // Auto-generate website URL from company name
      const websiteUrl = `https://${formData.companyName.toLowerCase().replace(/\s+/g, '')}.com`;
      
      try {
        await competitorStream.connect({
          websiteUrl,
          companyName: formData.companyName,
          industry: "", // Not needed anymore
          focusAreas: ["market-position", "strengths", "opportunities"],
          skipScreenshot: false,
          userInfo: {
            name: formData.name,
            email: formData.email,
          },
          onProgress: (progress) => {
            console.log("Analysis progress:", progress);
          },
          onComplete: (response) => {
            console.log("🚀 ~ response:", response);
            setIsAnalyzing(false);
            setCompetitiveAnalysis(response);
            onComplete?.(response);
          },
          onError: (err) => {
            setIsAnalyzing(false);
            setError(err || "Analysis failed");
          },
        });
      } catch (err: any) {
        setIsAnalyzing(false);
        setError(err?.message || "Analysis failed");
      }
    },
    [formData, competitorStream, onComplete],
  );

  // Result screen UI with colorized sections
  const renderResultScreen = () => {
    if (!competitiveAnalysis) return null;
    const { company, competitiveLandscape, insights, summary } =
      competitiveAnalysis;
    
    const sections = [
      { label: "Company", value: company?.name || "-", color: "bg-blue-500/20 border-blue-500/30" },
      { label: "Summary", value: company?.summary || "-", color: "bg-green-500/20 border-green-500/30" },
      { label: "Market Position", value: company?.positioning || "-", color: "bg-purple-500/20 border-purple-500/30" },
      { label: "Key Opportunities", value: competitiveLandscape?.opportunities?.join(", ") || "-", color: "bg-orange-500/20 border-orange-500/30" },
      { label: "Competitive Advantages", value: insights?.differentiators?.join(", ") || "-", color: "bg-teal-500/20 border-teal-500/30" },
      { label: "Analysis Summary", value: `${summary?.totalAnalyzed ?? 0} competitors analyzed`, color: "bg-gray-500/20 border-gray-500/30" },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
      >
        <h2 className="mb-2 text-2xl font-bold">🎉 Your Report is Ready!</h2>
        <p className="text-muted-foreground mb-6">
          Here's your competitive analysis for {formData.companyName}:
        </p>
        <div className="mx-auto mb-6 w-full max-w-2xl space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-lg border p-4 text-left ${section.color}`}
            >
              <div className="font-semibold text-white mb-2">{section.label}</div>
              <div className="text-white/80">{section.value}</div>
            </motion.div>
          ))}
        </div>
        <Button
          onClick={() => {
            setCompetitiveAnalysis(null);
            setFormData({ name: "", email: "", companyName: "" });
            setFormErrors({});
          }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Analyze Another Company
        </Button>
      </motion.div>
    );
  };

  // Error screen UI
  const renderErrorScreen = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
    >
      <h2 className="mb-2 text-2xl font-bold text-red-500">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button
        onClick={() => setError(null)}
        variant="outline"
        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
      >
        Try Again
      </Button>
    </motion.div>
  );

  // Simple form UI
  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[400px] flex-col justify-center p-8"
    >
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">We'll make you a deal</h2>
          <p className="text-muted-foreground">
            Give us your business email, we'll give you a piping hot competitive analysis report you can keep.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            No spam, no commitments.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">What should we call you?</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name"
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && (
              <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Business Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="you@yourcompany.com"
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Your company name"
              className={formErrors.companyName ? "border-red-500" : ""}
            />
            {formErrors.companyName && (
              <p className="text-red-400 text-sm mt-1">{formErrors.companyName}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={isAnalyzing}
          >
            Get My Free Competitive Analysis
          </Button>
        </form>
      </div>
    </motion.div>
  );

  return (
    <div id="ai-competitor-analysis-container" className={className}>
      {isAnalyzing ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
        >
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 border-b-purple-500"></div>
          <p className="text-lg text-white/80 mb-4">
            {competitorStream.state.progress?.message ||
              "Analyzing competitor landscape..."}
          </p>
          {competitorStream.state.progress && (
            <div className="w-full max-w-md">
              <div className="mb-2 flex justify-between text-sm text-white/60">
                <span>
                  Step {competitorStream.state.progress.currentStep} of{" "}
                  {competitorStream.state.progress.totalSteps}
                </span>
                <span>
                  {Math.round(
                    (competitorStream.state.progress.currentStep /
                      competitorStream.state.progress.totalSteps) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${(competitorStream.state.progress.currentStep / competitorStream.state.progress.totalSteps) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>
      ) : error ? (
        renderErrorScreen()
      ) : competitiveAnalysis ? (
        renderResultScreen()
      ) : (
        renderForm()
      )}
    </div>
  );
}
