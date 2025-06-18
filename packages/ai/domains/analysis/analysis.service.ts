import {
  type CompetitorAnalysisRequest,
  type CompetitorAnalysisProgress,
  type CompetitorAnalysisResponse,
  type EnrichmentType,
  ALL_ENRICHMENT_TYPES
} from '../../core/schemas/enrichment.schema';

import { insights } from "../../services/insights";
import { exaResearch } from "../../integrations/exa/exa-research";
import { exaService } from "../../integrations/exa";
import { takeScreenshot } from "../../integrations/screenshot";

const exaR = exaResearch(exaService);

// --- Modular Competitive Analysis ---
export const analyzeCompetitiveLandscape = async (
  req: CompetitorAnalysisRequest,
  onProgress?: (p: CompetitorAnalysisProgress) => void
): Promise<CompetitorAnalysisResponse> => {
  const startTime = Date.now();
  const requestId = `competitor-analysis-${Date.now()}`;

  // Focused subset of enrichment types
  const COMPETITOR_ANALYSIS_TYPES: EnrichmentType[] = [
    'basic-info',
    'company-summary',
    'competitors',
    'mind-map',
    'news',
    'website-sub-pages'
  ];
  const completedSteps: string[] = [];

  // Progress reporting
  const reportProgress = (message: string, currentType?: string) => {
    if (onProgress) {
      onProgress({
        requestId,
        currentStep: completedSteps.length,
        totalSteps: COMPETITOR_ANALYSIS_TYPES.length,
        currentType,
        message,
        isComplete: completedSteps.length === COMPETITOR_ANALYSIS_TYPES.length
      });
    }
  };

  try {
    reportProgress('Starting competitive landscape analysis...', 'initialization');
    // Step 1: Get basic info and website content
    reportProgress('Analyzing company website...', 'basic-info');
    const [main, sub] = await Promise.all([
      exaR.scrapeWebsiteUrl(req),
      exaR.scrapeWebsiteSubPages(req)
    ]);
    completedSteps.push('basic-info', 'website-sub-pages');
    // Step 2: Generate company summary
    reportProgress('Understanding company positioning...', 'company-summary');
    const screenshot = req?.skipScreenshot
      ? undefined
      : await takeScreenshot({
          url: req.websiteUrl,
          fullPage: true,
          format: 'webp',
          blockAds: true,
          blockCookieBanners: true,
          blockTrackers: true,
          prefersColorScheme: 'light',
          viewportWidth: 1920,
          viewportHeight: 1080
        });
    const insightsSummary = await insights.summary({
      mainpage: main,
      subpages: sub,
      websiteUrl: req.websiteUrl
    });
    completedSteps.push('company-summary');
    // Step 3: Find competitors
    reportProgress('Identifying competitors...', 'competitors');
    const competitorsData = await exaR.findCompetitors({
      websiteUrl: req.websiteUrl,
      summaryText: insightsSummary.sections.map((s: any) => s.text).join(' ')
    });
    completedSteps.push('competitors');
    // Step 4: Get recent news for context
    reportProgress('Gathering market intelligence...', 'news');
    const newsData = await exaR.findNews(req);
    completedSteps.push('news');
    // Step 5: Generate mind map with competitive insights
    reportProgress('Analyzing competitive positioning...', 'mind-map');
    const mindMapData = await insights.mindMap({
      companySummary: insightsSummary,
      mainpage: main,
      websiteUrl: req.websiteUrl,
      subpages: sub,
      funding: null, // Skip funding for faster analysis
      competitors: competitorsData
    });
    completedSteps.push('mind-map');
    // Process and structure the response
    const competitiveLandscape = processCompetitorData(competitorsData, insightsSummary);
    const marketInsights = generateMarketInsights(
      insightsSummary,
      competitorsData,
      newsData,
      mindMapData
    );
    reportProgress('Analysis complete!');
    return {
      websiteUrl: req.websiteUrl,
      requestId,
      company: {
        name: req.companyName || extractCompanyName(insightsSummary),
        summary: insightsSummary.sections.find((s: any) => s.header === 'Company Overview')?.text || '',
        positioning: insightsSummary.sections.find((s: any) => s.header === 'Market Position')?.text || '',
        screenshot: screenshot as string | undefined
      },
      competitiveLandscape,
      insights: marketInsights,
      summary: {
        totalAnalyzed: COMPETITOR_ANALYSIS_TYPES.length,
        successful: completedSteps.length,
        failed: COMPETITOR_ANALYSIS_TYPES.length - completedSteps.length,
        totalDuration: Date.now() - startTime
      }
    };
  } catch (error) {
    console.error('Competitor analysis error:', error);
    throw error;
  }
};

