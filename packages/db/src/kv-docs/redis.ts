import { Redis } from '@upstash/redis';

/**
 * Redis client for Upstash
 * 
 * This module provides a Redis client for interacting with Upstash Redis.
 */
export class RedisClient {
  private redis: Redis;

  /**
   * Create a Redis client instance
   */
  constructor(url: string, token: string) {
    this.redis = new Redis({ url, token });
  }

  /**
   * Set a key-value pair
   */
  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      return this.redis.set(key, value, { ex: ttl });
    }
    return this.redis.set(key, value);
  }

  /**
   * Get a value by key
   */
  async get<T = any>(key: string): Promise<T | null> {
    return this.redis.get(key);
  }

  /**
   * Delete a key
   */
  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  /**
   * Get multiple values by keys
   */
  async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    return this.redis.mget(keys);
  }

  /**
   * Set multiple key-value pairs
   */
  async mset(keyValuePairs: Record<string, any>): Promise<string> {
    return this.redis.mset(keyValuePairs);
  }

  /**
   * Increment a key
   */
  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  /**
   * Decrement a key
   */
  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  /**
   * Set expiration for a key
   */
  async expire(key: string, ttl: number): Promise<number> {
    return this.redis.expire(key, ttl);
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  /**
   * Create a pipeline for batch operations
   */
  pipeline() {
    return this.redis.pipeline();
  }

  /**
   * Get the raw Redis client
   */
  getClient() {
    return this.redis;
  }

  /**
   * Create a Redis client from environment variables
   */
  static fromEnv(): RedisClient {
    const url = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;

    if (!url || !token) {
      throw new Error('Missing Upstash Redis environment variables');
    }

    return new RedisClient(url, token);
  }
}