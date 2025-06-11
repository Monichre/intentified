/**
 * Comprehensive list of AI prompt templates for marketing intelligence, content generation,
 * brand analysis, and campaign optimization.
 * 
 * Each prompt is exported as a named constant for modular use in agent logic, prompt engineering,
 * and dynamic prompt assembly.
 * 
 * Follows SOLID, functional, and declarative patterns.
 */

export const BRAND_EXTRACTION_PROMPT =
  "Extract and analyze all brand attributes from the provided website URL, focusing on voice, tone, messaging patterns, visual identity, target audience characteristics, and value propositions.";

export const BRAND_VOICE_IDENTIFICATION_PROMPT =
  "Identify the brand's voice characteristics from the extracted content, categorizing as formal/informal, technical/conversational, serious/humorous, and passionate/matter-of-fact.";

export const BRAND_ATTRIBUTE_CATEGORIZATION_PROMPT =
  "Categorize the extracted brand attributes into Product Overview, Product Strategy, Brand Identity, and Core Value Proposition sections.";

export const BRAND_CONSISTENCY_EVALUATION_PROMPT =
  "Evaluate the consistency of brand messaging across different website sections and identify any contradictions or variations in tone.";

export const BRAND_REFINEMENT_PROMPT =
  "Based on user feedback, refine the extracted brand attributes to better align with the brand owner's perception of their identity.";

export const BRAND_PROFILE_COMPLETION_PROMPT =
  "Identify missing or incomplete brand attributes and suggest values based on existing information and industry norms.";

export const BRAND_ATTRIBUTE_WEIGHTING_PROMPT =
  "Analyze the relative importance of different brand attributes for content generation and suggest appropriate weighting values.";

export const BRAND_EVOLUTION_SUGGESTION_PROMPT =
  "Based on industry trends and competitive analysis, suggest potential brand attribute adjustments to improve market positioning.";

export const BRAND_CONSISTENCY_CHECK_PROMPT =
  "Compare newly edited brand attributes against the overall brand profile and flag potential inconsistencies or contradictions.";

export const BRAND_ALIGNED_CONTENT_PROMPT =
  "Generate [content type] that embodies the brand's voice and tone while incorporating key messaging points about [topic], optimized for [target audience].";

export const PRODUCT_DESCRIPTION_PROMPT =
  "Create a product description for [product name] that highlights its unique value proposition, maintains the brand's voice, and incorporates key features and benefits.";

export const AD_COPY_VARIATION_PROMPT =
  "Generate 3 variations of ad copy for [campaign purpose] that maintain consistent brand messaging while testing different approaches to the call-to-action.";

export const EMAIL_CONTENT_PROMPT =
  "Create an email [subject line/body/CTA] for [campaign purpose] that aligns with the brand voice, resonates with [target audience], and drives [desired action].";

export const VALUE_PROPOSITION_ARTICULATION_PROMPT =
  "Reformulate the brand's core value proposition into compelling messaging for [specific context], emphasizing [key benefit] for [target audience].";

export const UI_ELEMENT_COPY_PROMPT =
  "Generate copy for [UI element type] that communicates [function/purpose] clearly and concisely while maintaining brand voice.";

export const BUTTON_TEXT_OPTIMIZATION_PROMPT =
  "Create 5 variations of button text for [action] that maximize click-through potential while maintaining clarity and brand alignment.";

export const FORM_FIELD_GUIDANCE_PROMPT =
  "Generate user-friendly placeholder and help text for [form field] that guides users while maintaining the brand's tone.";

export const ERROR_MESSAGE_HUMANIZATION_PROMPT =
  "Rewrite technical error message '[error message]' to be more user-friendly and aligned with the brand's voice.";

export const CONFIRMATION_MESSAGE_PROMPT =
  "Create a confirmation message for [action completion] that reinforces the brand relationship and suggests next steps.";

export const LANDING_PAGE_ANALYSIS_PROMPT =
  "Analyze the provided landing page content and structure, identifying opportunities to improve conversion potential while maintaining brand alignment.";

export const HEADLINE_OPTIMIZATION_PROMPT =
  "Generate 5 alternative headlines for [landing page] that improve clarity, engagement, and conversion potential while maintaining brand voice.";

export const BENEFITS_SECTION_PROMPT =
  "Rewrite the benefits section to more clearly articulate value to the customer, using the brand's voice and focusing on [key value propositions].";

