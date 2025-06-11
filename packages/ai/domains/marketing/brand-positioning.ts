/**
 * Brand Positioning Analyzer Service
 * Implements competitive brand positioning analysis and market gap identification
 */

import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type {
  BrandPositioningAnalysis,
  PositioningMap,
  PositioningDimension,
  Position,
  CompetitorPosition,
  Differentiator,
  CompetitorComparison,
  MarketGap,
  Recommendation
} from './types';
import { formatPrompt } from './prompts';

// Zod schemas for validation
const PositionSchema = z.object({
  x: z.number().min(-1).max(1),
  y: z.number().min(-1).max(1),
  dimensions: z.array(z.string())
});

const PositioningDimensionSchema = z.object({
  name: z.string(),
  lowLabel: z.string(),
  highLabel: z.string(),
  importance: z.number().min(0).max(1)
});

const CompetitorPositionSchema = z.object({
  name: z.string(),
  position: PositionSchema,
  marketShare: z.number().optional()
});

const DifferentiatorSchema = z.object({
  factor: z.string(),
  strength: z.number().min(0).max(1),
  uniqueness: z.number().min(0).max(1),
  marketValue: z.number().min(0).max(1)
});

const MarketGapSchema = z.object({
  opportunity: z.string(),
  size: z.number().min(0).max(1),
  difficulty: z.number().min(0).max(1),
  timeline: z.enum(['immediate', 'short-term', 'medium-term', 'long-term'])
});

const RecommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  impact: z.number().min(0).max(1),
  effort: z.number().min(0).max(1),
  timeline: z.string(),
  dependencies: z.array(z.string()).optional()
});

export interface PositioningAnalysisOptions {
  brandName: string;
  industry: string;
  websiteUrl?: string;
  competitors?: string[];
  targetAudience?: string[];
  maxCompetitors?: number;
  onProgress?: (progress: { phase: string; progress: number; message: string }) => void;
}

export interface CompetitorProfile {
  name: string;
  website: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketPosition: string;
  targetAudience: string[];
  keyMessages: string[];
  pricing?: string;
  marketShare?: number;
}

export interface PositioningAnalysisResult {
  analysis: BrandPositioningAnalysis;
  competitorProfiles: CompetitorProfile[];
  metadata: {
    processingTime: number;
    competitorsAnalyzed: number;
    dataSourcesUsed: string[];
    confidenceScore: number;
  };
}

export class BrandPositioningService {
  private model = anthropic('claude-3-5-sonnet-20241022');

