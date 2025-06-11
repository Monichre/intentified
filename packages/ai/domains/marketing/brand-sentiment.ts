/**
 * Brand Sentiment Analyzer Service
 * Implements sentiment analysis for brand mentions across multiple sources
 */

import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type {
  BrandSentimentAnalysis,
  SentimentScore,
  SentimentDistribution,
  EmotionalAssociation,
  Topic,
  TimeSeriesData,
  CompetitiveSentiment
} from './types';
import { formatPrompt } from './prompts';

// Zod schemas for validation
const SentimentScoreSchema = z.object({
  score: z.number().min(-1).max(1),
  confidence: z.number().min(0).max(1),
  classification: z.enum(['positive', 'negative', 'neutral'])
});

const EmotionalAssociationSchema = z.object({
  emotion: z.string(),
  intensity: z.number().min(0).max(1),
  frequency: z.number().min(0)
});

const TopicSchema = z.object({
  name: z.string(),
  relevance: z.number().min(0).max(1),
  sentiment: SentimentScoreSchema,
  mentions: z.number().min(0)
});

const BrandSentimentAnalysisSchema = z.object({
  overallSentiment: SentimentScoreSchema,
  sentimentBreakdown: z.object({
    positive: z.number().min(0).max(100),
    negative: z.number().min(0).max(100),
    neutral: z.number().min(0).max(100)
  }),
  emotionalAssociations: z.array(EmotionalAssociationSchema),
  keyTopics: z.array(TopicSchema),
  sentimentOverTime: z.array(z.object({
    date: z.date(),
    sentiment: SentimentScoreSchema,
    volume: z.number().min(0)
  })),
  comparativeAnalysis: z.object({
    industryAverage: SentimentScoreSchema,
    competitors: z.array(z.object({
      name: z.string(),
      sentiment: SentimentScoreSchema,
      marketShare: z.number().optional()
    })),
    marketPosition: z.enum(['leader', 'challenger', 'follower', 'niche'])
  })
});

export interface SentimentAnalysisOptions {
  brandName: string;
  websiteUrl?: string;
  timePeriod?: 'last_7_days' | 'last_30_days' | 'last_90_days' | 'last_year';
  sources?: ('social' | 'news' | 'reviews' | 'forums' | 'blogs')[];
  includeCompetitors?: boolean;
  competitors?: string[];
  onProgress?: (progress: { phase: string; progress: number; message: string }) => void;
}

export interface MentionSource {
  id: string;
  source: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'news' | 'review' | 'forum' | 'blog';
  url: string;
  content: string;
  author?: string;
  publishedAt: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface SentimentAnalysisResult {
  analysis: BrandSentimentAnalysis;
  mentions: MentionSource[];
  metadata: {
    processingTime: number;
    totalMentions: number;
    sourcesAnalyzed: string[];
    confidenceScore: number;
  };
}

export class BrandSentimentService {
  private model = anthropic('claude-3-5-sonnet-20241022');