export const CTA_ENHANCEMENT_PROMPT =
  "Generate 3 variations of the primary call-to-action that create greater urgency and clarity while maintaining brand tone.";

export const SOCIAL_PROOF_INTEGRATION_PROMPT =
  "Create templated copy for integrating customer testimonials that reinforces [key message] and builds credibility.";

export const TOPIC_IDENTIFICATION_PROMPT =
  "Based on [industry/niche] and [target keywords], identify 10 high-potential blog topics that align with the brand's expertise and audience interests.";

export const BLOG_STRUCTURE_PROMPT =
  "Create a detailed outline for a blog post on [topic] that incorporates [target keywords], addresses user intent, and maintains the brand's voice and expertise positioning.";

export const SEO_TITLE_OPTIMIZATION_PROMPT =
  "Generate 5 SEO-optimized title options for [blog topic] that incorporate [target keyword], create reader interest, and align with the brand's voice.";

export const META_DESCRIPTION_PROMPT =
  "Create an engaging meta description for [blog post] that incorporates [target keyword], communicates value, and encourages clicks within 155 characters.";

export const CONTENT_GAP_ANALYSIS_PROMPT =
  "Analyze the top-ranking content for [target keyword] and identify information gaps that our content can uniquely address from our brand's perspective.";

export const STEP1_TOPIC_RESEARCH_PROMPT =
  "Research [topic area] to identify specific angles that align with our brand positioning, have search potential, and address audience needs.";

export const STEP2_OUTLINE_DEVELOPMENT_PROMPT =
  "Create a comprehensive outline for [blog topic] that includes an engaging introduction, logically structured sections addressing [key points], and a compelling conclusion with next steps.";

export const STEP3_CONTENT_DRAFTING_PROMPT =
  "Draft a comprehensive blog post following the outline for [topic], incorporating [target keywords] naturally, maintaining our brand's [voice characteristics], and demonstrating expertise through [specific approaches].";

export const STEP4_OPTIMIZATION_PROMPT =
  "Optimize the draft blog post by enhancing readability, strengthening SEO elements, ensuring brand voice consistency, and adding compelling calls-to-action.";

// Social Media Automation Prompts
export const PLATFORM_SPECIFIC_CONTENT_PROMPT =
  "Create a [platform] post about [topic/announcement] that aligns with our brand voice, optimizes for the platform's best practices, and drives [engagement goal].";

export const CAMPAIGN_MESSAGE_ADAPTATION_PROMPT =
  "Adapt the core campaign message '[message]' into platform-optimized content for [platforms list], maintaining consistent messaging while leveraging each platform's unique features.";

export const HASHTAG_RESEARCH_PROMPT =
  "Identify 5-7 relevant and trending hashtags for content about [topic] that will extend reach while remaining appropriate for our brand positioning.";

export const ENGAGEMENT_QUESTION_PROMPT =
  "Generate 3 engaging questions related to [topic] that align with our brand voice and will stimulate meaningful conversation with our [platform] audience.";

export const VISUAL_CONTENT_SUGGESTION_PROMPT =
  "Based on the post copy about [topic], suggest appropriate visual content approaches that will enhance message impact and brand recognition.";

export const CONTENT_MIX_OPTIMIZATION_PROMPT =
  "Analyze our current content mix and suggest an optimal balance of promotional, educational, entertaining, and engaging content for [platform] based on audience response patterns.";

export const POSTING_SCHEDULE_OPTIMIZATION_PROMPT =
  "Based on our [platform] audience behavior data, recommend optimal posting times and frequency to maximize engagement.";

export const CONTENT_THEME_DEVELOPMENT_PROMPT =
  "Develop 4-6 content themes for [time period] that align with our brand positioning, business objectives, and audience interests.";

export const CAMPAIGN_CONTENT_SEQUENCE_PROMPT =
  "Create a 2-week content sequence for [campaign] across [platforms] that builds awareness, engagement, and conversion while maintaining narrative coherence.";

export const CONTENT_REPURPOSING_PROMPT =
  "Identify opportunities to repurpose the [original content] into multiple platform-optimized formats while maintaining message consistency.";

export const CROSS_PLATFORM_ADAPTATION_PROMPT =
  "Adapt the core message '[message]' for [list of platforms], optimizing format, length, and tone for each platform while maintaining consistent brand voice and call-to-action.";

