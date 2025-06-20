import {
  validateCompanyName,
  validateCompanySize,
  validateGoals,
  validateIndustry,
  validateKeywords,
  validateWebsite,
} from "@/app/dashboard/onboarding/components/validators/business-validators";
import type { OnboardingStep } from "@/components/ai-form-flow/types";

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    type: "simple",
    field: "companyName",
    question:
      "Hi! Welcome to Intentified. Let's start with the basics - what's your company name?",
    placeholder: "Enter your company name (e.g., Acme Inc.)",
    validate: validateCompanyName,
  },
  {
    id: 2,
    type: "select",
    field: "companySize",
    question: "Great! How many people work at {companyName}?",
    options: [
      {
        value: "1-10",
        label: "1-10 employees",
        description: "Small team or startup",
      },
      {
        value: "11-50",
        label: "11-50 employees",
        description: "Growing company",
      },
      {
        value: "51-200",
        label: "51-200 employees",
        description: "Medium-sized business",
      },
      {
        value: "201-500",
        label: "201-500 employees",
        description: "Large company",
      },
      { value: "501+", label: "501+ employees", description: "Enterprise" },
    ],
    validate: validateCompanySize,
  },
  {
    id: 3,
    type: "select",
    field: "industry",
    question: "What industry does {companyName} operate in?",
    options: [
      {
        value: "technology",
        label: "Technology",
        description: "Software, hardware, IT services",
      },
      {
        value: "ecommerce",
        label: "E-commerce",
        description: "Online retail and marketplace",
      },
      {
        value: "healthcare",
        label: "Healthcare",
        description: "Medical, pharmaceutical, wellness",
      },
      {
        value: "finance",
        label: "Finance",
        description: "Banking, fintech, insurance",
      },
      {
        value: "education",
        label: "Education",
        description: "Schools, training, e-learning",
      },
      {
        value: "manufacturing",
        label: "Manufacturing",
        description: "Production and industrial",
      },
      {
        value: "retail",
        label: "Retail",
        description: "Physical stores and merchandise",
      },
      { value: "other", label: "Other", description: "Something else" },
    ],
    validate: validateIndustry,
  },
  {
    id: 4,
    type: "multi-select",
    field: "goals",
    question:
      "What are your main goals with Intentified? (You can select multiple)",
    options: [
      {
        value: "1",
        label: "Increase lead conversion rates",
        description: "Convert more visitors into customers",
      },
      {
        value: "2",
        label: "Reduce customer acquisition costs",
        description: "Optimize marketing spend and improve ROI",
      },
      {
        value: "3",
        label: "Improve customer retention",
        description: "Keep customers engaged and reduce churn",
      },
      {
        value: "4",
        label: "Enhance customer journey analytics",
        description: "Better insights into purchase paths",
      },
    ],
    validate: validateGoals,
  },
  {
    id: 5,
    type: "url",
    field: "website",
    question:
      "What's your company website? I'll analyze it to better understand your business.",
    placeholder: "https://yourcompany.com",
    inputType: "url",
    validate: validateWebsite,
  },
  {
    id: 6,
    type: "social-links",
    field: "socialLinks",
    question:
      "Do you have any social media profiles you'd like me to analyze? (Optional but helpful for a complete picture)",
    placeholder: "Enter social media URLs",
  },
  {
    id: 7,
    type: "array",
    field: "competitors",
    question:
      "Who are your main competitors? This helps me understand your market position.",
    placeholder: "Enter competitor names and websites",
  },
  {
    id: 8,
    type: "array",
    field: "keywords",
    question:
      "What keywords do people use to find your products or services? (Be specific - longer phrases work better)",
    placeholder: "e.g., 'used ford F150s near Minneapolis'",
    validate: validateKeywords,
  },
];