  /**
   * Analyze brand positioning against competitors and market
   */
  async analyzeBrandPositioning(options: PositioningAnalysisOptions): Promise<PositioningAnalysisResult> {
    const startTime = Date.now();
    const { brandName, industry, onProgress } = options;

    try {
      // Step 1: Identify and research competitors
      onProgress?.({ phase: 'research', progress: 10, message: 'Identifying competitors...' });
      const competitors = await this.identifyCompetitors(brandName, industry, options.competitors);
      
      // Step 2: Analyze competitor profiles
      onProgress?.({ phase: 'analysis', progress: 25, message: 'Analyzing competitor profiles...' });
      const competitorProfiles = await this.analyzeCompetitorProfiles(competitors);

      // Step 3: Analyze brand profile
      onProgress?.({ phase: 'analysis', progress: 40, message: 'Analyzing brand profile...' });
      const brandProfile = await this.analyzeBrandProfile(brandName, options.websiteUrl, industry);

      // Step 4: Identify positioning dimensions
      onProgress?.({ phase: 'positioning', progress: 55, message: 'Identifying positioning dimensions...' });
      const positioningDimensions = await this.identifyPositioningDimensions(industry, competitorProfiles, brandProfile);

      // Step 5: Generate positioning map
      onProgress?.({ phase: 'positioning', progress: 70, message: 'Generating positioning map...' });
      const positioningMap = await this.generatePositioningMap(positioningDimensions, competitorProfiles, brandProfile);

      // Step 6: Identify differentiators
      onProgress?.({ phase: 'analysis', progress: 80, message: 'Identifying differentiators...' });
      const keyDifferentiators = await this.identifyDifferentiators(brandProfile, competitorProfiles);

      // Step 7: Find market gaps
      onProgress?.({ phase: 'opportunities', progress: 90, message: 'Identifying market gaps...' });
      const marketGaps = await this.identifyMarketGaps(industry, competitorProfiles, positioningMap);

      // Step 8: Generate recommendations
      onProgress?.({ phase: 'recommendations', progress: 95, message: 'Generating recommendations...' });
      const recommendations = await this.generatePositioningRecommendations(
        brandProfile,
        competitorProfiles,
        marketGaps,
        keyDifferentiators
      );

      onProgress?.({ phase: 'complete', progress: 100, message: 'Positioning analysis complete!' });

      const analysis: BrandPositioningAnalysis = {
        positioningMap,
        keyDifferentiators,
        competitorComparison: {
          competitors: competitorProfiles.map(cp => ({
            name: cp.name,
            website: cp.website,
            strengths: cp.strengths,
            weaknesses: cp.weaknesses,
            marketPosition: cp.marketPosition,
            targetAudience: cp.targetAudience
          })),
          comparisonMatrix: await this.generateComparisonMatrix(brandProfile, competitorProfiles)
        },
        marketGaps,
        positioningRecommendations: recommendations
      };

      return {
        analysis,
        competitorProfiles,
        metadata: {
          processingTime: Date.now() - startTime,
          competitorsAnalyzed: competitorProfiles.length,
          dataSourcesUsed: ['web-research', 'ai-analysis', 'industry-data'],
          confidenceScore: this.calculatePositioningConfidence(analysis, competitorProfiles)
        }
      };

    } catch (error) {
      throw new Error(`Positioning analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Identify key competitors in the market
   */
  private async identifyCompetitors(
    brandName: string,
    industry: string,
    providedCompetitors?: string[]
  ): Promise<string[]> {
    if (providedCompetitors && providedCompetitors.length > 0) {
      return providedCompetitors.slice(0, 10); // Limit to 10 competitors
    }

    const prompt = `Identify the top 5-8 direct competitors for ${brandName} in the ${industry} industry. 
    Focus on companies that:
    1. Serve similar target audiences
    2. Offer similar products/services
    3. Compete for the same market segment
    4. Are well-known in the industry
    
    Return only company names, one per line.`;

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        competitors: z.array(z.string())
      }),
      prompt
    });

    return result.object.competitors.slice(0, 8);
  }

  /**
   * Analyze competitor profiles in detail
   */
  private async analyzeCompetitorProfiles(competitors: string[]): Promise<CompetitorProfile[]> {
    const profiles: CompetitorProfile[] = [];

    for (const competitor of competitors) {
      const profile = await this.analyzeCompetitorProfile(competitor);
      if (profile) {
        profiles.push(profile);
      }
    }

    return profiles;
  }

  /**
   * Analyze a single competitor profile
   */
  private async analyzeCompetitorProfile(competitorName: string): Promise<CompetitorProfile | null> {
    try {
      const prompt = `Analyze the brand positioning and profile for ${competitorName}. Provide:
      1. Company description and main value proposition
      2. Key strengths and competitive advantages
      3. Notable weaknesses or gaps
      4. Market position (leader/challenger/follower/niche)
      5. Target audience characteristics
      6. Key marketing messages
      7. Pricing strategy (if known)
      8. Estimated market share (if known)
      
      Base your analysis on publicly available information and industry knowledge.`;

      const result = await generateObject({
        model: this.model,
        schema: z.object({
          name: z.string(),
          website: z.string().optional(),
          description: z.string(),
          strengths: z.array(z.string()),
          weaknesses: z.array(z.string()),
          marketPosition: z.string(),
          targetAudience: z.array(z.string()),
          keyMessages: z.array(z.string()),
          pricing: z.string().optional(),
          marketShare: z.number().optional()
        }),
        prompt
      });

      return {
        ...result.object,
        name: competitorName,
        website: result.object.website || `https://${competitorName.toLowerCase().replace(/\s+/g, '')}.com`
      };

    } catch (error) {
      console.error(`Failed to analyze competitor ${competitorName}:`, error);
      return null;
    }
  }

