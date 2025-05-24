import { z } from "zod"

export const profileFormSchema = z.object({
  fullName: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().min(10),
  skills: z.string().optional(),
})

export const enrichedProfileSchema = z.object({
  suggestedTags: z.array(z.string()),
  categoryMatch: z.string(),
  skillLevel: z.string(),
  careerSuggestions: z.array(z.string()),
})

export const fewShotExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
})

export const promptFormSchema = z.object({
  systemPrompt: z.string().min(1, "System prompt is required"),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    }),
  ),
  testInput: z.string().min(1, "Test input is required"),
  evaluation: z.boolean().optional(),
  output: z.string().optional(),
})

export const evaluationResultSchema = z.object({
  analysis: z.object({
    consistency: z.number().min(0).max(100),
    relevance: z.number().min(0).max(100),
    quality: z.number().min(0).max(100),
    feedback: z.string(),
  }),
})

export const analysisSchema = z.object({
  analysis: z.object({
    consistency: z.number().min(0).max(100),
    relevance: z.number().min(0).max(100),
    quality: z.number().min(0).max(100),
    feedback: z.string(),
  }),
  generatedOutput: z.string(),
})

export type AnalysisResult = z.infer<typeof analysisSchema>

export const defaultExamples = {
  extraction: {
    systemPrompt:
      "You are an expert data extractor. Extract the specified information from the text and format it as a JSON object with the exact keys mentioned in the examples.",
    examples: [
      {
        input:
          "Contact Sarah Johnson at sarah.j@email.com or call her at (555) 123-4567. She is the Senior Marketing Director at TechCorp Inc.",
        output: `{
  "name": "Sarah Johnson",
  "email": "sarah.j@email.com",
  "phone": "(555) 123-4567",
  "title": "Senior Marketing Director",
  "company": "TechCorp Inc"
}`,
      },
      {
        input: "For support, reach out to Alex Chen (Technical Lead) at alex.chen@company.io or 888-999-0000",
        output: `{
  "name": "Alex Chen",
  "email": "alex.chen@company.io",
  "phone": "888-999-0000",
  "title": "Technical Lead",
  "company": null
}`,
      },
    ],
  },
  classification: {
    systemPrompt:
      "You are an expert customer support ticket classifier. Analyze the customer message and classify it into one of these categories: BILLING, TECHNICAL, ACCOUNT, PRODUCT, or GENERAL. Also provide the priority level (LOW, MEDIUM, HIGH, URGENT) based on the urgency and impact.",
    examples: [
      {
        input:
          "I can't log into my account and I have an important presentation in 30 minutes! None of the password reset emails are coming through.",
        output: `{
  "category": "ACCOUNT",
  "priority": "URGENT",
  "reason": "Login issue preventing work, time-sensitive situation"
}`,
      },
      {
        input: "Hi, I was wondering if you offer student discounts on your premium plan?",
        output: `{
  "category": "BILLING",
  "priority": "LOW",
  "reason": "General pricing inquiry, no immediate impact"
}`,
      },
      {
        input: "The API is returning 500 errors for all our production requests. Our service is down!",
        output: `{
  "category": "TECHNICAL",
  "priority": "URGENT",
  "reason": "Production system down, severe business impact"
}`,
      },
    ],
  },
  summarization: {
    systemPrompt:
      "You are an expert content summarizer. Create a concise 2-3 sentence summary of the given text, focusing on the key points and maintaining the original tone. Include one key action item or takeaway when relevant.",
    examples: [
      {
        input:
          "During today's quarterly meeting, we discussed Q3 results showing a 25% revenue increase YoY, primarily driven by the launch of our new mobile app. Customer acquisition costs decreased by 15%, but we're seeing higher churn in the enterprise segment. The team proposed allocating additional resources to enterprise customer success and developing new retention strategies. We also approved the budget for expanding our data science team in Q4.",
        output:
          "Q3 showed strong performance with 25% YoY revenue growth due to the new mobile app launch, despite increased enterprise customer churn. The team plans to focus on enterprise retention and customer success initiatives. Key Action: Proceed with data science team expansion in Q4 to support these initiatives.",
      },
      {
        input:
          "The latest security audit revealed three medium-severity vulnerabilities in our authentication system. Two are related to session management, and one involves input validation. While no active exploits have been detected, the audit recommends implementing fixes within the next two weeks. The development team has already created tickets for these issues and estimates 3-4 days for the fixes.",
        output:
          "Security audit identified three medium-severity vulnerabilities in the authentication system, primarily affecting session management and input validation. While no active exploits exist, fixes are recommended within two weeks. Key Action: Prioritize development team's 3-4 day fix implementation within the recommended timeline.",
      },
    ],
  },
}
