import { Registry } from './registry';
import { 
  RedisService, 
  QStashService, 
  DocumentCacheService, 
  DocumentQueueService 
} from './services';
import { keys } from '../keys';
import { DocumentProcessing } from './services/document-processing';
import { CSVImport } from './services/csv-import';
import { Storage } from './services/storage';
import { createClient } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from './supabase/supabase-types';

/**
 * Service registry singleton
 */
const registry = Registry.getInstance();

/**
 * Service names
 */
export const ServiceName = {
  REDIS: 'redis',
  QSTASH: 'qstash',
  DOCUMENT_CACHE: 'document-cache',
  DOCUMENT_QUEUE: 'document-queue',
  DOCUMENT_PROCESSING: 'document-processing',
  CSV_IMPORT: 'csv-import',
  STORAGE: 'storage',
  SUPABASE: 'supabase',
} as const;

/**
 * Initialize the registry with default services
 */
export function initializeRegistry() {
  // Register Redis service factory
  registry.registerFactory(ServiceName.REDIS, () => {
    try {
      return RedisService.fromEnv();
    } catch (error) {
      console.warn('Failed to initialize Redis service:', error);
      return null;
    }
  });

  // Register QStash service factory
  registry.registerFactory(ServiceName.QSTASH, () => {
    try {
      return QStashService.fromEnv();
    } catch (error) {
      console.warn('Failed to initialize QStash service:', error);
      return null;
    }
  });

  // Register Document Cache service factory
  registry.registerFactory(ServiceName.DOCUMENT_CACHE, () => {
    const redis = registry.get<RedisService>(ServiceName.REDIS);
    if (!redis) return null;
    
    return new DocumentCacheService({ redis });
  });

  // Register Document Queue service factory
  registry.registerFactory(ServiceName.DOCUMENT_QUEUE, () => {
    const qstash = registry.get<QStashService>(ServiceName.QSTASH);
    if (!qstash) return null;

    try {
      return DocumentQueueService.fromEnv(qstash);
    } catch (error) {
      console.warn('Failed to initialize Document Queue service:', error);
      return null;
    }
  });

  // Register document processing service
  registry.register(ServiceName.DOCUMENT_PROCESSING, DocumentProcessing);

  // Register CSV import service
  registry.register(ServiceName.CSV_IMPORT, CSVImport);

  // Register Supabase client factory
  registry.registerFactory(ServiceName.SUPABASE, () => {
    const env = keys();
    return createClient<SupabaseDatabase>(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );
  });

  // Register storage service factory
  registry.registerFactory(ServiceName.STORAGE, () => {
    const env = keys();
    const url = env.SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_API_KEY || env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.warn('Missing Supabase credentials for storage service');
      return null;
    }

    return new Storage(url, key);
  });
}

/**
 * Get a service from the registry
 */
export function getService<T>(name: string): T | null {
  try {
    return registry.get<T>(name);
  } catch (error) {
    return null;
  }
}

/**
 * Check if a service is available
 */
export function hasService(name: string): boolean {
  return registry.has(name);
}

/**
 * Register a custom service
 */
export function registerService<T>(name: string, service: T): void {
  registry.register(name, service);
}

/**
 * Register a custom service factory
 */
export function registerServiceFactory<T>(name: string, factory: () => T): void {
  registry.registerFactory(name, factory);
}

/**
 * Reset the registry
 */
export function resetRegistry(): void {
  registry.reset();
}