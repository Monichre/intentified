import { Redis } from '@upstash/redis';

/**
 * Configuration options for the Redis service
 */
export interface RedisConfig {
  url: string;
  token: string;
}

/**
 * Redis Service for interacting with Upstash Redis
 */
export class RedisService {
  private client: Redis;
  
  constructor(config: RedisConfig) {
    this.client = new Redis({
      url: config.url,
      token: config.token,
    });
  }

  /**
   * Get the raw Redis client
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Set a key-value pair
   */
  async set(key: string, value: any, ttl?: number): Promise<string> {
    if (ttl) {
      return this.client.set(key, value, { ex: ttl });
    }
    return this.client.set(key, value);
  }

  /**
   * Get a value by key
   */
  async get<T = any>(key: string): Promise<T | null> {
    return this.client.get(key);
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  /**
   * Get multiple values by keys
   */
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    return this.client.mget(keys);
  }

  /**
   * Set multiple key-value pairs
   */
  async mset(keyValuePairs: Record<string, any>): Promise<string> {
    return this.client.mset(keyValuePairs);
  }

  /**
   * Increment a key
   */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /**
   * Decrement a key
   */
  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  /**
   * Set expiration for a key
   */
  async expire(key: string, ttl: number): Promise<number> {
    return this.client.expire(key, ttl);
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * Create a pipeline for batch operations
   */
  pipeline() {
    return this.client.pipeline();
  }

  /**
   * Factory method to create a Redis service from environment variables
   */
  static fromEnv(): RedisService {
    const url = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;

    if (!url || !token) {
      throw new Error('Missing Upstash Redis environment variables');
    }

    return new RedisService({ url, token });
  }
}