// Helper functions tightly coupled to analysis
function processCompetitorData(
  competitorsData: any,
  companySummary: any
): CompetitorAnalysisResponse['competitiveLandscape'] {
  const competitors = Array.isArray(competitorsData) ? competitorsData : [];
  return {
    directCompetitors: competitors.slice(0, 5).map(comp => ({
      name: comp.name || 'Unknown',
      url: comp.url || '',
      description: comp.description || '',
      strengths: comp.strengths || []
    })),
    marketPosition: {
      rank: 'Analyzing...',
      marketShare: undefined,
      growthTrend: undefined
    },
    strengths: extractStrengths(companySummary),
    opportunities: extractOpportunities(companySummary, competitors)
  };
}

function generateMarketInsights(
  summary: any,
  competitors: any,
  news: any,
  mindMap: any
): CompetitorAnalysisResponse['insights'] {
  return {
    differentiators: extractDifferentiators(summary, competitors),
    recommendations: generateRecommendations(summary, competitors, news),
    keyTakeaways: extractKeyTakeaways(mindMap)
  };
}

function extractCompanyName(summary: any): string {
  return summary.companyName || 'Your Company';
}
function extractStrengths(summary: any): string[] {
  return summary.strengths || [];
}
function extractOpportunities(summary: any, competitors: any): string[] {
  return [];
}
function extractDifferentiators(summary: any, competitors: any): string[] {
  return [];
}
function generateRecommendations(summary: any, competitors: any, news: any): string[] {
  return [];
}
function extractKeyTakeaways(mindMap: any): string[] {
  return mindMap?.keyInsights || [];
}



/* ------------------------------------------------------------------ *
 * High-level orchestrator – pure, deterministic, stream-friendly      *
 * ------------------------------------------------------------------ */


