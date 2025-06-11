/**
 * Comprehensive List of AI Prompts for Marketing Intelligence
 * Based on NewCopy.ai analysis and brand analysis enrichment
 */

// Brand Intelligence Prompts
export const BRAND_EXTRACTION_PROMPTS = {
  websiteAnalysis: `Extract and analyze all brand attributes from the provided website URL, focusing on voice, tone, messaging patterns, visual identity, target audience characteristics, and value propositions.`,
  
  brandVoice: `Identify the brand's voice characteristics from the extracted content, categorizing as formal/informal, technical/conversational, serious/humorous, and passionate/matter-of-fact.`,
  
  brandAttributes: `Categorize the extracted brand attributes into Product Overview, Product Strategy, Brand Identity, and Core Value Proposition sections.`,
  
  consistencyEvaluation: `Evaluate the consistency of brand messaging across different website sections and identify any contradictions or variations in tone.`,
  
  brandRefinement: `Based on user feedback, refine the extracted brand attributes to better align with the brand owner's perception of their identity.`
} as const;

export const BRAND_SETTINGS_PROMPTS = {
  profileCompletion: `Identify missing or incomplete brand attributes and suggest values based on existing information and industry norms.`,
  
  attributeWeighting: `Analyze the relative importance of different brand attributes for content generation and suggest appropriate weighting values.`,
  
  brandEvolution: `Based on industry trends and competitive analysis, suggest potential brand attribute adjustments to improve market positioning.`,
  
  consistencyCheck: `Compare newly edited brand attributes against the overall brand profile and flag potential inconsistencies or contradictions.`
} as const;

// Content Generation Prompts
export const CONTENT_GENERATION_PROMPTS = {
  brandAligned: `Generate {contentType} that embodies the brand's voice and tone while incorporating key messaging points about {topic}, optimized for {targetAudience}.`,
  
  productDescription: `Create a product description for {productName} that highlights its unique value proposition, maintains the brand's voice, and incorporates key features and benefits.`,
  
  adCopyVariation: `Generate 3 variations of ad copy for {campaignPurpose} that maintain consistent brand messaging while testing different approaches to the call-to-action.`,
  
  emailContent: `Create an email {type} for {campaignPurpose} that aligns with the brand voice, resonates with {targetAudience}, and drives {desiredAction}.`,
  
  valueProposition: `Reformulate the brand's core value proposition into compelling messaging for {specificContext}, emphasizing {keyBenefit} for {targetAudience}.`
} as const;

export const COPY_BLOCK_PROMPTS = {
  uiElement: `Generate copy for {uiElementType} that communicates {function} clearly and concisely while maintaining brand voice.`,
  
  buttonText: `Create 5 variations of button text for {action} that maximize click-through potential while maintaining clarity and brand alignment.`,
  
  formGuidance: `Generate user-friendly placeholder and help text for {formField} that guides users while maintaining the brand's tone.`,
  
  errorMessage: `Rewrite technical error message '{errorMessage}' to be more user-friendly and aligned with the brand's voice.`,
  
  confirmationMessage: `Create a confirmation message for {actionCompletion} that reinforces the brand relationship and suggests next steps.`
} as const;

// SEO & Content Optimization Prompts
export const SEO_PROMPTS = {
  landingPageAnalysis: `Analyze the provided landing page content and structure, identifying opportunities to improve conversion potential while maintaining brand alignment.`,
  
  headlineOptimization: `Generate 5 alternative headlines for {landingPage} that improve clarity, engagement, and conversion potential while maintaining brand voice.`,
  
  benefitsSection: `Rewrite the benefits section to more clearly articulate value to the customer, using the brand's voice and focusing on {keyValuePropositions}.`,
  
  ctaEnhancement: `Generate 3 variations of the primary call-to-action that create greater urgency and clarity while maintaining brand tone.`,
  
  socialProofIntegration: `Create templated copy for integrating customer testimonials that reinforces {keyMessage} and builds credibility.`
} as const;

export const BLOG_PROMPTS = {
  topicIdentification: `Based on {industry} and {targetKeywords}, identify 10 high-potential blog topics that align with the brand's expertise and audience interests.`,
  
  blogStructure: `Create a detailed outline for a blog post on {topic} that incorporates {targetKeywords}, addresses user intent, and maintains the brand's voice and expertise positioning.`,
  
  seoTitleOptimization: `Generate 5 SEO-optimized title options for {blogTopic} that incorporate {targetKeyword}, create reader interest, and align with the brand's voice.`,
  
  metaDescription: `Create an engaging meta description for {blogPost} that incorporates {targetKeyword}, communicates value, and encourages clicks within 155 characters.`,
  
  contentGapAnalysis: `Analyze the top-ranking content for {targetKeyword} and identify information gaps that our content can uniquely address from our brand's perspective.`
} as const;

// Social Media Automation Prompts
export const SOCIAL_MEDIA_PROMPTS = {
  platformSpecific: `Create a {platform} post about {topic} that aligns with our brand voice, optimizes for the platform's best practices, and drives {engagementGoal}.`,
  
  campaignAdaptation: `Adapt the core campaign message '{message}' into platform-optimized content for {platforms}, maintaining consistent messaging while leveraging each platform's unique features.`,
  
  hashtagResearch: `Identify 5-7 relevant and trending hashtags for content about {topic} that will extend reach while remaining appropriate for our brand positioning.`,
  
  engagementQuestion: `Generate 3 engaging questions related to {topic} that align with our brand voice and will stimulate meaningful conversation with our {platform} audience.`,
  
  visualContentSuggestion: `Based on the post copy about {topic}, suggest appropriate visual content approaches that will enhance message impact and brand recognition.`
} as const;

