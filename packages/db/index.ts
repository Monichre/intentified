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

// Export service classes for custom configurations (excluding storage to avoid conflict)
export * from './src/services/redis.service';
export * from './src/services/qstash.service';
export * from './src/services/document-cache.service';
export * from './src/services/document-queue.service';

// Export types and Supabase utilities
export type { Database as SupabaseDatabase } from './src/supabase/supabase-types';
export * from './src/supabase';

/**
 * Database Service access
 */
export const DatabaseService = {
  /**
   * Get the Supabase database client (singleton)
   */
  getClient: () => database,
};