export const makeCompanyEnrichmentService = () => {
  const exaR = exaResearch(exaService);
  

  /* ------------------------------------------------------------------ *
   * Unified result wrapper for all enrichment operations              *
   * ------------------------------------------------------------------ */
  
  const wrapEnrichmentResult = async <T>(
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

 

  /* ------------------------------------------------------------------ *
   * Specialized enrichment functions (only for complex operations)     *
   * ------------------------------------------------------------------ */

  const enrichCompanySummary = async (request: EnrichmentRequest): Promise<EnrichmentResult> => {
    return wrapEnrichmentResult('company-summary', async () => {
      const main = await exaR.scrapeWebsiteUrl(request);
      const screenshot = await takeScreenshot({url: request.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080});
      console.log(screenshot);
      // const doc = await pdf(request.websiteUrl);
      // console.log(doc);
      // const webContent = await content(request.websiteUrl);
      // console.log(webContent);
      // const meta = await metadata(request.websiteUrl);
      // console.log(meta);
      const sub = await exaR.scrapeWebsiteSubPages(request);
 
      
      const insightsSummary = await insights.summary({
        mainpage: main,
        subpages: sub,
        websiteUrl: request.websiteUrl
      });

      return {
        screenshot,
        ...insightsSummary
      }
    });
  };

  const enrichCompetitors = async (request: EnrichmentRequest, summaryText?: string): Promise<EnrichmentResult> => {
    return wrapEnrichmentResult('competitors', async () => {
      if (!summaryText) {
        const main = await exaR.scrapeWebsiteUrl(request);
        const sub = await exaR.scrapeWebsiteSubPages(request);
        const summary = await insights.summary({
          mainpage: main,
          subpages: sub,
          websiteUrl: request.websiteUrl
        });
        summaryText = summary.sections.map((s: any) => s.text).join(' ');
      }
      
      return exaR.findCompetitors({
        websiteUrl: request.websiteUrl,
        summaryText: summaryText || ''
      });
    });
  };

  const enrichMindMap = async (
    request: EnrichmentRequest, 
    existingData?: {
      summary?: CompanySummaryResult;
      funding?: any;
      competitors?: any;
    }
  ): Promise<EnrichmentResult> => {
    return wrapEnrichmentResult('mind-map', async () => {
      const main = await exaR.scrapeWebsiteUrl(request);
      const sub = await exaR.scrapeWebsiteSubPages(request);
      
      const summary = existingData?.summary || await insights.summary({
        mainpage: main,
        subpages: sub,
        websiteUrl: request.websiteUrl
      });
      
      const funding = existingData?.funding || await exaR.fetchFunding(request);
      const competitors = existingData?.competitors || await exaR.findCompetitors({
        websiteUrl: request.websiteUrl,
        summaryText: summary.sections.map((s: any) => s.text).join(' ')
      });
      
      return insights.mindMap({
        companySummary: summary,
        mainpage: main,
        websiteUrl: request.websiteUrl,
        subpages: sub,
        funding,
        competitors
      });
    });
  };

  /* ------------------------------------------------------------------ *
   * Direct mappings to exa.api functions (simple wrappers)            *
   * ------------------------------------------------------------------ */

  // Map enrichment types to their corresponding functions
  const ENRICHMENT_TYPE_TO_FUNCTION: Record<EnrichmentType, (req: EnrichmentRequest, ...args: any[]) => Promise<EnrichmentResult>> = {
    // Simple direct mappings to exa.api functions
    'basic-info': (req) => wrapEnrichmentResult('basic-info', () => exaR.scrapeWebsiteUrl(req)),
    'funding': (req) => wrapEnrichmentResult('funding', () => exaR.fetchFunding(req)),
    'linkedin': (req, profile?: string) => wrapEnrichmentResult('linkedin', () => {
      if (!profile) throw new Error('LinkedIn profile required');
      return exaR.scrapeLinkedin({websiteUrl: req.websiteUrl, profile});
    }),
    'founders': (req) => wrapEnrichmentResult('founders', () => exaR.fetchFounders(req)),
    'crunchbase': (req) => wrapEnrichmentResult('crunchbase', () => exaR.fetchCrunchbase(req)),
    'news': (req) => wrapEnrichmentResult('news', () => exaR.findNews(req)),
    
    // Complex operations using specialized functions
    'company-summary': enrichCompanySummary,
    'competitors': enrichCompetitors,
    'mind-map': enrichMindMap,
    
    // Direct mappings for remaining exa.api functions
    'financial-report': (req) => wrapEnrichmentResult('financial-report', () => exaR.fetchFinancialReport(req)),
    'github-url': (req) => wrapEnrichmentResult('github-url', () => exaR.fetchGithubUrl(req)),
    'pitchbook': (req) => wrapEnrichmentResult('pitchbook', () => exaR.fetchPitchbook(req)),
    'tiktok': (req) => wrapEnrichmentResult('tiktok', () => exaR.fetchTiktok(req)),
    'tracxn': (req) => wrapEnrichmentResult('tracxn', () => exaR.fetchTracxn(req)),
    'wikipedia': (req) => wrapEnrichmentResult('wikipedia', () => exaR.fetchWikipedia(req)),
    'youtube-videos': (req) => wrapEnrichmentResult('youtube-videos', () => exaR.fetchYoutubeVideos(req)),
    'recent-tweets': (req, profile?: string) => {
      // Note: This requires username extraction from website
      return wrapEnrichmentResult('recent-tweets', async () => {
        if (!profile) throw new Error('Twitter profile required');
        const [twitterProfile, recentTweets] = await Promise.all([
          exaR.scrapeTwitterProfile({profile, websiteUrl: req.websiteUrl}),
          exaR.scrapeRecentTweets({profile, websiteUrl: req.websiteUrl})
        ]);
        return {
          twitterProfile,
          recentTweets
        };
      });
    },
    'reddit': (req) => wrapEnrichmentResult('reddit', () => exaR.scrapeReddit(req)),
    'twitter-profile': (req, profile?: string) => {
      // Note: This requires username extraction from website
      return wrapEnrichmentResult('twitter-profile', () => {
        if (!profile) throw new Error('Username required for Twitter operations');
        return exaR.scrapeTwitterProfile({profile, websiteUrl: req.websiteUrl});
      });
    },
    'website-sub-pages': (req) => wrapEnrichmentResult('website-sub-pages', () => exaR.scrapeWebsiteSubPages(req)),
    'website-url': (req) => wrapEnrichmentResult('website-url', () => exaR.scrapeWebsiteUrl(req)),
    'youtube-video-details': (req) => {
      // Note: This requires video URL
      return wrapEnrichmentResult('youtube-video-details', () => {
        throw new Error('Video URL required for YouTube video details');
      });
    },
    
  };

  /* ------------------------------------------------------------------ *
   * Parallel orchestration approach (KEEP)                            *
   * ------------------------------------------------------------------ */
  const enrichCompany = async (
    req: EnrichmentRequest,
    onProgress?: (p: EnrichmentProgress) => void
  ): Promise<BulkEnrichmentResponse> => {

    const startTime = Date.now();
    const requestId = req.requestId || `enrich-${Date.now()}`;
    
    // Determine which enrichment types to run
    const typesToRun = ALL_ENRICHMENT_TYPES;
    const completedTypes: EnrichmentType[] = [];

     // Step 1
     const main = await exaR.scrapeWebsiteUrl(req);

     console.log("🚀 ~ makeCompanyEnrichmentService ~ main:", main)

     const sub = await exaR.scrapeWebsiteSubPages(req);

      console.log("🚀 ~ makeCompanyEnrichmentService ~ sub:", sub)

      const screenshot = await takeScreenshot({url: req.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080});
      console.log(screenshot);
 
      // const doc = await pdf(req.websiteUrl);
      // console.log(doc);

   
      const insightsSummary = await insights.summary({
        mainpage: main,
        subpages: sub,
        websiteUrl: req.websiteUrl
      });

      console.log("🚀 ~ makeCompanyEnrichmentService ~ insightsSummary:", insightsSummary)

    
    // Progress reporting helper
    const reportProgress = (currentType?: EnrichmentType) => {
      if (onProgress) {
        onProgress({
          requestId,
          currentStep: completedTypes.length,
          totalSteps: typesToRun.length,
          currentType,
          completedTypes,
          isComplete: completedTypes.length === typesToRun.length
        });
      }
    };

    // Optimize by identifying dependencies and running in phases
    const independentTypes = typesToRun.filter(t => 
      !['competitors', 'mind-map'].includes(t)
    );
    const dependentTypes = typesToRun.filter(t => 
      ['competitors', 'mind-map'].includes(t)
    );

    const allResults: EnrichmentResult[] = [];

    // Phase 1: Run all independent enrichments in parallel
    if (independentTypes.length > 0) {
      const independentPromises = independentTypes.map(async (type) => {
        const fn = ENRICHMENT_TYPE_TO_FUNCTION[type];
        if (!fn) {
          return { type, status: 'skipped' as const, error: 'Enrichment type not implemented' };
        }
        
        reportProgress(type);
        
        try {
          const result = await fn(req);
          completedTypes.push(type);
          reportProgress();
          return result;
        } catch (error) {
          completedTypes.push(type);
          reportProgress();
          return {
            type,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const independentResults = await Promise.allSettled(independentPromises);
      
      // Process independent results
      independentResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(result.value);
        } else {
          allResults.push({
            type: independentTypes[index],
            status: 'error' as const,
            error: result.reason?.message || 'Unknown error'
          });
        }
      });
    }

    // Phase 2: Run dependent enrichments with shared data
    if (dependentTypes.length > 0) {
      // Extract data from phase 1 results for reuse
      const summaryResult = allResults.find(r => r.type === 'company-summary' && r.status === 'success');
      const fundingResult = allResults.find(r => r.type === 'funding' && r.status === 'success');
      const summaryData = summaryResult?.data as CompanySummaryResult | undefined;
      const fundingData = fundingResult?.data;

      const dependentPromises = dependentTypes.map(async (type) => {
        reportProgress(type);
        
        try {
          let result: EnrichmentResult;
          
          if (type === 'competitors') {
            // Use existing summary if available
            const summaryText = summaryData ? 
              summaryData.sections.map((s: any) => s.text).join(' ') : 
              undefined;
            result = await enrichCompetitors(req, summaryText);
          } else if (type === 'mind-map') {
            // Use existing data if available
            const competitorsResult = allResults.find(r => r.type === 'competitors' && r.status === 'success');
            result = await enrichMindMap(req, {
              summary: summaryData,
              funding: fundingData,
              competitors: competitorsResult?.data
            });
          } else {
            const fn = ENRICHMENT_TYPE_TO_FUNCTION[type];
            result = fn ? await fn(req) : { type, status: 'skipped' as const };
          }
          
          completedTypes.push(type);
          reportProgress();
          return result;
        } catch (error) {
          completedTypes.push(type);
          reportProgress();
          return {
            type,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const dependentResults = await Promise.allSettled(dependentPromises);
      
      // Process dependent results
      dependentResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(result.value);
        } else {
          allResults.push({
            type: dependentTypes[index],
            status: 'error' as const,
            error: result.reason?.message || 'Unknown error'
          });
        }
      });
    }

    // Calculate summary statistics
    const summary = {
      totalRequested: typesToRun.length,
      successful: allResults.filter(r => r.status === 'success').length,
      failed: allResults.filter(r => r.status === 'error').length,
      skipped: allResults.filter(r => r.status === 'skipped').length,
      totalDuration: Date.now() - startTime,
      screenshot,
      insightsSummary
    };

    // Report completion
    reportProgress();

    return {
      websiteUrl: req.websiteUrl,
      requestId,
      results: allResults,
      
      summary
    };
  };

  /* ------------------------------------------------------------------ *
   * NEW: Competitive Landscape Analysis                               *
   * ------------------------------------------------------------------ */
  const analyzeCompetitiveLandscape = async (
    req: CompetitorAnalysisRequest,
    onProgress?: (p: CompetitorAnalysisProgress) => void
  ): Promise<CompetitorAnalysisResponse> => {
    const startTime = Date.now();
    const requestId = `competitor-analysis-${Date.now()}`;
    
    // Focused subset of enrichment types for competitor analysis
    const COMPETITOR_ANALYSIS_TYPES: EnrichmentType[] = [
      'basic-info',
      'company-summary',
      'competitors',
      'mind-map',
      'news',
      'website-sub-pages'
    ];
    
    const completedSteps: string[] = [];
    
    // Progress reporting helper
    const reportProgress = (message: string, currentType?: string) => {
      if (onProgress) {
        onProgress({
          requestId,
          currentStep: completedSteps.length,
          totalSteps: COMPETITOR_ANALYSIS_TYPES.length,
          currentType,
          message,
          isComplete: completedSteps.length === COMPETITOR_ANALYSIS_TYPES.length
        });
      }
    };
    
    try {
      reportProgress('Starting competitive landscape analysis...', 'initialization');
      
      // Step 1: Get basic info and website content
      reportProgress('Analyzing company website...', 'basic-info');
      const [main, sub] = await Promise.all([
        exaR.scrapeWebsiteUrl(req),
        exaR.scrapeWebsiteSubPages(req)
      ]);
      completedSteps.push('basic-info', 'website-sub-pages');
      
      // Step 2: Generate company summary
      reportProgress('Understanding company positioning...', 'company-summary');
      const screenshot = req.skipScreenshot ? undefined : await takeScreenshot({url: req.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080});
      const insightsSummary = await insights.summary({
        mainpage: main,
        subpages: sub,
        websiteUrl: req.websiteUrl
      });
      completedSteps.push('company-summary');
      
      // Step 3: Find competitors
      reportProgress('Identifying competitors...', 'competitors');
      const competitorsData = await exaR.findCompetitors({
        websiteUrl: req.websiteUrl,
        summaryText: insightsSummary.sections.map((s: any) => s.text).join(' ')
      });
      completedSteps.push('competitors');
      
      // Step 4: Get recent news for context
      reportProgress('Gathering market intelligence...', 'news');
      const newsData = await exaR.findNews(req);
      completedSteps.push('news');
      
      // Step 5: Generate mind map with competitive insights
      reportProgress('Analyzing competitive positioning...', 'mind-map');
      const mindMapData = await insights.mindMap({
        companySummary: insightsSummary,
        mainpage: main,
        websiteUrl: req.websiteUrl,
        subpages: sub,
        funding: null, // Skip funding for faster analysis
        competitors: competitorsData
      });
      completedSteps.push('mind-map');
      
      // Process and structure the response
      const competitiveLandscape = processCompetitorData(competitorsData, insightsSummary);
      const marketInsights = generateMarketInsights(
        insightsSummary,
        competitorsData,
        newsData,
        mindMapData
      );
      
      reportProgress('Analysis complete!');
      
      return {
        websiteUrl: req.websiteUrl,
        requestId,
        company: {
          name: req.companyName || extractCompanyName(insightsSummary),
          summary: insightsSummary.sections.find((s: any) => s.header === 'Company Overview')?.text || '',
          positioning: insightsSummary.sections.find((s: any) => s.header === 'Market Position')?.text || '',
          screenshot: screenshot as string | undefined
        },
        competitiveLandscape,
        insights: marketInsights,
        summary: {
          totalAnalyzed: COMPETITOR_ANALYSIS_TYPES.length,
          successful: completedSteps.length,
          failed: COMPETITOR_ANALYSIS_TYPES.length - completedSteps.length,
          totalDuration: Date.now() - startTime
        }
      };
      
    } catch (error) {
      console.error('Competitor analysis error:', error);
      throw error;
    }
  };
  
  // Helper functions for competitor analysis
  const processCompetitorData = (
    competitorsData: any,
    companySummary: any
  ): CompetitorAnalysisResponse['competitiveLandscape'] => {
    // Extract and structure competitor information
    const competitors = Array.isArray(competitorsData) ? competitorsData : [];
    
    return {
      directCompetitors: competitors.slice(0, 5).map(comp => ({
        name: comp.name || 'Unknown',
        url: comp.url || '',
        description: comp.description || '',
        strengths: comp.strengths || []
      })),
      marketPosition: {
        rank: 'Analyzing...',
        marketShare: undefined,
        growthTrend: undefined
      },
      strengths: extractStrengths(companySummary),
      opportunities: extractOpportunities(companySummary, competitors)
    };
  };
  
  const generateMarketInsights = (
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
  
  const extractCompanyName = (summary: any): string => {
    // Extract company name from summary or return default
    return summary.companyName || 'Your Company';
  };
  
  const extractStrengths = (summary: any): string[] => {
    // Extract strengths from company summary
    return summary.strengths || [];
  };
  
  const extractOpportunities = (summary: any, competitors: any): string[] => {
    // Analyze gaps in competitor offerings
    return [];
  };
  
  const extractDifferentiators = (summary: any, competitors: any): string[] => {
    // Identify unique value propositions
    return [];
  };
  
  const generateRecommendations = (summary: any, competitors: any, news: any): string[] => {
    // Generate strategic recommendations
    return [];
  };
  
  const extractKeyTakeaways = (mindMap: any): string[] => {
    // Extract key insights from mind map
    return mindMap?.keyInsights || [];
  };

  /* ------------------------------------------------------------------ *
   * Expose service interface                                           *
   * ------------------------------------------------------------------ */
  return {

    // Core orchestration
    enrichCompany,
    analyzeCompetitiveLandscape,
    processCompetitorData,
    // Direct access to all exa.api functions
    ...exaR,
    
    // Specialized enrichment functions
    enrichCompanySummary,
    enrichCompetitors,
    enrichMindMap,
    extractCompanyName,
    extractStrengths,
    extractOpportunities,
    extractDifferentiators,
    generateRecommendations,
    extractKeyTakeaways,
    
    // Configuration
    ALL_ENRICHMENT_TYPES,
    ENRICHMENT_TYPE_TO_FUNCTION
  };
};