/**
 * Multi-Step Workflows Package
 * Exports all workflow services and utilities for orchestrated task execution
 */

// Type exports
export type * from './types';

// Core orchestrator
export { WorkflowOrchestratorService } from './workflow-orchestrator.service';
export type {
  WorkflowDefinition,
  WorkflowPhaseDefinition,
  WorkflowStepDefinition,
  WorkflowExecutor,
  WorkflowContext
} from './workflow-orchestrator.service';

// Workflow services
export { ResearchReportService } from './research-report.service';

// Workflow definitions and templates
export const WORKFLOW_TEMPLATES = {
  RESEARCH_REPORT: {
    id: 'research-report',
    name: 'Market Research Report Generation',
    description: 'Comprehensive market research and report generation workflow',
    version: '1.0.0',
    phases: [
      {
        id: 'research',
        name: 'Research Phase',
        description: 'Gather comprehensive market data from multiple sources',
        steps: [
          {
            id: 'industry-reports',
            name: 'Industry Reports Research',
            description: 'Search for industry reports from reputable sources',
            executor: 'research-service',
            inputs: { industry: '{{required}}' },
            outputs: ['industryReports'],
            timeout: 15
          },
          {
            id: 'news-articles',
            name: 'News Articles Collection',
            description: 'Gather recent industry news articles',
            executor: 'research-service',
            inputs: { industry: '{{required}}', timeframe: 'last_6_months' },
            outputs: ['newsArticles'],
            timeout: 10
          },
          {
            id: 'company-research',
            name: 'Company Profiles Research',
            description: 'Research top companies in the industry',
            executor: 'research-service',
            inputs: { industry: '{{required}}' },
            outputs: ['companyProfiles'],
            timeout: 20
          },
          {
            id: 'market-data',
            name: 'Market Data Collection',
            description: 'Gather market size and growth data',
            executor: 'research-service',
            inputs: { industry: '{{required}}' },
            outputs: ['marketData'],
            timeout: 15
          },
          {
            id: 'trend-analysis',
            name: 'Trend Identification',
            description: 'Identify key industry trends and disruptions',
            executor: 'research-service',
            inputs: { industry: '{{required}}' },
            outputs: ['trends'],
            timeout: 15
          }
        ]
      },
      {
        id: 'organization',
        name: 'Data Organization Phase',
        description: 'Organize and validate collected research data',
        steps: [
          {
            id: 'data-validation',
            name: 'Data Validation',
            description: 'Validate and clean research data',
            executor: 'data-processor',
            inputs: { researchData: '{{from_previous_phase}}' },
            outputs: ['validatedData'],
            dependencies: ['industry-reports', 'news-articles', 'company-research', 'market-data'],
            timeout: 10
          },
          {
            id: 'data-structuring',
            name: 'Data Structuring',
            description: 'Structure data for analysis',
            executor: 'data-processor',
            inputs: { validatedData: '{{from_step:data-validation}}' },
            outputs: ['structuredData'],
            dependencies: ['data-validation'],
            timeout: 5
          }
        ]
      },
      {
        id: 'analysis',
        name: 'Analysis Phase',
        description: 'Analyze data and generate insights',
        steps: [
          {
            id: 'trend-analysis',
            name: 'Trend Analysis',
            description: 'Analyze market trends and their implications',
            executor: 'analysis-service',
            inputs: { structuredData: '{{from_step:data-structuring}}' },
            outputs: ['trendAnalysis'],
            dependencies: ['data-structuring'],
            timeout: 20
          },
          {
            id: 'competitive-analysis',
            name: 'Competitive Analysis',
            description: 'Analyze competitive landscape',
            executor: 'analysis-service',
            inputs: { companyData: '{{from_step:data-structuring}}' },
            outputs: ['competitiveAnalysis'],
            dependencies: ['data-structuring'],
            timeout: 15
          },
          {
            id: 'opportunity-analysis',
            name: 'Opportunity Analysis',
            description: 'Identify market opportunities and threats',
            executor: 'analysis-service',
            inputs: { marketData: '{{from_step:data-structuring}}' },
            outputs: ['opportunityAnalysis'],
            dependencies: ['data-structuring'],
            timeout: 15
          },
          {
            id: 'future-outlook',
            name: 'Future Outlook',
            description: 'Develop future market outlook',
            executor: 'analysis-service',
            inputs: { 
              trendAnalysis: '{{from_step:trend-analysis}}',
              marketData: '{{from_step:data-structuring}}'
            },
            outputs: ['futureOutlook'],
            dependencies: ['trend-analysis', 'data-structuring'],
            timeout: 20
          }
        ]
      },
      {
        id: 'report-creation',
        name: 'Report Creation Phase',
        description: 'Generate comprehensive final report',
        steps: [
          {
            id: 'executive-summary',
            name: 'Executive Summary Creation',
            description: 'Create executive summary',
            executor: 'report-generator',
            inputs: { analysisResults: '{{from_previous_phase}}' },
            outputs: ['executiveSummary'],
            dependencies: ['future-outlook'],
            timeout: 15
          },
          {
            id: 'report-sections',
            name: 'Report Sections Generation',
            description: 'Generate detailed report sections',
            executor: 'report-generator',
            inputs: { analysisResults: '{{from_previous_phase}}' },
            outputs: ['reportSections'],
            dependencies: ['executive-summary'],
            timeout: 25
          },
          {
            id: 'charts-generation',
            name: 'Charts and Visualizations',
            description: 'Generate charts and visualizations',
            executor: 'chart-generator',
            inputs: { data: '{{from_step:data-structuring}}' },
            outputs: ['charts'],
            dependencies: ['data-structuring'],
            timeout: 10
          },
          {
            id: 'final-compilation',
            name: 'Final Report Compilation',
            description: 'Compile complete final report',
            executor: 'report-compiler',
            inputs: {
              executiveSummary: '{{from_step:executive-summary}}',
              reportSections: '{{from_step:report-sections}}',
              charts: '{{from_step:charts-generation}}'
            },
            outputs: ['finalReport'],
            dependencies: ['executive-summary', 'report-sections', 'charts-generation'],
            timeout: 10
          }
        ]
      }
    ],
    metadata: {
      category: 'research',
      estimatedDuration: 180, // 3 hours
      complexity: 'complex',
      prerequisites: ['industry parameter', 'research access']
    }
  },

  EVENT_PLANNING: {
    id: 'event-planning',
    name: 'Event Planning Workflow',
    description: 'Comprehensive event planning from venue research to execution',
    version: '1.0.0',
    phases: [
      {
        id: 'venue-research',
        name: 'Venue Research Phase',
        description: 'Research and compare venue options',
        steps: [
          {
            id: 'venue-search',
            name: 'Venue Search',
            description: 'Search for appropriate venues',
            executor: 'venue-service',
            inputs: { 
              location: '{{required}}',
              capacity: '{{required}}',
              date: '{{required}}',
              budget: '{{required}}'
            },
            outputs: ['venueOptions'],
            timeout: 30
          },
          {
            id: 'venue-comparison',
            name: 'Venue Comparison',
            description: 'Compare venue options',
            executor: 'comparison-service',
            inputs: { venueOptions: '{{from_step:venue-search}}' },
            outputs: ['venueComparison'],
            dependencies: ['venue-search'],
            timeout: 15
          }
        ]
      },
      {
        id: 'vendor-selection',
        name: 'Vendor Selection Phase',
        description: 'Research and select vendors',
        steps: [
          {
            id: 'catering-research',
            name: 'Catering Research',
            description: 'Research catering options',
            executor: 'vendor-service',
            inputs: { 
              category: 'catering',
              preferences: '{{food_preferences}}',
              budget: '{{catering_budget}}'
            },
            outputs: ['cateringOptions'],
            timeout: 20
          },
          {
            id: 'entertainment-research',
            name: 'Entertainment Research',
            description: 'Research entertainment options',
            executor: 'vendor-service',
            inputs: { 
              category: 'entertainment',
              preferences: '{{entertainment_preferences}}',
              budget: '{{entertainment_budget}}'
            },
            outputs: ['entertainmentOptions'],
            timeout: 20
          }
        ],
        parallel: true
      }
    ],
    metadata: {
      category: 'event-planning',
      estimatedDuration: 120,
      complexity: 'medium',
      prerequisites: ['event details', 'budget allocation']
    }
  },

  WEBSITE_MIGRATION: {
    id: 'website-migration',
    name: 'Website Migration Workflow',
    description: 'Complete website migration planning and execution',
    version: '1.0.0',
    phases: [
      {
        id: 'content-audit',
        name: 'Content Audit Phase',
        description: 'Comprehensive audit of existing website content',
        steps: [
          {
            id: 'site-crawl',
            name: 'Website Crawl',
            description: 'Crawl existing website to inventory content',
            executor: 'crawler-service',
            inputs: { websiteUrl: '{{required}}' },
            outputs: ['siteInventory'],
            timeout: 45
          },
          {
            id: 'content-mapping',
            name: 'Content Mapping',
            description: 'Map content for migration',
            executor: 'mapping-service',
            inputs: { siteInventory: '{{from_step:site-crawl}}' },
            outputs: ['contentMap'],
            dependencies: ['site-crawl'],
            timeout: 30
          }
        ]
      }
    ],
    metadata: {
      category: 'web-development',
      estimatedDuration: 300,
      complexity: 'complex',
      prerequisites: ['website access', 'migration platform']
    }
  },

  PRODUCT_LAUNCH: {
    id: 'product-launch',
    name: 'Product Launch Campaign',
    description: 'Comprehensive product launch campaign planning and execution',
    version: '1.0.0',
    phases: [
      {
        id: 'market-research',
        name: 'Market Research Phase',
        description: 'Research target audience and competitive landscape',
        steps: [
          {
            id: 'audience-research',
            name: 'Target Audience Research',
            description: 'Research target audience demographics and preferences',
            executor: 'market-research-service',
            inputs: { 
              productName: '{{required}}',
              targetAudience: '{{required}}'
            },
            outputs: ['audienceInsights'],
            timeout: 30
          },
          {
            id: 'competitor-analysis',
            name: 'Competitor Launch Analysis',
            description: 'Analyze competitor product launches',
            executor: 'competitor-service',
            inputs: { 
              industry: '{{industry}}',
              productType: '{{product_type}}'
            },
            outputs: ['competitorAnalysis'],
            timeout: 25
          }
        ]
      }
    ],
    metadata: {
      category: 'marketing',
      estimatedDuration: 240,
      complexity: 'complex',
      prerequisites: ['product details', 'target market definition']
    }
  }
} as const;