  /**
   * Analyze brand sentiment across multiple sources
   */
  async analyzeBrandSentiment(options: SentimentAnalysisOptions): Promise<SentimentAnalysisResult> {
    const startTime = Date.now();
    const { brandName, onProgress } = options;

    try {
      // Step 1: Collect mentions from various sources
      onProgress?.({ phase: 'collecting', progress: 10, message: 'Collecting brand mentions...' });
      const mentions = await this.collectBrandMentions(options);

      // Step 2: Analyze individual mention sentiments
      onProgress?.({ phase: 'analyzing', progress: 30, message: 'Analyzing sentiment of mentions...' });
      const mentionSentiments = await this.analyzeMentionSentiments(mentions);

      // Step 3: Extract emotional associations
      onProgress?.({ phase: 'analyzing', progress: 50, message: 'Extracting emotional associations...' });
      const emotionalAssociations = await this.extractEmotionalAssociations(mentions);

      // Step 4: Identify key topics
      onProgress?.({ phase: 'analyzing', progress: 65, message: 'Identifying key topics...' });
      const keyTopics = await this.extractKeyTopics(mentions, mentionSentiments);

      // Step 5: Calculate overall sentiment and distribution
      onProgress?.({ phase: 'calculating', progress: 80, message: 'Calculating overall sentiment...' });
      const overallSentiment = this.calculateOverallSentiment(mentionSentiments);
      const sentimentBreakdown = this.calculateSentimentDistribution(mentionSentiments);

      // Step 6: Generate time series data
      const sentimentOverTime = this.generateTimeSeriesData(mentions, mentionSentiments);

      // Step 7: Competitive analysis (if enabled)
      let comparativeAnalysis = this.getDefaultComparativeAnalysis();
      if (options.includeCompetitors) {
        onProgress?.({ phase: 'comparing', progress: 90, message: 'Analyzing competitive sentiment...' });
        comparativeAnalysis = await this.analyzeCompetitiveSentiment(brandName, options.competitors || []);
      }

      onProgress?.({ phase: 'complete', progress: 100, message: 'Sentiment analysis complete!' });

      const analysis: BrandSentimentAnalysis = {
        overallSentiment,
        sentimentBreakdown,
        emotionalAssociations,
        keyTopics,
        sentimentOverTime,
        comparativeAnalysis
      };

      // Validate the result
      const validatedAnalysis = BrandSentimentAnalysisSchema.parse(analysis);

      return {
        analysis: validatedAnalysis,
        mentions,
        metadata: {
          processingTime: Date.now() - startTime,
          totalMentions: mentions.length,
          sourcesAnalyzed: [...new Set(mentions.map(m => m.source))],
          confidenceScore: this.calculateAnalysisConfidence(mentions, overallSentiment)
        }
      };

    } catch (error) {
      throw new Error(`Sentiment analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Collect brand mentions from various sources
   */
  private async collectBrandMentions(options: SentimentAnalysisOptions): Promise<MentionSource[]> {
    const mentions: MentionSource[] = [];
    const sources = options.sources || ['social', 'news', 'reviews'];
    const timePeriod = options.timePeriod || 'last_30_days';

    // This would integrate with various APIs:
    // - Twitter/X API
    // - Google News API
    // - Review platform APIs (Trustpilot, G2, etc.)
    // - Reddit API
    // - Blog indexing services

    // Mock implementation - in real scenario, this would call actual APIs
    for (const source of sources) {
      const sourceMentions = await this.collectFromSource(source, options.brandName, timePeriod);
      mentions.push(...sourceMentions);
    }

    return mentions;
  }

  /**
   * Collect mentions from a specific source
   */
  private async collectFromSource(
    source: string,
    brandName: string,
    timePeriod: string
  ): Promise<MentionSource[]> {
    // Mock implementation - would integrate with actual APIs
    return [];
  }

  /**
   * Analyze sentiment for individual mentions using AI
   */
  private async analyzeMentionSentiments(mentions: MentionSource[]): Promise<Map<string, SentimentScore>> {
    const sentiments = new Map<string, SentimentScore>();

    // Process mentions in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < mentions.length; i += batchSize) {
      const batch = mentions.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (mention) => {
        const prompt = `Analyze the sentiment of this text about a brand. Provide a sentiment score from -1 (very negative) to 1 (very positive), confidence level, and classification.

Text: "${mention.content}"

Consider context, sarcasm, and overall tone. Return only the analysis.`;

        const result = await generateObject({
          model: this.model,
          schema: SentimentScoreSchema,
          prompt
        });

        return { mentionId: mention.id, sentiment: result.object };
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ mentionId, sentiment }) => {
        sentiments.set(mentionId, sentiment);
      });

      // Small delay to respect rate limits
      if (i + batchSize < mentions.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return sentiments;
  }

  /**
   * Extract emotional associations from mentions
   */
  private async extractEmotionalAssociations(mentions: MentionSource[]): Promise<EmotionalAssociation[]> {
    const allContent = mentions.map(m => m.content).join('\n\n');
    
    const prompt = `Analyze the emotional associations in these brand mentions. Identify the top emotions and their intensity/frequency.

Content: ${allContent.substring(0, 4000)}

Focus on emotions like: trust, excitement, frustration, satisfaction, anger, joy, fear, surprise, etc.`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(EmotionalAssociationSchema),
      prompt
    });

    return result.object.slice(0, 10); // Top 10 emotions
  }

  /**
   * Extract key topics from mentions
   */
  private async extractKeyTopics(
    mentions: MentionSource[],
    sentiments: Map<string, SentimentScore>
  ): Promise<Topic[]> {
    const allContent = mentions.map(m => m.content).join('\n\n');
    
    const prompt = `Extract the key topics and themes from these brand mentions. For each topic, provide relevance and overall sentiment.

Content: ${allContent.substring(0, 4000)}

Identify topics like: product quality, customer service, pricing, features, user experience, etc.`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(TopicSchema),
      prompt
    });

    return result.object.slice(0, 15); // Top 15 topics
  }

  /**
   * Calculate overall sentiment from individual mention sentiments
   */
  private calculateOverallSentiment(sentiments: Map<string, SentimentScore>): SentimentScore {
    const scores = Array.from(sentiments.values());
    
    if (scores.length === 0) {
      return { score: 0, confidence: 0, classification: 'neutral' };
    }

    const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const avgConfidence = scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length;
    
    let classification: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (avgScore > 0.1) classification = 'positive';
    else if (avgScore < -0.1) classification = 'negative';

    return {
      score: avgScore,
      confidence: avgConfidence,
      classification
    };
  }

  /**
   * Calculate sentiment distribution percentages
   */
  private calculateSentimentDistribution(sentiments: Map<string, SentimentScore>): SentimentDistribution {
    const scores = Array.from(sentiments.values());
    
    if (scores.length === 0) {
      return { positive: 0, negative: 0, neutral: 100 };
    }

    const positive = scores.filter(s => s.classification === 'positive').length;
    const negative = scores.filter(s => s.classification === 'negative').length;
    const neutral = scores.filter(s => s.classification === 'neutral').length;

    const total = scores.length;

    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100)
    };
  }

  /**
   * Generate time series data for sentiment trends
   */
  private generateTimeSeriesData(
    mentions: MentionSource[],
    sentiments: Map<string, SentimentScore>
  ): TimeSeriesData[] {
    // Group mentions by date and calculate daily sentiment
    const dateGroups = new Map<string, { mentions: MentionSource[]; sentiments: SentimentScore[] }>();

    mentions.forEach(mention => {
      const dateKey = mention.publishedAt.toISOString().split('T')[0];
      const sentiment = sentiments.get(mention.id);
      
      if (!sentiment) return;

      if (!dateGroups.has(dateKey)) {
        dateGroups.set(dateKey, { mentions: [], sentiments: [] });
      }
      
      const group = dateGroups.get(dateKey)!;
      group.mentions.push(mention);
      group.sentiments.push(sentiment);
    });

    // Convert to time series data
    return Array.from(dateGroups.entries()).map(([dateStr, group]) => {
      const avgScore = group.sentiments.reduce((sum, s) => sum + s.score, 0) / group.sentiments.length;
      const avgConfidence = group.sentiments.reduce((sum, s) => sum + s.confidence, 0) / group.sentiments.length;
      
      let classification: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (avgScore > 0.1) classification = 'positive';
      else if (avgScore < -0.1) classification = 'negative';

      return {
        date: new Date(dateStr),
        sentiment: { score: avgScore, confidence: avgConfidence, classification },
        volume: group.mentions.length
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Analyze competitive sentiment landscape
   */
  private async analyzeCompetitiveSentiment(
    brandName: string,
    competitors: string[]
  ): Promise<CompetitiveSentiment> {
    // This would collect and analyze sentiment for competitors
    // For now, returning mock data
    const competitorSentiments = competitors.map(name => ({
      name,
      sentiment: {
        score: Math.random() * 2 - 1, // Random score between -1 and 1
        confidence: 0.7 + Math.random() * 0.3, // Random confidence 0.7-1.0
        classification: 'neutral' as const
      },
      marketShare: Math.random() * 30 // Random market share 0-30%
    }));

    return {
      industryAverage: {
        score: 0.1,
        confidence: 0.8,
        classification: 'positive'
      },
      competitors: competitorSentiments,
      marketPosition: 'challenger'
    };
  }

  /**
   * Get default comparative analysis when competitors not included
   */
  private getDefaultComparativeAnalysis(): CompetitiveSentiment {
    return {
      industryAverage: {
        score: 0.05,
        confidence: 0.7,
        classification: 'neutral'
      },
      competitors: [],
      marketPosition: 'niche'
    };
  }

  /**
   * Calculate confidence score for the analysis
   */
  private calculateAnalysisConfidence(mentions: MentionSource[], overallSentiment: SentimentScore): number {
    let confidence = 0;

    // Volume confidence - more mentions = higher confidence
    if (mentions.length >= 100) confidence += 0.3;
    else if (mentions.length >= 50) confidence += 0.2;
    else if (mentions.length >= 20) confidence += 0.1;

    // Source diversity confidence
    const uniqueSources = new Set(mentions.map(m => m.source));
    confidence += Math.min(uniqueSources.size * 0.1, 0.3);

    // Time spread confidence
    const timeSpread = this.calculateTimeSpread(mentions);
    confidence += Math.min(timeSpread * 0.2, 0.2);

    // Sentiment confidence
    confidence += overallSentiment.confidence * 0.2;

    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate time spread of mentions (0-1, where 1 is well distributed over time)
   */
  private calculateTimeSpread(mentions: MentionSource[]): number {
    if (mentions.length < 2) return 0;

    const dates = mentions.map(m => m.publishedAt.getTime()).sort((a, b) => a - b);
    const totalSpan = dates[dates.length - 1] - dates[0];
    const daySpan = 24 * 60 * 60 * 1000;

    return Math.min(totalSpan / (30 * daySpan), 1); // Normalize to 30 days max
  }

  /**
   * Monitor sentiment changes over time
   */
  async monitorSentimentTrends(brandName: string, days: number = 7): Promise<TimeSeriesData[]> {
    // This would be used for real-time sentiment monitoring
    // Implementation would involve scheduled analysis and trend detection
    return [];
  }

  /**
   * Generate sentiment report with insights
   */
  async generateSentimentReport(analysis: BrandSentimentAnalysis): Promise<string> {
    const prompt = `Generate a comprehensive sentiment analysis report based on this data:

${JSON.stringify(analysis, null, 2)}

Include:
1. Executive summary of sentiment state
2. Key insights and trends
3. Recommendations for improvement
4. Areas of concern (if any)
5. Competitive positioning insights

Make it actionable and business-focused.`;

    const result = await generateText({
      model: this.model,
      prompt
    });

    return result.text;
  }
}