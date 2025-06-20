import type { EnrichmentProgress } from "@repo/ai"

// Helper to map enrichment progress to marketing insights
export function getMarketingPhase(progress: EnrichmentProgress) {
  const { currentType, completedTypes } = progress;
  
  const phaseMap: Record<string, { phase: string; message: string }> = {
    'basic-info': {
      phase: 'Website Analysis',
      message: 'Analyzing website structure and content...'
    },
    'company-summary': {
      phase: 'Business Intelligence',
      message: 'Understanding your business model and value proposition...'
    },
    'competitors': {
      phase: 'Competitive Landscape',
      message: 'Identifying and analyzing your competitors...'
    },
    'funding': {
      phase: 'Financial Intelligence',
      message: 'Gathering funding and investment data...'
    },
    'news': {
      phase: 'Market Presence',
      message: 'Analyzing recent news and market activity...'
    },
    'linkedin': {
      phase: 'Professional Network',
      message: 'Examining LinkedIn presence and connections...'
    },
    'founders': {
      phase: 'Leadership Analysis',
      message: 'Researching company leadership and founders...'
    }
  };

  if (currentType && phaseMap[currentType]) {
    return {
      ...phaseMap[currentType],
      data: {
        currentStep: completedTypes.length + 1,
        totalSteps: progress.totalSteps,
        percentage: Math.round(((completedTypes.length + 1) / progress.totalSteps) * 100)
      }
    };
  }

  return null;
}


// Helper function to map enrichment progress to user-friendly phases
export function getEnrichmentPhase(progress: EnrichmentProgress) {
  const { currentType, completedTypes, totalSteps } = progress;
  
  const phaseMap: Record<string, { phase: string; message: string }> = {
    'basic-info': {
      phase: 'Website Analysis',
      message: 'Analyzing company website and digital presence...'
    },
    'company-summary': {
      phase: 'Business Intelligence',
      message: 'Understanding business model and value propositions...'
    },
    'funding': {
      phase: 'Financial Intelligence',
      message: 'Gathering funding and investment history...'
    },
    'news': {
      phase: 'Market Activity',
      message: 'Analyzing recent news and market movements...'
    },
    'linkedin': {
      phase: 'Professional Network',
      message: 'Examining LinkedIn presence and connections...'
    },
    'founders': {
      phase: 'Leadership Analysis',
      message: 'Researching company leadership and key personnel...'
    },
    'website-sub-pages': {
      phase: 'Deep Content Analysis',
      message: 'Analyzing website subpages for deeper insights...'
    }
  };

  if (currentType && phaseMap[currentType]) {
    return {
      ...phaseMap[currentType],
      data: {
        currentStep: completedTypes.length + 1,
        totalSteps,
        percentage: Math.round(((completedTypes.length + 1) / totalSteps) * 100)
      }
    };
  }

  return null;
}

// Helper function to map competitive analysis progress to user-friendly phases
export function getAnalysisPhase(progress: CompetitorAnalysisProgress) {
  const { currentType, message, currentStep, totalSteps } = progress;
  
  const phaseMap: Record<string, { phase: string; message: string }> = {
    'basic-info': {
      phase: 'Initial Analysis',
      message: 'Starting competitive landscape scan...'
    },
    'company-summary': {
      phase: 'Positioning Analysis',
      message: 'Understanding market positioning...'
    },
    'competitors': {
      phase: 'Competitor Discovery',
      message: 'Identifying direct and indirect competitors...'
    },
    'news': {
      phase: 'Market Intelligence',
      message: 'Gathering competitive market intelligence...'
    },
    'mind-map': {
      phase: 'Strategic Mapping',
      message: 'Creating competitive strategy map...'
    }
  };

  if (currentType && phaseMap[currentType]) {
    return {
      ...phaseMap[currentType],
      data: {
        currentStep,
        totalSteps,
        percentage: Math.round((currentStep / totalSteps) * 100)
      }
    };
  }

  // Fallback to the original message if no mapping exists
  return {
    phase: 'Analysis in Progress',
    message,
    data: {
      currentStep,
      totalSteps,
      percentage: Math.round((currentStep / totalSteps) * 100)
    }
  };
} 