  /**
   * Analyze the brand's own profile
   */
  private async analyzeBrandProfile(
    brandName: string,
    websiteUrl?: string,
    industry?: string
  ): Promise<CompetitorProfile> {
    const prompt = `Analyze the brand positioning and profile for ${brandName}${industry ? ` in the ${industry} industry` : ''}${websiteUrl ? ` (website: ${websiteUrl})` : ''}. 
    
    Provide the same analysis as you would for a competitor:
    1. Company description and main value proposition
    2. Key strengths and competitive advantages  
    3. Notable weaknesses or gaps
    4. Current market position
    5. Target audience characteristics
    6. Key marketing messages
    7. Pricing strategy
    
    Be objective and thorough in your analysis.`;

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        name: z.string(),
        website: z.string().optional(),
        description: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        marketPosition: z.string(),
        targetAudience: z.array(z.string()),
        keyMessages: z.array(z.string()),
        pricing: z.string().optional()
      }),
      prompt
    });

    return {
      ...result.object,
      name: brandName,
      website: websiteUrl || result.object.website || ''
    };
  }

  /**
   * Identify key positioning dimensions for the market
   */
  private async identifyPositioningDimensions(
    industry: string,
    competitors: CompetitorProfile[],
    brand: CompetitorProfile
  ): Promise<PositioningDimension[]> {
    const allProfiles = [...competitors, brand];
    const prompt = `Based on this ${industry} market analysis, identify the 4-6 most important positioning dimensions that differentiate brands:

    ${allProfiles.map(p => `${p.name}: ${p.description}\nStrengths: ${p.strengths.join(', ')}\nTarget: ${p.targetAudience.join(', ')}`).join('\n\n')}

    For each dimension, provide:
    - Name of the dimension
    - Low end label (what represents the low end of this dimension)
    - High end label (what represents the high end)
    - Importance score (0-1, how important this dimension is for market differentiation)

    Examples of positioning dimensions: Price vs Premium, Simple vs Complex, Traditional vs Innovative, Broad vs Specialized, etc.`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(PositioningDimensionSchema),
      prompt
    });

    return result.object.slice(0, 6); // Limit to 6 dimensions max
  }

  /**
   * Generate positioning map with brand and competitor positions
   */
  private async generatePositioningMap(
    dimensions: PositioningDimension[],
    competitors: CompetitorProfile[],
    brand: CompetitorProfile
  ): Promise<PositioningMap> {
    // Select top 2 most important dimensions for X and Y axes
    const sortedDimensions = dimensions.sort((a, b) => b.importance - a.importance);
    const xDimension = sortedDimensions[0];
    const yDimension = sortedDimensions[1];

    const allProfiles = [...competitors, brand];
    
    const prompt = `Position each brand on a 2D map using these dimensions:
    X-axis: ${xDimension.name} (${xDimension.lowLabel} = -1, ${xDimension.highLabel} = 1)
    Y-axis: ${yDimension.name} (${yDimension.lowLabel} = -1, ${yDimension.highLabel} = 1)

    Brands to position:
    ${allProfiles.map(p => `${p.name}: ${p.description}\nStrengths: ${p.strengths.join(', ')}`).join('\n\n')}

    For each brand, provide X and Y coordinates between -1 and 1.`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(z.object({
        name: z.string(),
        x: z.number().min(-1).max(1),
        y: z.number().min(-1).max(1)
      })),
      prompt
    });

    // Separate brand and competitor positions
    const brandPosition = result.object.find(p => p.name === brand.name);
    const competitorPositions = result.object.filter(p => p.name !== brand.name);

    return {
      dimensions: [xDimension, yDimension],
      brandPosition: {
        x: brandPosition?.x || 0,
        y: brandPosition?.y || 0,
        dimensions: [xDimension.name, yDimension.name]
      },
      competitorPositions: competitorPositions.map(cp => ({
        name: cp.name,
        position: {
          x: cp.x,
          y: cp.y,
          dimensions: [xDimension.name, yDimension.name]
        },
        marketShare: competitors.find(c => c.name === cp.name)?.marketShare
      }))
    };
  }

  /**
   * Identify key differentiating factors
   */
  private async identifyDifferentiators(
    brand: CompetitorProfile,
    competitors: CompetitorProfile[]
  ): Promise<Differentiator[]> {
    const prompt = `Analyze what makes ${brand.name} unique compared to these competitors:

    ${brand.name}:
    Description: ${brand.description}
    Strengths: ${brand.strengths.join(', ')}
    Key Messages: ${brand.keyMessages.join(', ')}

    Competitors:
    ${competitors.map(c => `${c.name}: ${c.description}\nStrengths: ${c.strengths.join(', ')}`).join('\n\n')}

    Identify the top 5-8 differentiating factors for ${brand.name}. For each factor:
    - Strength: How strong is this differentiator (0-1)
    - Uniqueness: How unique compared to competitors (0-1)  
    - Market Value: How much customers value this (0-1)`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(DifferentiatorSchema),
      prompt
    });

    return result.object.slice(0, 8);
  }

  /**
   * Identify market gaps and opportunities
   */
  private async identifyMarketGaps(
    industry: string,
    competitors: CompetitorProfile[],
    positioningMap: PositioningMap
  ): Promise<MarketGap[]> {
    const prompt = `Analyze the ${industry} market for gaps and opportunities based on current competitive landscape:

    Current Players:
    ${competitors.map(c => `${c.name}: ${c.description}\nPosition: ${c.marketPosition}\nTarget: ${c.targetAudience.join(', ')}`).join('\n\n')}

    Positioning Map Analysis:
    X-axis: ${positioningMap.dimensions[0]?.name}
    Y-axis: ${positioningMap.dimensions[1]?.name}
    
    Competitor positions: ${positioningMap.competitorPositions.map(cp => `${cp.name}: (${cp.position.x}, ${cp.position.y})`).join(', ')}

    Identify 5-8 market gaps or opportunities. For each:
    - Opportunity description
    - Market size potential (0-1)
    - Difficulty to capture (0-1)
    - Timeline to address (immediate, short-term, medium-term, long-term)`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(MarketGapSchema),
      prompt
    });

    return result.object.slice(0, 8);
  }

  /**
   * Generate positioning recommendations
   */
  private async generatePositioningRecommendations(
    brand: CompetitorProfile,
    competitors: CompetitorProfile[],
    marketGaps: MarketGap[],
    differentiators: Differentiator[]
  ): Promise<Recommendation[]> {
    const prompt = `Generate strategic positioning recommendations for ${brand.name} based on this analysis:

    Current Brand Profile:
    ${brand.description}
    Strengths: ${brand.strengths.join(', ')}
    Weaknesses: ${brand.weaknesses.join(', ')}

    Key Differentiators:
    ${differentiators.map(d => `${d.factor} (Strength: ${d.strength}, Uniqueness: ${d.uniqueness})`).join('\n')}

    Market Gaps:
    ${marketGaps.map(g => `${g.opportunity} (Size: ${g.size}, Difficulty: ${g.difficulty})`).join('\n')}

    Provide 5-8 actionable recommendations to strengthen positioning. For each:
    - Clear title and description
    - Priority level (high/medium/low)
    - Expected impact (0-1)
    - Required effort (0-1)
    - Timeline estimate
    - Dependencies (if any)`;

    const result = await generateObject({
      model: this.model,
      schema: z.array(RecommendationSchema),
      prompt
    });

    return result.object.slice(0, 8);
  }

  /**
   * Generate comparison matrix for competitive analysis
   */
  private async generateComparisonMatrix(
    brand: CompetitorProfile,
    competitors: CompetitorProfile[]
  ) {
    // Key metrics to compare across all brands
    const metrics = [
      'Product Quality',
      'Pricing',
      'Brand Recognition',
      'Customer Service',
      'Innovation',
      'Market Presence',
      'User Experience',
      'Technical Capabilities'
    ];

    const allBrands = [brand, ...competitors];
    const comparisonMatrix = [];

    for (const metric of metrics) {
      const scores: Record<string, number> = {};
      
      // Generate scores for each brand on this metric
      const prompt = `Rate each brand on "${metric}" from 1-10 based on market perception and capabilities:

      ${allBrands.map(b => `${b.name}: ${b.description}\nStrengths: ${b.strengths.join(', ')}`).join('\n\n')}

      Provide objective scores based on industry knowledge and competitive analysis.`;

      try {
        const result = await generateObject({
          model: this.model,
          schema: z.object({
            scores: z.array(z.object({
              brand: z.string(),
              score: z.number().min(1).max(10)
            }))
          }),
          prompt
        });

        result.object.scores.forEach(({ brand: brandName, score }) => {
          scores[brandName] = score;
        });

        comparisonMatrix.push({
          metric,
          brandScore: scores[brand.name] || 5,
          competitorScores: scores,
          importance: this.getMetricImportance(metric) // Helper to assign importance
        });

      } catch (error) {
        // Fallback to default scores if AI generation fails
        allBrands.forEach(b => {
          scores[b.name] = 5; // Default neutral score
        });

        comparisonMatrix.push({
          metric,
          brandScore: 5,
          competitorScores: scores,
          importance: 0.5
        });
      }
    }

    return comparisonMatrix;
  }

  /**
   * Helper to assign importance scores to metrics
   */
  private getMetricImportance(metric: string): number {
    const importanceMap: Record<string, number> = {
      'Product Quality': 0.9,
      'Pricing': 0.8,
      'Brand Recognition': 0.7,
      'Customer Service': 0.8,
      'Innovation': 0.7,
      'Market Presence': 0.6,
      'User Experience': 0.8,
      'Technical Capabilities': 0.6
    };

    return importanceMap[metric] || 0.5;
  }

  /**
   * Calculate confidence score for positioning analysis
   */
  private calculatePositioningConfidence(
    analysis: BrandPositioningAnalysis,
    competitors: CompetitorProfile[]
  ): number {
    let confidence = 0;

    // Competitor coverage confidence
    if (competitors.length >= 5) confidence += 0.3;
    else if (competitors.length >= 3) confidence += 0.2;
    else confidence += 0.1;

    // Data richness confidence
    const avgStrengthsPerCompetitor = competitors.reduce((sum, c) => sum + c.strengths.length, 0) / competitors.length;
    if (avgStrengthsPerCompetitor >= 4) confidence += 0.2;
    else if (avgStrengthsPerCompetitor >= 2) confidence += 0.1;

    // Analysis depth confidence
    if (analysis.keyDifferentiators.length >= 5) confidence += 0.2;
    if (analysis.marketGaps.length >= 4) confidence += 0.15;
    if (analysis.positioningRecommendations.length >= 5) confidence += 0.15;

    return Math.min(confidence, 1.0);
  }

  /**
   * Monitor positioning changes over time
   */
  async trackPositioningChanges(
    brandName: string,
    industry: string,
    previousAnalysis: BrandPositioningAnalysis
  ): Promise<{ changes: string[]; recommendations: string[] }> {
    // This would compare current vs previous analysis to track movement
    // Implementation would involve periodic re-analysis and change detection
    return {
      changes: [],
      recommendations: []
    };
  }

  /**
   * Generate positioning strategy report
   */
  async generatePositioningReport(analysis: BrandPositioningAnalysis, brandName: string): Promise<string> {
    const prompt = `Generate a comprehensive brand positioning strategy report for ${brandName} based on this analysis:

    ${JSON.stringify(analysis, null, 2)}

    Include:
    1. Executive summary of current positioning
    2. Competitive landscape overview
    3. Key differentiators and strengths
    4. Market opportunities identified
    5. Strategic recommendations with priorities
    6. Implementation roadmap
    7. Success metrics to track

    Make it strategic, actionable, and business-focused.`;

    const result = await generateText({
      model: this.model,
      prompt
    });

    return result.text;
  }
}