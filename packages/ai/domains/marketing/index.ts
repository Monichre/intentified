/**
 * Marketing Intelligence Domain
 * Exports all marketing analysis services and utilities
 */

import { BrandExtractorService } from './brand-extractor'
import { BrandPositioningService } from './brand-positioning'
import { BrandSentimentService } from './brand-sentiment'

// Type exports
export type * from './types';

// Service exports


// Prompt exports
export * from './prompts';

// Utility functions
export { formatPrompt } from './prompts';

// Re-export existing services


// Main orchestrator service that combines all marketing intelligence capabilities
export class MarketingIntelligenceFacade {
  private brandExtractor = new BrandExtractorService();
  private brandSentiment = new BrandSentimentService();
  private brandPositioning = new BrandPositioningService();

  /**
   * Perform comprehensive brand analysis including extraction, sentiment, and positioning
   */
  async performComprehensiveBrandAnalysis(options: {
    brandName: string;
    websiteUrl: string;
    industry: string;
    includeCompetitors?: boolean;
    competitors?: string[];
    onProgress?: (progress: { phase: string; progress: number; message: string }) => void;
  }) {
    const { brandName, websiteUrl, industry, includeCompetitors = true, competitors, onProgress } = options;

    try {
      // Step 1: Brand Extraction
      onProgress?.({ phase: 'extraction', progress: 0, message: 'Starting brand extraction...' });
      const brandExtractionResult = await this.brandExtractor.extractBrandAttributes({
        websiteUrl,
        includeVisualAnalysis: true,
        includeSocialAnalysis: true,
        onProgress: (progress) => {
          onProgress?.({
            phase: 'extraction',
            progress: Math.round(progress.progress * 0.33),
            message: progress.message
          });
        }
      });

      // Step 2: Sentiment Analysis
      onProgress?.({ phase: 'sentiment', progress: 33, message: 'Starting sentiment analysis...' });
      const sentimentResult = await this.brandSentiment.analyzeBrandSentiment({
        brandName,
        websiteUrl,
        includeCompetitors,
        competitors,
        onProgress: (progress) => {
          onProgress?.({
            phase: 'sentiment',
            progress: 33 + Math.round(progress.progress * 0.33),
            message: progress.message
          });
        }
      });

      // Step 3: Positioning Analysis
      onProgress?.({ phase: 'positioning', progress: 66, message: 'Starting positioning analysis...' });
      const positioningResult = await this.brandPositioning.analyzeBrandPositioning({
        brandName,
        industry,
        websiteUrl,
        competitors,
        onProgress: (progress) => {
          onProgress?.({
            phase: 'positioning',
            progress: 66 + Math.round(progress.progress * 0.34),
            message: progress.message
          });
        }
      });

      onProgress?.({ phase: 'complete', progress: 100, message: 'Analysis complete!' });

      return {
        brandAttributes: brandExtractionResult.brandAttributes,
        sentimentAnalysis: sentimentResult.analysis,
        positioningAnalysis: positioningResult.analysis,
        metadata: {
          brandExtraction: brandExtractionResult.extractionMetadata,
          sentiment: sentimentResult.metadata,
          positioning: positioningResult.metadata,
          totalProcessingTime: 
            brandExtractionResult.extractionMetadata.processingTime +
            sentimentResult.metadata.processingTime +
            positioningResult.metadata.processingTime
        }
      };

    } catch (error) {
      throw new Error(`Comprehensive brand analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate a unified marketing intelligence report
   */
  async generateMarketingIntelligenceReport(analysisResult: any): Promise<string> {
    // This would generate a comprehensive report combining all analysis results
    return 'Marketing Intelligence Report generated';
  }

  /**
   * Get brand extractor service instance
   */
  getBrandExtractor() {
    return this.brandExtractor;
  }

  /**
   * Get brand sentiment service instance
   */
  getBrandSentiment() {
    return this.brandSentiment;
  }

  /**
   * Get brand positioning service instance
   */
  getBrandPositioning() {
    return this.brandPositioning;
  }
}