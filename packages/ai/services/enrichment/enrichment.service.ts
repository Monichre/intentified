import type { 
  EnrichmentRequest, 
  EnrichmentProgress, 
  BulkEnrichmentResponse,
  EnrichmentResult,
  EnrichmentType 
} from "@/services/enrichment/types"

import type { CompanySummaryResult, CompanyMindMap } from "@/lib/exa/types"
import { insights } from "../../services/enrichment/insights"

import { makeExaResearch } from "../../lib/exa/exa.api"
import { makeExaClient } from "../../lib/exa/exa.client"
import { customCaptureService } from "../../lib/capture/capture.api"


/* ------------------------------------------------------------------ *
 * High-level orchestrator – pure, deterministic, stream-friendly      *
 * ------------------------------------------------------------------ */

// Define all available enrichment types
const ALL_ENRICHMENT_TYPES: EnrichmentType[] = [
  'basic-info',
  'company-summary', 
  'funding',
  'competitors',
  'mind-map',
  'linkedin',
  'founders',
  'crunchbase',
  'news',
  'financial-report',
  'github-url',
  'pitchbook',
  'tiktok',
  'tracxn',
  'wikipedia',
  'youtube-videos',
  'recent-tweets',
  'reddit',
  'twitter-profile',
  'website-sub-pages',
  'website-url',
  'youtube-video-details',
  

];

export const makeCompanyEnrichmentService = () => {
  const apiKey = process.env.EXA_API_KEY || "";
  const exa = makeExaClient(apiKey);
  const exaR = makeExaResearch(exa);
  const {screenshot: captureScreenshot, pdf, content, metadata} = customCaptureService

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

      console.log("🚀 ~ returnwrapEnrichmentResult ~ webContent:", webContent)

    return wrapEnrichmentResult('company-summary', async () => {
      const main = await exaR.scrapeWebsiteUrl(request);
      const screenshot = await captureScreenshot(request.websiteUrl);
      console.log(screenshot);
      const doc = await pdf(request.websiteUrl);
      console.log(doc);
      const webContent = await content(request.websiteUrl);
      console.log(webContent);
      const meta = await metadata(request.websiteUrl);
      console.log(meta);
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
        summaryText = summary.sections.map(s => s.text).join(' ');
      }
      
      return exaR.findCompetitors({
        websiteUrl: request.websiteUrl,
        summaryText
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
        summaryText: summary.sections.map(s => s.text).join(' ')
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
    'linkedin': (req) => wrapEnrichmentResult('linkedin', () => exaR.scrapeLinkedin(req)),
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
    'recent-tweets': (req) => {
      // Note: This requires username extraction from website
      return wrapEnrichmentResult('recent-tweets', () => {
        throw new Error('Username required for Twitter operations');
      });
    },
    'reddit': (req) => wrapEnrichmentResult('reddit', () => exaR.scrapeReddit(req)),
    'twitter-profile': (req) => {
      // Note: This requires username extraction from website
      return wrapEnrichmentResult('twitter-profile', () => {
        throw new Error('Username required for Twitter operations');
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
     const main = await exaR.scrapeWebsiteUrl(req);

     console.log("🚀 ~ makeCompanyEnrichmentService ~ main:", main)

     const sub = await exaR.scrapeWebsiteSubPages(req);

      console.log("🚀 ~ makeCompanyEnrichmentService ~ sub:", sub)

      const screenshot = await captureScreenshot(req.websiteUrl);
      console.log(screenshot);

      const doc = await pdf(req.websiteUrl);
      console.log(doc);


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
              summaryData.sections.map(s => s.text).join(' ') : 
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
      doc,
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
   * Expose service interface                                           *
   * ------------------------------------------------------------------ */
  return {

    // Core orchestration
    enrichCompany,

    // Direct access to all exa.api functions
    ...exaR,
    
    // Specialized enrichment functions
    enrichCompanySummary,
    enrichCompetitors,
    enrichMindMap,
    
    // Configuration
    ALL_ENRICHMENT_TYPES,
    ENRICHMENT_TYPE_TO_FUNCTION
  };
};