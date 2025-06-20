"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Building, 
  Globe, 
  Target, 
  Wrench, 
  LineChart,
  Sparkles
} from "lucide-react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@repo/design-system/components/ui/select";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader 
} from "@repo/design-system/components/ui/card";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { Label } from "@repo/design-system/components/ui/label";
import { cn } from "@repo/design-system/lib/utils";

// Define the form data structure
interface FormData {
  businessType: string;
  websiteUrl: string;
  marketingGoals: string[];
  currentTools: string[];
  expectedOutcomes: string;
}

// Define the props for the component
interface AIFunnelFormProps {
  onComplete?: (data: FormData) => void;
  className?: string;
}

const MARKETING_GOALS = [
  "Increase website traffic",
  "Improve conversion rates",
  "Generate more leads",
  "Enhance brand awareness",
  "Optimize ad spend",
  "Better understand customer intent",
  "Improve SEO performance"
];

const MARKETING_TOOLS = [
  "Google Analytics",
  "Google Ads",
  "Facebook Ads",
  "HubSpot",
  "Mailchimp",
  "SEMrush",
  "Ahrefs",
  "Other CRM tools",
  "Social media management tools"
];

const BUSINESS_TYPES = [
  "E-commerce",
  "SaaS",
  "Agency",
  "B2B Service",
  "B2C Service",
  "Media & Publishing",
  "Education",
  "Healthcare",
  "Non-profit",
  "Other"
];

export function AIFunnelForm({ onComplete, className }: AIFunnelFormProps) {
  // State for current step and form data
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessType: "",
    websiteUrl: "",
    marketingGoals: [],
    currentTools: [],
    expectedOutcomes: ""
  });
  const [isComplete, setIsComplete] = useState(false);

  // Function to handle form submission
  const handleSubmit = () => {
    setIsComplete(true);
    if (onComplete) {
      onComplete(formData);
    }
  };

  // Function to handle next step
  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  // Function to handle previous step
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to update form data
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Function to toggle checkbox values in arrays
  const toggleArrayValue = (field: "marketingGoals" | "currentTools", value: string) => {
    const currentArray = formData[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFormData(field, newArray);
  };

  // Check if the current step is valid to enable the next button
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.businessType !== "";
      case 2:
        return formData.websiteUrl !== "";
      case 3:
        return formData.marketingGoals.length > 0;
      case 4:
        return formData.currentTools.length > 0;
      case 5:
        return formData.expectedOutcomes.trim() !== "";
      default:
        return false;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Get step icon
  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <Building className="h-5 w-5" />;
      case 2:
        return <Globe className="h-5 w-5" />;
      case 3:
        return <Target className="h-5 w-5" />;
      case 4:
        return <Wrench className="h-5 w-5" />;
      case 5:
        return <LineChart className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Get step title
  const getStepTitle = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return "What type of business are you in?";
      case 2:
        return "What's your website URL?";
      case 3:
        return "What are your main marketing goals?";
      case 4:
        return "Which marketing tools do you currently use?";
      case 5:
        return "What outcomes do you expect from our platform?";
      default:
        return "";
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4", className)}>
      <Card className="overflow-hidden border-none bg-white/10 backdrop-blur-lg shadow-xl dark:bg-black/20">
        <CardHeader className="relative pb-0">
          {/* Progress indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <motion.div
                key={s}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors duration-300",
                  s === step ? "bg-primary" : 
                  s < step ? "bg-primary/70" : "bg-muted"
                )}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: s === step ? 1.2 : 1,
                  transition: { duration: 0.3 }
                }}
              />
            ))}
          </div>

          {/* AI assistant header */}
          <div className="flex items-center gap-3 mb-6 mt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Intentified AI Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Let's set up your intent tracking
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isComplete ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-8 text-center"
            >
              <motion.div 
                variants={itemVariants}
                className="flex justify-center mb-4"
              >
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
              </motion.div>
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-semibold mb-2"
              >
                All set! Your profile is complete
              </motion.h3>
              <motion.p 
                variants={itemVariants}
                className="text-muted-foreground mb-6"
              >
                We're preparing your personalized intent tracking dashboard.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="min-h-[320px]"
              >
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getStepIcon(step)}
                  </div>
                  <h3 className="text-xl font-medium">
                    {getStepTitle(step)}
                  </h3>
                </motion.div>

                {/* Step 1: Business Type */}
                {step === 1 && (
                  <motion.div variants={itemVariants}>
                    <p className="text-muted-foreground mb-4">
                      This helps us tailor our recommendations to your industry.
                    </p>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => updateFormData("businessType", value)}
                    >
                      <SelectTrigger className="w-full bg-white/5 backdrop-blur-sm border-muted">
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}

                {/* Step 2: Website URL */}
                {step === 2 && (
                  <motion.div variants={itemVariants}>
                    <p className="text-muted-foreground mb-4">
                      We'll analyze your website to identify intent signals and optimization opportunities.
                    </p>
                    <Input
                      type="url"
                      placeholder="https://your-website.com"
                      value={formData.websiteUrl}
                      onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                      className="bg-white/5 backdrop-blur-sm border-muted"
                    />
                  </motion.div>
                )}

                {/* Step 3: Marketing Goals */}
                {step === 3 && (
                  <motion.div variants={itemVariants} className="space-y-3">
                    <p className="text-muted-foreground mb-4">
                      Select all that apply to your business. This helps us prioritize features for you.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MARKETING_GOALS.map((goal) => (
                        <div key={goal} className="flex items-start space-x-2">
                          <Checkbox
                            id={`goal-${goal}`}
                            checked={formData.marketingGoals.includes(goal)}
                            onCheckedChange={() => toggleArrayValue("marketingGoals", goal)}
                          />
                          <Label
                            htmlFor={`goal-${goal}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Current Tools */}
                {step === 4 && (
                  <motion.div variants={itemVariants} className="space-y-3">
                    <p className="text-muted-foreground mb-4">
                      Select the marketing tools you currently use. We'll show you how to integrate them.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MARKETING_TOOLS.map((tool) => (
                        <div key={tool} className="flex items-start space-x-2">
                          <Checkbox
                            id={`tool-${tool}`}
                            checked={formData.currentTools.includes(tool)}
                            onCheckedChange={() => toggleArrayValue("currentTools", tool)}
                          />
                          <Label
                            htmlFor={`tool-${tool}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {tool}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Expected Outcomes */}
                {step === 5 && (
                  <motion.div variants={itemVariants}>
                    <p className="text-muted-foreground mb-4">
                      What specific outcomes are you hoping to achieve with our platform?
                    </p>
                    <Textarea
                      placeholder="I want to increase conversions by understanding customer intent better..."
                      value={formData.expectedOutcomes}
                      onChange={(e) => updateFormData("expectedOutcomes", e.target.value)}
                      className="min-h-[120px] bg-white/5 backdrop-blur-sm border-muted"
                    />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>

        {!isComplete && (
          <CardFooter className="flex justify-between pt-2 pb-6">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={step === 1}
              className={cn(
                "gap-1",
                step === 1 && "opacity-0 pointer-events-none"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-1"
            >
              {step === 5 ? "Complete" : "Next"}
              {step !== 5 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
