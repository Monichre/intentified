

import type {
  EnrichmentRequest,
  EnrichmentResult,
  EnrichmentProgress,
  BulkEnrichmentResponse,
 
  EnrichmentType,
  CompanySummaryResult
} from "../domains/enrichment/types";

import { makeCompanyEnrichmentService } from "../domains/enrichment/enrichment.service";

/* ------------------------------------------------------------------ *
 * Pure Service Functions - Stateless, injectable dependencies       *
 * ------------------------------------------------------------------ */

export const wrapEnrichmentResult = async <T>(
  type: EnrichmentType,
  operation: () => Promise<T>
): Promise<EnrichmentResult> => {
  const startTime = Date.now();
  try {
    const data = await operation();
    return {
      type,
      status: 'success',
      data,
      duration: Date.now() - startTime
    };
  } catch (error) {
    return {
      type,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime
    };
  }
};

export const enrichCompanySummaryPureService = async (request: EnrichmentRequest): Promise<EnrichmentResult> => {
  const service = makeCompanyEnrichmentService();
  
  // Execute the enrichment for company summary type only
  const result = await service.enrichCompany({
    ...request,
    enrichmentTypes: ['company-summary']
  });
  
  // Extract the company summary result
  const summaryResult = result.results.find(r => r.type === 'company-summary');
  if (!summaryResult) {
    throw new Error('Failed to enrich company summary');
  }
  
  return summaryResult;
};

export const enrichCompetitorsPureService = async (
  request: EnrichmentRequest, 
  summaryText?: string
): Promise<EnrichmentResult> => {
  const service = makeCompanyEnrichmentService();
  
  // If summaryText is provided, use it directly
  // Otherwise, the service will fetch it internally
  const result = await service.enrichCompany({
    ...request,
    enrichmentTypes: ['competitors']
  });
  
  const competitorsResult = result.results.find(r => r.type === 'competitors');
  if (!competitorsResult) {
    throw new Error('Failed to enrich competitors');
  }
  
  return competitorsResult;
};

export const enrichMindMapPureService = async (
  request: EnrichmentRequest,
  existingData?: {
    summary?: CompanySummaryResult;
    funding?: any;
    competitors?: any;
  }
): Promise<EnrichmentResult> => {
  const service = makeCompanyEnrichmentService();
  
  const result = await service.enrichCompany({
    ...request,
    enrichmentTypes: ['mind-map']
  });
  
  const mindMapResult = result.results.find(r => r.type === 'mind-map');
  if (!mindMapResult) {
    throw new Error('Failed to generate mind map');
  }
  
  return mindMapResult;
};

export const analyzeCompetitiveLandscapePureService = async (
  request: CompetitorAnalysisRequest,
  onProgress?: (progress: CompetitorAnalysisProgress) => void
): Promise<CompetitorAnalysisResponse> => {
  const service = makeCompanyEnrichmentService();
  return service.analyzeCompetitiveLandscape(request, onProgress);
};

export const processCompetitorDataPureService = (
  competitorsData: any,
  companySummary?: any
): any => {
  // Process and enhance competitor data
  if (!competitorsData) return {};
  
  return {
    processedCompetitors: competitorsData,
    enhancedInsights: companySummary ? {
      companyContext: companySummary,
      competitiveAdvantages: extractCompetitiveAdvantages(companySummary, competitorsData)
    } : null
  };
};

// Helper functions for analysis
const generateMarketInsightsPureService = (
  summary: any,
  competitors: any,
  news: any,
  mindMap: any
): CompetitorAnalysisResponse['insights'] => {
  return {
    differentiators: extractDifferentiators(summary, competitors),
    recommendations: generateRecommendations(summary, competitors, news),
    keyTakeaways: extractKeyTakeaways(mindMap)
  };
};

const extractMarketPositionPureService = (summary: any, competitors: any): string => {
  return summary?.marketPosition || 'Emerging player';
};

const extractCompanyNamePureService = (summary: any): string => {
  return summary?.companyName || 'Your Company';
};

const extractStrengths = (summary: any): string[] => {
  return summary?.strengths || [];
};

const extractOpportunitiesPureService = (summary: any, competitors: any): string[] => {
  return [];
};

const extractDifferentiatorsPureService = (summary: any, competitors: any): string[] => {
  return [];
};

const generateRecommendationsPureService = (summary: any, competitors: any, news: any): string[] => {
  return [];
};

const extractKeyTakeaways = (mindMap: any): string[] => {
  return mindMap?.keyInsights || [];
};

const extractCompetitiveAdvantages = (summary: any, competitors: any): string[] => {
  return [];
};

/* ------------------------------------------------------------------ *
 * Pure Service Functions for Enrichment Capabilities                 *
 * ------------------------------------------------------------------ */

/**
 * Enriches company summary information from a website URL
 * @param request - The enrichment request containing website URL
 * @returns Promise<EnrichmentResult> - The enriched company summary data
 */
