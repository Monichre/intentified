/**
 * Brand Extractor Service
 * Implements the brand extraction functionality based on NewCopy.ai analysis
 */

import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type { BrandAttributes, ColorPalette, ToneAnalysis, SocialPresence } from './types';
import { BRAND_EXTRACTION_PROMPTS, formatPrompt } from './prompts';

// Zod schemas for validation
const ColorPaletteSchema = z.object({
  primary: z.string(),
  secondary: z.array(z.string()),
  accent: z.array(z.string()),
  dominant: z.array(z.string())
});

const ToneAnalysisSchema = z.object({
  formality: z.enum(['formal', 'informal', 'mixed']),
  technicality: z.enum(['technical', 'conversational', 'mixed']),
  mood: z.enum(['serious', 'humorous', 'balanced']),
  passion: z.enum(['passionate', 'matter-of-fact', 'varied']),
  confidence: z.number().min(0).max(1)
});

const SocialPlatformSchema = z.object({
  platform: z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'youtube', 'tiktok']),
  url: z.string().url(),
  followers: z.number().optional(),
  engagementRate: z.number().optional(),
  lastActive: z.date().optional()
});

const SocialPresenceSchema = z.object({
  platforms: z.array(SocialPlatformSchema),
  overallEngagement: z.number().min(0).max(100),
  brandConsistency: z.number().min(0).max(1)
});

const BrandAttributesSchema = z.object({
  brandName: z.string(),
  logo: z.string().optional(),
  colorPalette: ColorPaletteSchema,
  brandValues: z.array(z.string()),
  missionStatement: z.string().optional(),
  toneOfVoice: ToneAnalysisSchema,
  socialPresence: SocialPresenceSchema
});

export interface BrandExtractionOptions {
  websiteUrl: string;
  includeVisualAnalysis?: boolean;
  includeSocialAnalysis?: boolean;
  maxPages?: number;
  onProgress?: (progress: { phase: string; progress: number; message: string }) => void;
}

export interface BrandExtractionResult {
  brandAttributes: BrandAttributes;
  confidence: number;
  sources: string[];
  extractionMetadata: {
    processingTime: number;
    pagesAnalyzed: number;
    visualElementsFound: number;
    socialLinksFound: number;
  };
}

export class BrandExtractorService {
  private model = anthropic('claude-3-5-sonnet-20241022');

