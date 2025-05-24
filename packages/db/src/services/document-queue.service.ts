import { QStashService } from './qstash.service';

/**
 * Configuration options for the Document Queue service
 */
export interface DocumentQueueConfig {
  qstash: QStashService;
  endpoints: {
    extract: string;
    analyze: string;
    vectorize: string;
  };
}

/**
 * Document Queue Service for document processing job management
 */
export class DocumentQueueService {
  private qstash: QStashService;
  private endpoints: {
    extract: string;
    analyze: string;
    vectorize: string;
  };

  constructor(config: DocumentQueueConfig) {
    this.qstash = config.qstash;
    this.endpoints = config.endpoints;
  }

  /**
   * Queue a document extraction job
   */
  async queueExtraction(documentId: string, options?: {
    delay?: number;
    deduplicationId?: string;
  }) {
    return this.qstash.publishMessage(
      this.endpoints.extract,
      { documentId },
      {
        delay: options?.delay,
        deduplicationId: options?.deduplicationId || `extract-${documentId}`,
        contentBasedDeduplication: true,
      }
    );
  }

  /**
   * Queue a document analysis job
   */
  async queueAnalysis(documentId: string, options?: {
    delay?: number;
    deduplicationId?: string;
  }) {
    return this.qstash.publishMessage(
      this.endpoints.analyze,
      { documentId },
      {
        delay: options?.delay,
        deduplicationId: options?.deduplicationId || `analyze-${documentId}`,
        contentBasedDeduplication: true,
      }
    );
  }

  /**
   * Queue a document vectorization job
   */
  async queueVectorization(documentId: string, options?: {
    delay?: number;
    deduplicationId?: string;
  }) {
    return this.qstash.publishMessage(
      this.endpoints.vectorize,
      { documentId },
      {
        delay: options?.delay,
        deduplicationId: options?.deduplicationId || `vectorize-${documentId}`,
        contentBasedDeduplication: true,
      }
    );
  }

  /**
   * Queue the entire document processing pipeline
   */
  async queueProcessingPipeline(documentId: string) {
    // First queue the extraction
    const extractionResult = await this.queueExtraction(documentId);
    
    // Then queue the analysis with a delay
    const analysisResult = await this.queueAnalysis(documentId, {
      delay: 30, // 30 seconds after extraction
    });
    
    // Then queue the vectorization with a delay
    const vectorizationResult = await this.queueVectorization(documentId, {
      delay: 60, // 60 seconds after extraction
    });

    return {
      extraction: extractionResult,
      analysis: analysisResult,
      vectorization: vectorizationResult,
    };
  }

  /**
   * Get the underlying QStash service
   */
  getQStashService(): QStashService {
    return this.qstash;
  }

  /**
   * Factory method to create a DocumentQueueService from environment variables
   */
  static fromEnv(qstash: QStashService): DocumentQueueService {
    const extractEndpoint = process.env.DOCUMENT_EXTRACT_ENDPOINT;
    const analyzeEndpoint = process.env.DOCUMENT_ANALYZE_ENDPOINT;
    const vectorizeEndpoint = process.env.DOCUMENT_VECTORIZE_ENDPOINT;

    if (!extractEndpoint || !analyzeEndpoint || !vectorizeEndpoint) {
      throw new Error('Missing document processing endpoint environment variables');
    }

    return new DocumentQueueService({
      qstash,
      endpoints: {
        extract: extractEndpoint,
        analyze: analyzeEndpoint,
        vectorize: vectorizeEndpoint,
      },
    });
  }
}