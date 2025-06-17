import type {
  EnrichmentRequest,
  EnrichmentProgress,
  BulkEnrichmentResponse,
  EnrichmentType,
  
} from '../../core/schemas/enrichment.schema';
import { ALL_ENRICHMENT_TYPES } from '../../core/schemas/enrichment.schema';

import { takeScreenshot } from '../../integrations/screenshot';
import { exaResearch } from '../../integrations/exa/exa-research';
import { exaService } from '../../integrations/exa';
import { makeCompanyEnrichmentService } from './enrichment.service';
import type { CompanySummaryResult } from 'integrations/types'

// Only for orchestrator awareness
const exaR = exaResearch(exaService);
const enrichmentService = makeCompanyEnrichmentService();

/**
 * Main enrichment pipeline orchestrator, calling respective phase/logic.
 */
export const enrichCompany = async (
  req: EnrichmentRequest,
  onProgress?: (p: EnrichmentProgress) => void
): Promise<BulkEnrichmentResponse> => {
  const startTime = Date.now();
  const requestId = req.requestId || `enrich-${Date.now()}`;
  const typesToRun = req.enrichmentTypes || ALL_ENRICHMENT_TYPES;
  const completedTypes: EnrichmentType[] = [];

  // Boot pre-step (can modularize to research phase later):
  const main = await exaR.scrapeWebsiteUrl(req);
  const sub = await exaR.scrapeWebsiteSubPages(req);
  const screenshot = await takeScreenshot({
    url: req.websiteUrl, fullPage: true, format: 'webp', blockAds: true, blockCookieBanners: true, blockTrackers: true, prefersColorScheme: 'light', viewportWidth: 1920, viewportHeight: 1080
  });

  // Progress helper
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

  // Phase handling
  const independentTypes = typesToRun.filter(t => !['competitors', 'mind-map'].includes(t));
  const dependentTypes = typesToRun.filter(t => ['competitors', 'mind-map'].includes(t));
  const allResults: any[] = [];

  // Phase 1: Independent enrichments (could modularize into domain/research)
  if (independentTypes.length > 0) {
    const independentPromises = independentTypes.map(async (type) => {
      // Use mappings or direct logic as appropriate
      let fn;
      if (type === 'company-summary') fn = enrichmentService.enrichCompanySummary;
      else if (type === 'competitors') fn = enrichmentService.enrichCompetitors;
      else if (type === 'mind-map') fn = enrichmentService.enrichMindMap;
      else fn = undefined;
      // fallback to simple API otherwise (for now)
      if (!fn && exaR[type]) fn = (req: any) => exaR[type](req);
      if (!fn) return { type, status: 'skipped', error: 'Not implemented' };
      reportProgress(type);
      try {
        const result = await fn(req);
        completedTypes.push(type);
        reportProgress();
        return result;
      } catch (error) {
        completedTypes.push(type);
        reportProgress();
        return { type, status: 'error', error: error instanceof Error ? error.message : String(error) };
      }
    });
    const independentResults = await Promise.allSettled(independentPromises);
    independentResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') allResults.push(result.value);
      else allResults.push({ type: independentTypes[idx], status: 'error', error: result.reason?.message || 'Unknown error' });
    });
  }

  // Phase 2: Dependent enrichments (use outputs from previous as inputs)
  if (dependentTypes.length > 0) {
    const summaryResult = allResults.find(r => r.type === 'company-summary' && r.status === 'success');
    const fundingResult = allResults.find(r => r.type === 'funding' && r.status === 'success');
    const summaryData = summaryResult?.data as CompanySummaryResult | undefined;
    const fundingData = fundingResult?.data;
    const dependentPromises = dependentTypes.map(async (type) => {
      reportProgress(type);
      try {
        let result;
        if (type === 'competitors') {
          const summaryText = summaryData ? summaryData.sections.map((s: any) => s.text).join(' ') : undefined;
          result = await enrichmentService.enrichCompetitors(req, summaryText);
        } else if (type === 'mind-map') {
          const competitorsResult = allResults.find(r => r.type === 'competitors' && r.status === 'success');
          result = await enrichmentService.enrichMindMap(req, {
            summary: summaryData,
            funding: fundingData,
            competitors: competitorsResult?.data
          });
        } else {
          result = { type, status: 'skipped' };
        }
        completedTypes.push(type);
        reportProgress();
        return result;
      } catch (error) {
        completedTypes.push(type);
        reportProgress();
        return { type, status: 'error', error: error instanceof Error ? error.message : String(error) };
      }
    });
    const dependentResults = await Promise.allSettled(dependentPromises);
    dependentResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') allResults.push(result.value);
      else allResults.push({ type: dependentTypes[idx], status: 'error', error: result.reason?.message || 'Unknown error' });
    });
  }

  const summary = {
    totalRequested: typesToRun.length,
    successful: allResults.filter(r => r.status === 'success').length,
    failed: allResults.filter(r => r.status === 'error').length,
    skipped: allResults.filter(r => r.status === 'skipped').length,
    totalDuration: Date.now() - startTime,
    screenshot,
    // Could add insightsSummary etc
  };
  reportProgress();
  return {
    websiteUrl: req.websiteUrl,
    requestId,
    results: allResults,
    summary
  };
};