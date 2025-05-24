import { createClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/supabase-types';

/**
 * Storage service for document processing
 * 
 * This service provides utilities for managing file storage in Supabase.
 */
export class Storage {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabaseClient: ReturnType<typeof createClient<Database>>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    if (!supabaseUrl) throw new Error('Missing Supabase URL');
    if (!supabaseKey) throw new Error('Missing Supabase key');

    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  }

  /**
   * Upload a file to storage
   */
  async uploadFile(bucket: string, path: string, file: File | ArrayBuffer) {
    let fileBuffer: ArrayBuffer;
    let contentType: string;

    if (file instanceof File) {
      fileBuffer = await file.arrayBuffer();
      contentType = file.type;
    } else {
      fileBuffer = file;
      contentType = 'application/octet-stream';
    }

    const { error, data } = await this.supabaseClient.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = this.supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);

    return { path, publicUrl };
  }

  /**
   * Get a public URL for a file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data: { publicUrl } } = this.supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await this.supabaseClient.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  }

  /**
   * Generate file hash for deduplication
   */
  async generateFileHash(file: File | ArrayBuffer): Promise<string> {
    let buffer: ArrayBuffer;
    
    if (file instanceof File) {
      buffer = await file.arrayBuffer();
    } else {
      buffer = file;
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Create a client with a specific connection
   */
  static createClient(supabaseUrl: string, supabaseKey: string) {
    return new Storage(supabaseUrl, supabaseKey);
  }
}