
import type { 
  EnrichmentRequest, 
  EnrichmentProgress, 
  BulkEnrichmentResponse,
  EnrichmentResult,
  EnrichmentType, 
  CompetitorAnalysisRequest,
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse
} from "../../core/schemas/enrichment.schema"

import { ALL_ENRICHMENT_TYPES } from "../../core/schemas/enrichment.schema"


import { insights } from "../../services/insights"

import { exaResearch } from "../../integrations/exa/exa-research"
import { exaService } from "../../integrations/exa"
import { takeScreenshot } from "../../integrations/screenshot"


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
      console.log("🚀 ~ returnwrapEnrichmentResult ~ main:", main)
      const screenshot = await takeScreenshot({url: request.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080});
      console.log("🚀 ~ returnwrapEnrichmentResult ~ screenshot:", screenshot)
      console.log(screenshot);
      // const doc = await pdf(request.websiteUrl);
      // console.log(doc);
      // const webContent = await content(request.websiteUrl);
      // console.log(webContent);
      // const meta = await metadata(request.websiteUrl);
      // console.log(meta);
      const sub = await exaR.scrapeWebsiteSubPages(request);
      console.log("🚀 ~ returnwrapEnrichmentResult ~ sub:", sub)
      
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
    
    // NEW: Comprehensive competitive analysis as an enrichment type
    'competitive-analysis': (req, enrichmentResults?: EnrichmentResult[]) => wrapEnrichmentResult('competitive-analysis', async () => {
      // This performs full competitive analysis using all available enrichment data
      const analysisRequest = {
        websiteUrl: req.websiteUrl,
        companyName: req.companyName,
        industry: req.industry,
        focusAreas: ['market-position', 'strengths', 'opportunities'],
        skipScreenshot: req.skipScreenshot || false,
        enrichmentData: enrichmentResults ? {
          websiteUrl: req.websiteUrl,
          requestId: req.requestId || `competitive-analysis-${Date.now()}`,
          results: enrichmentResults,
          summary: {
            totalRequested: enrichmentResults.length,
            successful: enrichmentResults.filter(r => r.status === 'success').length,
            failed: enrichmentResults.filter(r => r.status === 'error').length,
            skipped: enrichmentResults.filter(r => r.status === 'skipped').length,
            totalDuration: 0
          }
        } : undefined
      };
      
      // Use the full competitive analysis function with enrichment data
      return await analyzeCompetitiveLandscape(analysisRequest);
    }),
    
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
    const typesToRun = req.enrichmentTypes || ALL_ENRICHMENT_TYPES;
    const completedTypes: EnrichmentType[] = [];

     // Step 1
     let main, sub;
     try {
       main = await exaR.scrapeWebsiteUrl(req);
       console.log("🚀 ~ makeCompanyEnrichmentService ~ main:", main)
     } catch (error) {
       console.error('🚨 Failed to scrape main website, using fallback:', error);
       main = { results: [{ url: req.websiteUrl, title: 'Website', text: 'Unable to scrape content' }] };
     }

     try {
       sub = await exaR.scrapeWebsiteSubPages(req);
       console.log("🚀 ~ makeCompanyEnrichmentService ~ sub:", sub)
     } catch (error) {
       console.error('🚨 Failed to scrape sub pages, using fallback:', error);
       sub = { results: [] };
     }

      const screenshot = await takeScreenshot({url: req.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080});
      console.log(screenshot);
 
      // const doc = await pdf(req.websiteUrl);
      // console.log(doc);

   
      let insightsSummary;
      try {
        insightsSummary = await insights.summary({
          mainpage: main,
          subpages: sub,
          websiteUrl: req.websiteUrl
        });
        console.log("🚀 ~ makeCompanyEnrichmentService ~ insightsSummary:", insightsSummary)
      } catch (error) {
        console.error('🚨 Failed to generate insights summary, using fallback:', error);
        insightsSummary = {
          sections: [
            {
              heading: '🌐 Company Website',
              text: `Analysis of ${req.websiteUrl} - Limited data available due to API constraints.`
            }
          ]
        };
      }

    
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
          // Pass current results to competitive-analysis type
          const result = type === 'competitive-analysis' 
            ? await fn(req, allResults) 
            : await fn(req);
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
            // Pass current results to competitive-analysis type
            result = fn ? (type === 'competitive-analysis' 
              ? await fn(req, allResults) 
              : await fn(req)) : { type, status: 'skipped' as const };
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
    req: CompetitorAnalysisRequest & { enrichmentData?: BulkEnrichmentResponse },
    onProgress?: (p: CompetitorAnalysisProgress) => void
  ): Promise<CompetitorAnalysisResponse> => {
    const startTime = Date.now();
    const requestId = `competitor-analysis-${Date.now()}`;
    
    const COMPETITOR_ANALYSIS_STEPS = ['initialization', 'data-extraction', 'competitor-analysis', 'insights-generation', 'finalization'];
    const completedSteps: string[] = [];
    
    // Progress reporting helper
    const reportProgress = (message: string, currentType?: string) => {
      if (onProgress) {
        onProgress({
          requestId,
          currentStep: completedSteps.length,
          totalSteps: COMPETITOR_ANALYSIS_STEPS.length,
          currentType,
          message,
          isComplete: completedSteps.length === COMPETITOR_ANALYSIS_STEPS.length
        });
      }
    };
    
    try {
      reportProgress('Starting competitive landscape analysis...', 'initialization');
      completedSteps.push('initialization');
      
      // Use enrichment data if available, otherwise fallback to scraping
      let main, sub, insightsSummary, screenshot;
      
      if (req.enrichmentData) {
        reportProgress('Using enrichment data for analysis...', 'data-extraction');
        
        // Extract data from enrichment results
        const summaryResult = req.enrichmentData.results.find(r => r.type === 'company-summary' && r.status === 'success');
        const basicInfoResult = req.enrichmentData.results.find(r => r.type === 'basic-info' && r.status === 'success');
        const subPagesResult = req.enrichmentData.results.find(r => r.type === 'website-sub-pages' && r.status === 'success');
        
        // Use enrichment data
        main = basicInfoResult?.data || { results: [] };
        sub = subPagesResult?.data || { results: [] };
        insightsSummary = summaryResult?.data || req.enrichmentData.summary?.insightsSummary;
        screenshot = req.enrichmentData.summary?.screenshot;
        
        // If no summary in enrichment data, generate one
        if (!insightsSummary) {
          insightsSummary = await insights.summary({
            mainpage: main,
            subpages: sub,
            websiteUrl: req.websiteUrl
          });
        }
      } else {
        // Fallback: scrape fresh data
        reportProgress('Scraping company website...', 'data-extraction');
        const [mainFresh, subFresh] = await Promise.all([
          exaR.scrapeWebsiteUrl(req),
          exaR.scrapeWebsiteSubPages(req)
        ]);
        main = mainFresh;
        sub = subFresh;
        screenshot = req.skipScreenshot ? undefined : await takeScreenshot({url: req.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080});
        insightsSummary = await insights.summary({
          mainpage: main,
          subpages: sub,
          websiteUrl: req.websiteUrl
        });
      }
      
      completedSteps.push('data-extraction');
      
      // Step 3: Competitor Analysis
      reportProgress('Identifying competitors and market dynamics...', 'competitor-analysis');
      
      // Use existing competitor data if available from enrichment
      let competitorsData, newsData;
      if (req.enrichmentData) {
        const competitorsResult = req.enrichmentData.results.find(r => r.type === 'competitors' && r.status === 'success');
        const newsResult = req.enrichmentData.results.find(r => r.type === 'news' && r.status === 'success');
        
        competitorsData = competitorsResult?.data || await exaR.findCompetitors({
          websiteUrl: req.websiteUrl,
          summaryText: insightsSummary.sections?.map((s: any) => s.text).join(' ') || ''
        });
        
        newsData = newsResult?.data || await exaR.findNews(req);
      } else {
        // Fresh competitor and news analysis
        competitorsData = await exaR.findCompetitors({
          websiteUrl: req.websiteUrl,
          summaryText: insightsSummary.sections?.map((s: any) => s.text).join(' ') || ''
        });
        newsData = await exaR.findNews(req);
      }
      
      completedSteps.push('competitor-analysis');
      
      // Step 4: Generate insights and mind map
      reportProgress('Generating competitive insights...', 'insights-generation');
      
      // Use existing mind map if available from enrichment
      let mindMapData;
      if (req.enrichmentData) {
        const mindMapResult = req.enrichmentData.results.find(r => r.type === 'mind-map' && r.status === 'success');
        const fundingResult = req.enrichmentData.results.find(r => r.type === 'funding' && r.status === 'success');
        
        mindMapData = mindMapResult?.data || await insights.mindMap({
          companySummary: insightsSummary,
          mainpage: main,
          websiteUrl: req.websiteUrl,
          subpages: sub,
          funding: fundingResult?.data || null,
          competitors: competitorsData
        });
      } else {
        mindMapData = await insights.mindMap({
          companySummary: insightsSummary,
          mainpage: main,
          websiteUrl: req.websiteUrl,
          subpages: sub,
          funding: null,
          competitors: competitorsData
        });
      }
      
      completedSteps.push('insights-generation');
      
      // Step 5: Finalize analysis
      reportProgress('Finalizing competitive analysis...', 'finalization');
      
      // Process and structure the response
      const competitiveLandscape = processCompetitorData(competitorsData, insightsSummary);
      const marketInsights = generateMarketInsights(
        insightsSummary,
        competitorsData,
        newsData,
        mindMapData
      );
      
      completedSteps.push('finalization');
      reportProgress('Competitive analysis complete!');
      
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
          totalAnalyzed: COMPETITOR_ANALYSIS_STEPS.length,
          successful: completedSteps.length,
          failed: COMPETITOR_ANALYSIS_STEPS.length - completedSteps.length,
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

// Export the service type
export type CompanyEnrichmentService = ReturnType<typeof makeCompanyEnrichmentService>;