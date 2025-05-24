import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { keys } from './keys';
import type { Database as SupabaseDatabase } from './src/supabase/supabase-types';

// Supabase client singleton
const globalForSupabase = global as unknown as { supabase: ReturnType<typeof createClient<SupabaseDatabase>> };

export const database = globalForSupabase.supabase || createClient<SupabaseDatabase>(
  keys().SUPABASE_URL,
  keys().SUPABASE_ANON_KEY
);

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = database;
}

// Initialize the service registry when importing the package
import { 
  initializeRegistry, 
  getService, 
  hasService, 
  registerService, 
  registerServiceFactory,
  resetRegistry,
  ServiceName
} from './src/service-registry';

// Initialize services
initializeRegistry();

// Export service registry functions
export { 
  getService, 
  hasService, 
  registerService, 
  registerServiceFactory,
  resetRegistry,
  ServiceName
};

// Export data utilities
export { DocumentProcessing } from './src/services/document-processing';
export { CSVImport } from './src/services/csv-import';
export { Storage } from './src/services/storage';

// Export service classes for custom configurations
export * from './src/services';

// Export types and Supabase utilities
export type { Database as SupabaseDatabase } from './src/supabase/supabase-types';
export * from './src/supabase';

/**
 * Database Service access
 */
export const DatabaseService = {
  /**
   * Create a storage client for working with Supabase storage
   */
  createStorageClient: (supabaseUrl: string, supabaseKey: string) => {
    return new Storage(supabaseUrl, supabaseKey);
  },
  
  /**
   * Get the Supabase database client (singleton)
   */
  getClient: () => database,
  
  /**
   * Get the Supabase service instance from registry
   */
  getSupabaseService: () => getService(ServiceName.SUPABASE),
  
  /**
   * Get the Redis service instance
   */
  getRedisService: () => getService(ServiceName.REDIS),
  
  /**
   * Get the QStash service instance
   */
  getQStashService: () => getService(ServiceName.QSTASH),
  
  /**
   * Get the Document Cache service instance
   */
  getDocumentCacheService: () => getService(ServiceName.DOCUMENT_CACHE),
  
  /**
   * Get the Document Queue service instance
   */
  getDocumentQueueService: () => getService(ServiceName.DOCUMENT_QUEUE),
  
  /**
   * Get the Storage service instance
   */
  getStorageService: () => getService(ServiceName.STORAGE),
};