// Analytics and Optimization Prompts
export const ANALYTICS_PROMPTS = {
  performanceInsight: `Analyze the performance data for {contentPiece} and identify key patterns, unexpected outcomes, and actionable insights.`,
  
  underperformanceAnalysis: `Examine {contentPiece} that performed below expectations and identify potential factors in messaging, timing, audience targeting, or external factors.`,
  
  successPatternIdentification: `Analyze our top-performing content across {platforms} and identify common elements that contribute to above-average engagement.`,
  
  competitiveBenchmark: `Compare our content performance metrics for {contentType} against industry benchmarks and identify areas for improvement.`,
  
  trendIdentification: `Analyze performance data over {timePeriod} to identify emerging trends in audience preferences, engagement patterns, and content effectiveness.`
} as const;

// Brand Strategy Consultation Prompts
export const BRAND_STRATEGY_PROMPTS = {
  brandPositioning: `Based on the provided information about {company} and {targetMarket}, recommend positioning approaches that differentiate from competitors and resonate with the target audience.`,
  
  brandVoiceDevelopment: `Guide the development of a distinctive brand voice for {company} that aligns with their values, audience expectations, and market positioning.`,
  
  valuePropositionRefinement: `Analyze the current value proposition and suggest refinements that more clearly communicate unique benefits to {targetAudience}.`,
  
  brandEvolutionStrategy: `Assess the current brand positioning in the context of {marketChanges} and recommend strategic adjustments to maintain relevance and competitive advantage.`,
  
  brandConsistencyFramework: `Develop guidelines for maintaining brand consistency across {channels} while allowing appropriate flexibility for channel-specific requirements.`
} as const;

// Quality Assurance Prompts
export const QUALITY_ASSURANCE_PROMPTS = {
  brandAlignment: `Evaluate the generated content against the brand profile and score alignment across voice, tone, messaging, and value proposition dimensions.`,
  
  grammarStyleCheck: `Analyze the text for grammatical accuracy, readability, and stylistic consistency, flagging any issues that require attention.`,
  
  engagementPotential: `Assess the likely engagement potential of the content based on clarity, interest generation, emotional impact, and call-to-action effectiveness.`,
  
  originalityVerification: `Evaluate the content for originality and uniqueness, identifying any sections that closely resemble existing content.`,
  
  audienceRelevance: `Analyze how well the content addresses the needs, interests, and pain points of the specified target audience.`
} as const;

// Technical Implementation Prompts
export const TECHNICAL_PROMPTS = {
  brandVoiceTraining: `Fine-tune the language model to recognize and reproduce the distinctive elements of {brand}'s voice, including {specificCharacteristics}.`,
  
  domainSpecificTraining: `Enhance the model's knowledge and generation capabilities for the {industry} vertical, focusing on terminology, common concepts, and audience expectations.`,
  
  contentTypeSpecialization: `Optimize model performance for generating {contentType} by training on high-quality examples that demonstrate effective structure, tone, and persuasive elements.`,
  
  promptTemplateDesign: `Create a standardized prompt template for {useCase} that ensures consistent inclusion of brand context, user requirements, and generation parameters.`,
  
  instructionOptimization: `Refine instructions for {specificTask} to improve clarity, reduce ambiguity, and guide the model toward desired output characteristics.`
} as const;

// User Experience Prompts
export const UX_PROMPTS = {
  featureIntroduction: `Create user-friendly explanations of {feature} that communicate its value, basic usage, and relationship to the user's goals.`,
  
  contextualHelp: `Generate helpful guidance for users encountering {specificSituation}, providing clear next steps and explanations.`,
  
  queryInterpretation: `Interpret the user's request for {userInput} to identify their underlying goal, required information, and appropriate response format.`,
  
  clarificationQuestion: `Generate appropriate clarifying questions when user inputs are ambiguous or insufficient to provide the best response.`,
  
  personalizedResponse: `Craft responses to user questions about {topic} that reflect their usage history, preferences, and current context.`
} as const;

// Prompt Template Types
export type PromptTemplate = {
  readonly [key: string]: string;
};

export type PromptVariables = Record<string, string | string[]>;

// Utility function to format prompts with variables
export function formatPrompt(template: string, variables: PromptVariables): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value || match;
  });
}

// Export all prompt categories
export const ALL_PROMPTS = {
  brandExtraction: BRAND_EXTRACTION_PROMPTS,
  brandSettings: BRAND_SETTINGS_PROMPTS,
  contentGeneration: CONTENT_GENERATION_PROMPTS,
  copyBlocks: COPY_BLOCK_PROMPTS,
  seo: SEO_PROMPTS,
  blog: BLOG_PROMPTS,
  socialMedia: SOCIAL_MEDIA_PROMPTS,
  analytics: ANALYTICS_PROMPTS,
  brandStrategy: BRAND_STRATEGY_PROMPTS,
  qualityAssurance: QUALITY_ASSURANCE_PROMPTS,
  technical: TECHNICAL_PROMPTS,
  ux: UX_PROMPTS
} as const;

export type PromptCategory = keyof typeof ALL_PROMPTS;