export async function enrichCompanySummary(
  request: EnrichmentRequest,
  onProgress?: (progress: EnrichmentProgress) => void
): Promise<EnrichmentResult> {
  const service = makeCompanyEnrichmentService();
  
  // Execute the enrichment for company summary type only
  const result = await service.enrichCompany({
    ...request,
    enrichmentTypes: ['company-summary']
  }, onProgress);
  
  // Extract the company summary result
  const summaryResult = result.results.find(r => r.type === 'company-summary');
  if (!summaryResult) {
    throw new Error('Failed to enrich company summary');
  }
  
  return summaryResult;
}

/**
 * Enriches competitor information for a company
 * @param request - The enrichment request containing website URL
 * @param summaryText - Optional pre-computed summary text to avoid re-fetching
 * @returns Promise<EnrichmentResult> - The enriched competitor data
 */
export async function enrichCompetitors(
  request: EnrichmentRequest, 
  summaryText?: string,
  onProgress?: (progress: EnrichmentProgress) => void
): Promise<EnrichmentResult> {
  const service = makeCompanyEnrichmentService();
  
  // If summaryText is provided, use it directly
  // Otherwise, the service will fetch it internally
  const result = await service.enrichCompany({
    ...request,
    enrichmentTypes: ['competitors']
  }, onProgress);
  
  const competitorsResult = result.results.find(r => r.type === 'competitors');
  if (!competitorsResult) {
    throw new Error('Failed to enrich competitors');
  }
  
  return competitorsResult;
}

/**
 * Generates a mind map for a company based on various data points
 * @param request - The enrichment request containing website URL
 * @param existingData - Optional pre-computed data to avoid re-fetching
 * @returns Promise<EnrichmentResult> - The generated mind map data
 */
export async function enrichMindMap(
  request: EnrichmentRequest,
  existingData?: {
    summary?: CompanySummaryResult;
    funding?: any;
    competitors?: any;
  },
  onProgress?: (progress: EnrichmentProgress) => void
): Promise<EnrichmentResult> {
  const service = makeCompanyEnrichmentService();
  
  const result = await service.enrichCompany({
    ...request,
    enrichmentTypes: ['mind-map']
  }, onProgress);
  
  const mindMapResult = result.results.find(r => r.type === 'mind-map');
  if (!mindMapResult) {
    throw new Error('Failed to generate mind map');
  }
  
  return mindMapResult;
}

/**
 * Performs comprehensive competitive landscape analysis
 * @param request - The competitor analysis request
 * @param onProgress - Optional callback for progress updates
 * @returns Promise<CompetitorAnalysisResponse> - The complete competitive analysis
 */
export async function analyzeCompetitiveLandscape(
  request: CompetitorAnalysisRequest,
  onProgress?: (progress: CompetitorAnalysisProgress) => void
): Promise<CompetitorAnalysisResponse> {
  const service = makeCompanyEnrichmentService();
  return service.analyzeCompetitiveLandscape(request, onProgress);
}

/**
 * Performs bulk enrichment with multiple enrichment types
 * @param request - The enrichment request with optional types array
 * @param onProgress - Optional callback for progress updates
 * @returns Promise<BulkEnrichmentResponse> - The complete enrichment results
 */
export async function enrichCompanyBulk(
  request: EnrichmentRequest,
  onProgress?: (progress: EnrichmentProgress) => void
): Promise<BulkEnrichmentResponse> {
  const service = makeCompanyEnrichmentService();
  return service.enrichCompany(request, onProgress);
}

/* ------------------------------------------------------------------ *
 * Helper Functions                                                   *
 * ------------------------------------------------------------------ */

/**
 * Validates an enrichment request
 * @param request - The request to validate
 * @throws Error if request is invalid
 */
export function validateEnrichmentRequest(request: EnrichmentRequest): void {
  if (!request.websiteUrl) {
    throw new Error('Website URL is required');
  }
  
  // Validate URL format
  try {
    new URL(request.websiteUrl);
  } catch (error) {
    throw new Error('Invalid website URL format');
  }
}

/**
 * Gets the default enrichment types for a given analysis type
 * @param analysisType - The type of analysis being performed
 * @returns Array of enrichment types
 */
export function getDefaultEnrichmentTypes(analysisType: 'marketing' | 'competitor' | 'full'): string[] {
  switch (analysisType) {
    case 'marketing':
      return [
        'basic-info',
        'company-summary',
        'competitors',
        'funding',
        'news',
        'linkedin',
        'founders',
        'website-sub-pages',
      ];
    case 'competitor':
      return [
        'basic-info',
        'company-summary',
        'competitors',
        'mind-map',
        'news',
        'website-sub-pages',
        'competitive-analysis'
      ];
    case 'full':
    default:
      return [
        'basic-info',
        'company-summary',
        'funding',
        'competitors',
        'mind-map',
        'linkedin',
        'founders',
        'crunchbase',
        'news',
        'website-sub-pages',
        'competitive-analysis',
      ];
  }
} 