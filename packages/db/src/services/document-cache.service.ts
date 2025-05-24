import { RedisService } from './redis.service';

/**
 * Configuration options for the Document Cache service
 */
export interface DocumentCacheConfig {
  redis: RedisService;
  keyPrefix?: string;
  defaultTtl?: number;
}

/**
 * Document Cache Service for caching document processing data
 */
export class DocumentCacheService {
  private redis: RedisService;
  private keyPrefix: string;
  private defaultTtl: number;

  constructor(config: DocumentCacheConfig) {
    this.redis = config.redis;
    this.keyPrefix = config.keyPrefix || 'doc:';
    this.defaultTtl = config.defaultTtl || 60 * 60 * 24; // 24 hours
  }

  /**
   * Get document from cache
   */
  async getDocument<T = any>(documentId: string): Promise<T | null> {
    return this.redis.get<T>(`${this.keyPrefix}${documentId}`);
  }

  /**
   * Set document in cache
   */
  async setDocument<T = any>(documentId: string, data: T, ttl?: number): Promise<string> {
    return this.redis.set(
      `${this.keyPrefix}${documentId}`, 
      data, 
      ttl || this.defaultTtl
    );
  }

  /**
   * Delete document from cache
   */
  async deleteDocument(documentId: string): Promise<number> {
    return this.redis.del(`${this.keyPrefix}${documentId}`);
  }

  /**
   * Get document chunks from cache
   */
  async getDocumentChunks<T = any>(documentId: string): Promise<T[] | null> {
    return this.redis.get<T[]>(`${this.keyPrefix}${documentId}:chunks`);
  }

  /**
   * Set document chunks in cache
   */
  async setDocumentChunks<T = any>(documentId: string, chunks: T[], ttl?: number): Promise<string> {
    return this.redis.set(
      `${this.keyPrefix}${documentId}:chunks`, 
      chunks, 
      ttl || this.defaultTtl
    );
  }

  /**
   * Get document entities from cache
   */
  async getDocumentEntities<T = any>(documentId: string): Promise<T[] | null> {
    return this.redis.get<T[]>(`${this.keyPrefix}${documentId}:entities`);
  }

  /**
   * Set document entities in cache
   */
  async setDocumentEntities<T = any>(documentId: string, entities: T[], ttl?: number): Promise<string> {
    return this.redis.set(
      `${this.keyPrefix}${documentId}:entities`, 
      entities, 
      ttl || this.defaultTtl
    );
  }

  /**
   * Get search results from cache
   */
  async getSearchResults<T = any>(query: string): Promise<T[] | null> {
    // Create a hash of the query to use as a key
    const queryHash = Buffer.from(query).toString('base64');
    return this.redis.get<T[]>(`${this.keyPrefix}search:${queryHash}`);
  }

  /**
   * Set search results in cache
   */
  async setSearchResults<T = any>(query: string, results: T[], ttl?: number): Promise<string> {
    // Create a hash of the query to use as a key
    const queryHash = Buffer.from(query).toString('base64');
    return this.redis.set(
      `${this.keyPrefix}search:${queryHash}`, 
      results, 
      ttl || 60 * 30 // 30 minutes default for search results
    );
  }

  /**
   * Get the underlying Redis service
   */
  getRedisService(): RedisService {
    return this.redis;
  }
}