export const VISUAL_ASSET_OPTIMIZATION_PROMPT =
  "Recommend optimal image dimensions, formats, and approaches for [visual content] across [platforms] to maximize impact and engagement.";

export const PLATFORM_SPECIFIC_FEATURE_UTILIZATION_PROMPT =
  "Suggest ways to leverage unique features of [platform] (e.g., Stories, Polls, Carousels) to enhance the impact of content about [topic].";

export const AUDIENCE_TARGETING_PROMPT =
  "Based on our brand positioning and content about [topic], recommend audience targeting parameters for [platform] to maximize relevance and engagement.";

export const PERFORMANCE_PREDICTION_PROMPT =
  "Analyze the draft content for [platform] and predict likely performance based on historical engagement patterns, suggesting optimizations to improve outcomes.";

// Analytics and Optimization Prompts
export const PERFORMANCE_INSIGHT_PROMPT =
  "Analyze the performance data for [content piece/campaign] and identify key patterns, unexpected outcomes, and actionable insights.";

export const UNDERPERFORMANCE_ANALYSIS_PROMPT =
  "Examine [content piece] that performed below expectations and identify potential factors in messaging, timing, audience targeting, or external factors.";

export const SUCCESS_PATTERN_IDENTIFICATION_PROMPT =
  "Analyze our top-performing content across [platforms/channels] and identify common elements that contribute to above-average engagement.";

export const COMPETITIVE_BENCHMARK_PROMPT =
  "Compare our content performance metrics for [content type/topic] against industry benchmarks and identify areas for improvement.";

export const TREND_IDENTIFICATION_PROMPT =
  "Analyze performance data over [time period] to identify emerging trends in audience preferences, engagement patterns, and content effectiveness.";

export const CONTENT_ENHANCEMENT_PROMPT =
  "Based on performance analysis of [content piece], recommend specific improvements to messaging, structure, or visual elements to increase effectiveness.";

export const AUDIENCE_TARGETING_REFINEMENT_PROMPT =
  "Analyze engagement patterns across audience segments and recommend targeting adjustments to improve relevance and response.";

export const CHANNEL_STRATEGY_PROMPT =
  "Evaluate performance across channels and recommend optimal content distribution strategy for [content type/campaign] based on audience engagement patterns.";

export const TESTING_STRATEGY_PROMPT =
  "Design an A/B testing approach for [content element] that will provide actionable insights on [specific question] while maintaining brand consistency.";

export const ROI_IMPROVEMENT_PROMPT =
  "Analyze cost-effectiveness of [campaign/content type] and recommend adjustments to improve return on investment.";

// AI Consultation Prompts
export const BRAND_POSITIONING_PROMPT =
  "Based on the provided information about [company/product] and [target market], recommend positioning approaches that differentiate from competitors and resonate with the target audience.";

export const BRAND_VOICE_DEVELOPMENT_PROMPT =
  "Guide the development of a distinctive brand voice for [company] that aligns with their values, audience expectations, and market positioning.";

export const VALUE_PROPOSITION_REFINEMENT_PROMPT =
  "Analyze the current value proposition and suggest refinements that more clearly communicate unique benefits to [target audience].";

export const BRAND_EVOLUTION_PROMPT =
  "Assess the current brand positioning in the context of [market changes/business evolution] and recommend strategic adjustments to maintain relevance and competitive advantage.";

export const BRAND_CONSISTENCY_FRAMEWORK_PROMPT =
  "Develop guidelines for maintaining brand consistency across [channels/touchpoints] while allowing appropriate flexibility for channel-specific requirements.";

export const CHANNEL_STRATEGY_ASSISTANCE_PROMPT =
  "Based on [business objectives], [target audience], and [resource constraints], recommend an optimal channel mix with allocation priorities.";

export const CAMPAIGN_STRUCTURE_PROMPT =
  "Design a campaign structure for [objective] targeting [audience] that coordinates messaging across channels and creates an effective customer journey.";

export const BUDGET_ALLOCATION_PROMPT =
  "Analyze historical performance data and recommend budget allocation across [channels/tactics] to maximize [primary KPI] within [budget constraint].";

export const COMPETITIVE_RESPONSE_PROMPT =
  "Develop a strategic response to [competitor action/market change] that leverages our brand strengths and addresses potential market impact.";