// Workflow execution utilities
export class WorkflowFactory {
  /**
   * Create a workflow instance from a template
   */
  static createFromTemplate(
    templateId: keyof typeof WORKFLOW_TEMPLATES,
    customizations?: Partial<any>
  ) {
    const template = WORKFLOW_TEMPLATES[templateId];
    if (!template) {
      throw new Error(`Unknown workflow template: ${templateId}`);
    }

    return {
      ...template,
      ...customizations,
      id: `${template.id}-${Date.now()}` // Ensure unique ID
    };
  }

  /**
   * Validate workflow template structure
   */
  static validateTemplate(template: any): boolean {
    // Basic validation
    if (!template.id || !template.name || !template.phases) {
      return false;
    }

    // Validate phases
    for (const phase of template.phases) {
      if (!phase.id || !phase.steps || !Array.isArray(phase.steps)) {
        return false;
      }

      // Validate steps
      for (const step of phase.steps) {
        if (!step.id || !step.executor || !step.inputs) {
          return false;
        }
      }
    }

    return true;
  }
}

// Best practices prompting utilities
export class WorkflowPromptEngine {
  /**
   * Generate optimized prompts following best practices
   */
  static generateStructuredPrompt(config: {
    goal: string;
    context: string;
    constraints: string[];
    format: string;
    examples?: string[];
  }): string {
    const { goal, context, constraints, format, examples } = config;

    let prompt = `## Goal\n${goal}\n\n`;
    
    if (context) {
      prompt += `## Context\n${context}\n\n`;
    }

    if (constraints.length > 0) {
      prompt += `## Constraints\n${constraints.map(c => `- ${c}`).join('\n')}\n\n`;
    }

    if (format) {
      prompt += `## Output Format\n${format}\n\n`;
    }

    if (examples && examples.length > 0) {
      prompt += `## Examples\n${examples.join('\n\n')}\n\n`;
    }

    prompt += `## Instructions\nFollow the above specifications carefully and provide a complete response.`;

    return prompt;
  }