  /**
   * Extract brand attributes from a website URL
   */
  async extractBrandAttributes(options: BrandExtractionOptions): Promise<BrandExtractionResult> {
    const startTime = Date.now();
    const { websiteUrl, onProgress } = options;

    try {
      // Step 1: Web scraping and content extraction
      onProgress?.({ phase: 'scraping', progress: 10, message: 'Fetching website content...' });
      const websiteContent = await this.scrapeWebsiteContent(websiteUrl, options.maxPages || 5);

      // Step 2: Extract basic brand information
      onProgress?.({ phase: 'analyzing', progress: 30, message: 'Extracting brand information...' });
      const basicBrandInfo = await this.extractBasicBrandInfo(websiteContent);

      // Step 3: Analyze tone and voice
      onProgress?.({ phase: 'analyzing', progress: 50, message: 'Analyzing brand voice and tone...' });
      const toneAnalysis = await this.analyzeToneAndVoice(websiteContent.textContent);

      // Step 4: Extract color palette (if visual analysis enabled)
      let colorPalette: ColorPalette = {
        primary: '#000000',
        secondary: [],
        accent: [],
        dominant: []
      };

      if (options.includeVisualAnalysis) {
        onProgress?.({ phase: 'analyzing', progress: 70, message: 'Analyzing visual elements...' });
        colorPalette = await this.extractColorPalette(websiteContent);
      }

      // Step 5: Analyze social presence (if enabled)
      let socialPresence: SocialPresence = {
        platforms: [],
        overallEngagement: 0,
        brandConsistency: 0
      };

      if (options.includeSocialAnalysis) {
        onProgress?.({ phase: 'analyzing', progress: 85, message: 'Analyzing social presence...' });
        socialPresence = await this.analyzeSocialPresence(websiteContent.socialLinks);
      }

      // Step 6: Compile final result
      onProgress?.({ phase: 'finalizing', progress: 95, message: 'Compiling brand profile...' });

      const brandAttributes: BrandAttributes = {
        brandName: basicBrandInfo.brandName,
        logo: basicBrandInfo.logo,
        colorPalette,
        brandValues: basicBrandInfo.brandValues,
        missionStatement: basicBrandInfo.missionStatement,
        toneOfVoice: toneAnalysis,
        socialPresence
      };

      // Validate the result
      const validatedBrandAttributes = BrandAttributesSchema.parse(brandAttributes);

      onProgress?.({ phase: 'complete', progress: 100, message: 'Brand extraction complete!' });

      return {
        brandAttributes: validatedBrandAttributes,
        confidence: this.calculateConfidence(brandAttributes, websiteContent),
        sources: [websiteUrl, ...websiteContent.linkedPages],
        extractionMetadata: {
          processingTime: Date.now() - startTime,
          pagesAnalyzed: websiteContent.linkedPages.length + 1,
          visualElementsFound: websiteContent.images.length,
          socialLinksFound: websiteContent.socialLinks.length
        }
      };

    } catch (error) {
      throw new Error(`Brand extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Scrape website content including text, images, and links
   */
  private async scrapeWebsiteContent(url: string, maxPages: number) {
    // This would integrate with web scraping service (Firecrawl, Puppeteer, etc.)
    // For now, returning mock structure
    return {
      url,
      textContent: '', // Main text content
      htmlContent: '', // Raw HTML
      images: [] as string[], // Image URLs
      socialLinks: [] as string[], // Social media links
      linkedPages: [] as string[], // Internal page links
      metaTags: {} as Record<string, string>, // Meta tags
      structuredData: {} as any // JSON-LD data
    };
  }

  /**
   * Extract basic brand information using AI
   */
  private async extractBasicBrandInfo(websiteContent: any) {
    const prompt = formatPrompt(BRAND_EXTRACTION_PROMPTS.websiteAnalysis, {
      content: websiteContent.textContent,
      url: websiteContent.url
    });

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        brandName: z.string(),
        logo: z.string().optional(),
        brandValues: z.array(z.string()),
        missionStatement: z.string().optional(),
        industry: z.string().optional(),
        targetAudience: z.array(z.string()).optional()
      }),
      prompt
    });

    return result.object;
  }

  /**
   * Analyze brand tone and voice characteristics
   */
  private async analyzeToneAndVoice(textContent: string): Promise<ToneAnalysis> {
    const prompt = formatPrompt(BRAND_EXTRACTION_PROMPTS.brandVoice, {
      content: textContent
    });

    const result = await generateObject({
      model: this.model,
      schema: ToneAnalysisSchema,
      prompt
    });

    return result.object;
  }

  /**
   * Extract color palette from website
   */
  private async extractColorPalette(websiteContent: any): Promise<ColorPalette> {
    // This would use computer vision to analyze colors from screenshots
    // For now, returning a basic structure
    const prompt = `Analyze the website content and extract the primary brand colors. 
    Content: ${websiteContent.htmlContent.substring(0, 2000)}`;

    const result = await generateObject({
      model: this.model,
      schema: ColorPaletteSchema,
      prompt
    });

    return result.object;
  }

  /**
   * Analyze social media presence
   */
  private async analyzeSocialPresence(socialLinks: string[]): Promise<SocialPresence> {
    if (socialLinks.length === 0) {
      return {
        platforms: [],
        overallEngagement: 0,
        brandConsistency: 0
      };
    }

    // This would integrate with social media APIs to get actual data
    // For now, returning basic structure based on found links
    const platforms = socialLinks.map(link => {
      let platform: any = 'twitter';
      if (link.includes('facebook')) platform = 'facebook';
      else if (link.includes('instagram')) platform = 'instagram';
      else if (link.includes('linkedin')) platform = 'linkedin';
      else if (link.includes('youtube')) platform = 'youtube';
      else if (link.includes('tiktok')) platform = 'tiktok';

      return {
        platform,
        url: link,
        followers: undefined,
        engagementRate: undefined,
        lastActive: undefined
      };
    });

    return {
      platforms,
      overallEngagement: 0,
      brandConsistency: 0.8 // Default estimate
    };
  }

  /**
   * Calculate confidence score based on extracted data quality
   */
  private calculateConfidence(brandAttributes: BrandAttributes, websiteContent: any): number {
    let confidence = 0;

    // Brand name confidence
    if (brandAttributes.brandName && brandAttributes.brandName.length > 2) {
      confidence += 0.2;
    }

    // Content quality confidence
    if (websiteContent.textContent && websiteContent.textContent.length > 500) {
      confidence += 0.2;
    }

    // Brand values confidence
    if (brandAttributes.brandValues && brandAttributes.brandValues.length >= 3) {
      confidence += 0.2;
    }

    // Mission statement confidence
    if (brandAttributes.missionStatement && brandAttributes.missionStatement.length > 50) {
      confidence += 0.15;
    }

    // Social presence confidence
    if (brandAttributes.socialPresence.platforms.length > 0) {
      confidence += 0.15;
    }

    // Visual elements confidence
    if (brandAttributes.logo || brandAttributes.colorPalette.primary !== '#000000') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Refine brand attributes based on user feedback
   */
  async refineBrandAttributes(
    currentAttributes: BrandAttributes,
    userFeedback: string
  ): Promise<BrandAttributes> {
    const prompt = formatPrompt(BRAND_EXTRACTION_PROMPTS.brandRefinement, {
      currentAttributes: JSON.stringify(currentAttributes, null, 2),
      feedback: userFeedback
    });

    const result = await generateObject({
      model: this.model,
      schema: BrandAttributesSchema,
      prompt
    });

    return result.object;
  }

  /**
   * Evaluate brand consistency across different content sections
   */
  async evaluateBrandConsistency(
    brandAttributes: BrandAttributes,
    contentSections: string[]
  ): Promise<{ consistencyScore: number; issues: string[] }> {
    const prompt = formatPrompt(BRAND_EXTRACTION_PROMPTS.consistencyEvaluation, {
      brandAttributes: JSON.stringify(brandAttributes, null, 2),
      contentSections: contentSections.join('\n\n---\n\n')
    });

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        consistencyScore: z.number().min(0).max(1),
        issues: z.array(z.string()),
        recommendations: z.array(z.string())
      }),
      prompt
    });

    return {
      consistencyScore: result.object.consistencyScore,
      issues: result.object.issues
    };
  }
}