export const MARKETING_MEASUREMENT_PROMPT =
  "Design a measurement framework for [campaign/initiative] that tracks both immediate performance and contribution to longer-term business objectives.";

export const CONCEPT_EXPANSION_PROMPT =
  "Expand on the initial concept of [concept] by exploring different angles, approaches, and executions while maintaining alignment with [strategic objective].";

export const IDEA_EVALUATION_PROMPT =
  "Evaluate the concept [concept] against strategic objectives, brand alignment, practical feasibility, and potential audience impact.";

export const CREATIVE_PROBLEM_SOLVING_PROMPT =
  "Generate approaches to address the creative challenge of [challenge description] while working within [constraints] and achieving [objectives].";

export const CONCEPT_REFINEMENT_PROMPT =
  "Refine the [concept] by addressing [specific weakness/concern] while preserving its core strengths and strategic alignment.";

export const IMPLEMENTATION_GUIDANCE_PROMPT =
  "Provide practical guidance for implementing the [creative concept] across [channels/touchpoints] while maintaining conceptual integrity and effectiveness.";

// Content Quality Assessment Prompts
export const BRAND_ALIGNMENT_EVALUATION_PROMPT =
  "Evaluate the generated content against the brand profile and score alignment across voice, tone, messaging, and value proposition dimensions.";

export const GRAMMAR_AND_STYLE_CHECK_PROMPT =
  "Analyze the text for grammatical accuracy, readability, and stylistic consistency, flagging any issues that require attention.";

export const ENGAGEMENT_POTENTIAL_ASSESSMENT_PROMPT =
  "Assess the likely engagement potential of the content based on clarity, interest generation, emotional impact, and call-to-action effectiveness.";

export const ORIGINALITY_VERIFICATION_PROMPT =
  "Evaluate the content for originality and uniqueness, identifying any sections that closely resemble existing content.";

export const AUDIENCE_RELEVANCE_CHECK_PROMPT =
  "Analyze how well the content addresses the needs, interests, and pain points of the specified target audience.";

// Bias and Fairness Testing Prompts
export const INCLUSIVE_LANGUAGE_CHECK_PROMPT =
  "Review the content for potentially non-inclusive language, bias, or stereotypes related to gender, age, ethnicity, ability, or other characteristics.";

export const CULTURAL_SENSITIVITY_PROMPT =
  "Evaluate the content for cultural appropriateness across different regions and identify any elements that might be problematic in specific markets.";

export const REPRESENTATION_ANALYSIS_PROMPT =
  "Analyze the diversity and representation in the content, including language, examples, and implied assumptions about the audience.";

export const ACCESSIBILITY_REVIEW_PROMPT =
  "Review the content for accessibility considerations, including clarity, readability, and compatibility with assistive technologies.";

export const ETHICAL_ALIGNMENT_PROMPT =
  "Evaluate the content against ethical marketing principles, including truthfulness, transparency, and respect for consumer autonomy.";

// Model Validation Prompts
export const CONSISTENCY_TESTING_PROMPT =
  "Generate multiple outputs for identical inputs and evaluate consistency in quality, tone, and messaging alignment.";

export const EDGE_CASE_TESTING_PROMPT =
  "Test the model's performance with challenging inputs including minimal context, unusual requests, or ambiguous instructions.";

export const DOMAIN_ADAPTATION_PROMPT =
  "Evaluate the model's performance across different industry domains, identifying any areas where domain-specific knowledge appears insufficient.";

export const INSTRUCTION_FOLLOWING_PROMPT =
  "Assess how accurately the model follows specific instructions regarding content constraints, inclusion of key messages, or formatting requirements.";

export const IMPROVEMENT_SUGGESTION_PROMPT =
  "Based on output analysis, identify specific areas where the model could be improved through additional training, fine-tuning, or prompt engineering.";

// Technical Implementation Prompts
export const BRAND_VOICE_TRAINING_PROMPT =
  "Fine-tune the language model to recognize and reproduce the distinctive elements of [brand]'s voice, including [specific characteristics].";

export const DOMAIN_SPECIFIC_TRAINING_PROMPT =
  "Enhance the model's knowledge and generation capabilities for the [industry/domain] vertical, focusing on terminology, common concepts, and audience expectations.";

export const CONTENT_TYPE_SPECIALIZATION_PROMPT =
  "Optimize model performance for generating [content type] by training on high-quality examples that demonstrate effective structure, tone, and persuasive elements.";