  /**
   * Apply prompt engineering best practices
   */
  static optimizePrompt(basePrompt: string, optimizations: {
    addSpecificity?: boolean;
    addExamples?: boolean;
    addConstraints?: string[];
    addFallbacks?: string[];
    clarifyExpectations?: string;
  }): string {
    let optimized = basePrompt;

    if (optimizations.clarifyExpectations) {
      optimized = `${optimizations.clarifyExpectations}\n\n${optimized}`;
    }

    if (optimizations.addSpecificity) {
      optimized += '\n\nBe specific and detailed in your response. Include concrete examples and actionable recommendations.';
    }

    if (optimizations.addConstraints && optimizations.addConstraints.length > 0) {
      optimized += '\n\nConstraints:\n' + optimizations.addConstraints.map(c => `- ${c}`).join('\n');
    }

    if (optimizations.addFallbacks && optimizations.addFallbacks.length > 0) {
      optimized += '\n\nFallback options if primary approach fails:\n' + optimizations.addFallbacks.map(f => `- ${f}`).join('\n');
    }

    if (optimizations.addExamples) {
      optimized += '\n\nPlease provide examples where appropriate to illustrate your recommendations.';
    }

    return optimized;
  }
}

// Export workflow best practices
export const WORKFLOW_BEST_PRACTICES = {
  structure: {
    beSpecific: 'Clearly state what you want to accomplish in each step',
    breakIntoSteps: 'Use numbered lists for multi-step processes',
    includeFormat: 'Mention desired output formats and structures',
    provideContext: 'Include relevant background information',
    setConstraints: 'Specify any limitations or requirements'
  },
  
  clarity: {
    preciseLangauge: 'Avoid ambiguity and vague instructions',
    specifyParameters: 'Include exact values, ranges, or criteria',
    clarifyExpectations: 'Explain what success looks like',
    includeExamples: 'Provide examples of desired outputs when helpful',
    defineTerminology: 'Explain industry-specific or technical terms'
  },
  
  adaptability: {
    includeFallbacks: 'Provide alternatives if the primary approach fails',
    specifyErrorHandling: 'Explain how to deal with potential issues',
    allowIteration: 'Build in opportunities for refinement',
    requestVerification: 'Ask the agent to verify critical information',
    includeDecisionPoints: 'Define how choices should be made when alternatives exist'
  },
  
  efficiency: {
    prioritizeTasks: 'Indicate which aspects are most important',
    setLimits: 'Specify constraints on depth or breadth',
    focusOnValue: 'Emphasize where the agent can provide the most value',
    minimizeSteps: 'Avoid redundant or low-value activities',
    batchOperations: 'Group related tasks for efficiency'
  }
} as const;