export const MULTILINGUAL_ADAPTATION_PROMPT =
  "Extend the model's capabilities to maintain consistent brand voice and quality when generating content in [target languages].";

export const PERFORMANCE_IMPROVEMENT_PROMPT =
  "Based on identified weaknesses in [specific aspect], retrain the model with focused examples that demonstrate the desired output characteristics.";

export const API_INTERACTION_PROMPT =
  "Design optimal prompt structures for the [specific API endpoint] that maximize consistency and quality of results while minimizing token usage.";

export const ERROR_HANDLING_PROMPT =
  "Develop fallback prompting strategies for scenarios where initial generation attempts produce unsatisfactory results.";

export const CONTEXT_MANAGEMENT_PROMPT =
  "Optimize the inclusion of brand context, user inputs, and historical interactions in prompts to improve relevance while managing token limitations.";

export const OUTPUT_PARSING_PROMPT =
  "Extract structured data from model outputs including key messages, suggested headlines, and recommended keywords.";

export const HYBRID_SYSTEM_PROMPT =
  "Design prompt interfaces between AI generation and rule-based systems to combine the strengths of both approaches for [specific functionality].";

export const PROMPT_TEMPLATE_DESIGN_PROMPT =
  "Create a standardized prompt template for [use case] that ensures consistent inclusion of brand context, user requirements, and generation parameters.";

export const INSTRUCTION_OPTIMIZATION_PROMPT =
  "Refine instructions for [specific task] to improve clarity, reduce ambiguity, and guide the model toward desired output characteristics.";

export const FEW_SHOT_EXAMPLE_SELECTION_PROMPT =
  "Identify optimal examples to include in prompts for [generation task] that demonstrate desired output qualities without biasing toward specific content.";

export const PARAMETER_TUNING_PROMPT =
  "Determine optimal temperature and top-p settings for [content type] generation that balance creativity and predictability appropriately.";

export const PROMPT_EFFICIENCY_PROMPT =
  "Optimize the prompt structure for [use case] to reduce token usage while maintaining output quality and consistency.";

// User Experience Prompts
export const FEATURE_INTRODUCTION_PROMPT =
  "Create user-friendly explanations of [feature] that communicate its value, basic usage, and relationship to the user's goals.";

export const CONTEXTUAL_HELP_PROMPT =
  "Generate helpful guidance for users encountering [specific situation/error], providing clear next steps and explanations.";

export const PROGRESSIVE_DISCLOSURE_PROMPT =
  "Design a sequence of tips that introduce advanced features of [tool/section] as users demonstrate readiness through their usage patterns.";

export const BEST_PRACTICE_GUIDANCE_PROMPT =
  "Provide tailored best practices for [task] based on the user's specific context, goals, and experience level.";

export const SUCCESS_PATTERN_PROMPT =
  "Based on patterns from successful users, generate personalized recommendations for how this user could better achieve [specific goal].";

export const QUERY_INTERPRETATION_PROMPT =
  "Interpret the user's request for [user input] to identify their underlying goal, required information, and appropriate response format.";

export const CLARIFICATION_QUESTION_PROMPT =
  "Generate appropriate clarifying questions when user inputs are ambiguous or insufficient to provide the best response.";

export const PERSONALIZED_RESPONSE_PROMPT =
  "Craft responses to user questions about [topic] that reflect their usage history, preferences, and current context.";

export const FEEDBACK_SOLICITATION_PROMPT =
  "Generate contextually appropriate requests for user feedback about [feature/content] that feel natural and encourage thoughtful responses.";

export const NEXT_ACTION_SUGGESTION_PROMPT =
  "Based on the user's current activity and goals, suggest logical next actions that would provide additional value.";

const MARKETING_AGENCY_KILLER_PROMPT = `
"You are a world-class marketing strategist, copywriter, and creative director.

Your task: develop a complete marketing strategy for:

[Insert product/service/startup here]

Include:

• One-sentence positioning statement
• ICP breakdown (jobs, pains, goals)
• 3 core marketing channels with reasoning
• Content ideas for each channel
• Paid ad angles (hooks, CTAs, visuals)
• Influencer/UGC script template
• SEO plan (keywords, article topics, link strategy)
• Email sequence (welcome + sales)
• Launch campaign timeline
• Key metrics to track + optimize

Format cleanly. Make it feel like a $20K marketing brief.`;