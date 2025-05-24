import { database } from '../../index';
import type { Database } from '../supabase/supabase-types';

// Define types based on Supabase Database schema
export type DocProcessorDocument = Database['public']['Tables']['doc_processor_documents']['Row'];
export type DocProcessorDocumentChunk = Database['public']['Tables']['doc_processor_document_chunks']['Row'];
export type DocProcessorDocumentEntity = Database['public']['Tables']['doc_processor_document_entities']['Row'];
export type DocProcessorProcessingTask = Database['public']['Tables']['doc_processor_processing_tasks']['Row'];
export type DocumentStatus = Database['public']['Enums']['document_status'];
export type DocumentType = Database['public']['Enums']['document_type'];
export type ProcessingTaskType = Database['public']['Enums']['processing_task_type'];
export type ProcessingTaskStatus = Database['public']['Enums']['processing_task_status'];

// Insert types for creating new records
export type DocProcessorDocumentInsert = Database['public']['Tables']['doc_processor_documents']['Insert'];
export type DocProcessorDocumentChunkInsert = Database['public']['Tables']['doc_processor_document_chunks']['Insert'];
export type DocProcessorDocumentEntityInsert = Database['public']['Tables']['doc_processor_document_entities']['Insert'];
export type DocProcessorProcessingTaskInsert = Database['public']['Tables']['doc_processor_processing_tasks']['Insert'];

/**
 * Document Processing utility functions
 * 
 * This module provides helper functions for working with the document processing
 * functionality in the database.
 */
export const DocumentProcessing = {
  /**
   * Create a new document
   */
  createDocument: async (data: {
    title: string;
    filePath: string;
    fileType: DocumentType;
    fileSize: number;
    mimeType: string;
    fileHash: string;
    userId: string;
    description?: string;
  }) => {
    const { data: result, error } = await database
      .from('doc_processor_documents')
      .insert({
        title: data.title,
        file_path: data.filePath,
        file_type: data.fileType,
        file_size: data.fileSize,
        mime_type: data.mimeType,
        file_hash: data.fileHash,
        user_id: data.userId,
        description: data.description,
        status: 'pending' as DocumentStatus,
      })
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  /**
   * Get a document by ID with related data
   */
  getDocument: async (id: string) => {
    const { data: document, error: docError } = await database
      .from('doc_processor_documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (docError) throw docError;
    if (!document) return null;
    
    // Get related chunks
    const { data: chunks, error: chunksError } = await database
      .from('doc_processor_document_chunks')
      .select('*')
      .eq('document_id', id)
      .order('chunk_index', { ascending: true });
    
    if (chunksError) throw chunksError;
    
    // Get related entities
    const { data: entities, error: entitiesError } = await database
      .from('doc_processor_document_entities')
      .select('*')
      .eq('document_id', id);
    
    if (entitiesError) throw entitiesError;
    
    // Get related processing tasks
    const { data: processingTasks, error: tasksError } = await database
      .from('doc_processor_processing_tasks')
      .select('*')
      .eq('document_id', id)
      .order('created_at', { ascending: false });
    
    if (tasksError) throw tasksError;
    
    return {
      ...document,
      chunks: chunks || [],
      entities: entities || [],
      processingTasks: processingTasks || [],
    };
  },

  /**
   * Get document by file hash
   */
  getDocumentByHash: async (fileHash: string) => {
    const { data, error } = await database
      .from('doc_processor_documents')
      .select('*')
      .eq('file_hash', fileHash)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },

  /**
   * Get all documents
   */
  getAllDocuments: async () => {
    const { data, error } = await database
      .from('doc_processor_documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get all documents for a user
   */
  getUserDocuments: async (userId: string) => {
    const { data, error } = await database
      .from('doc_processor_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Update a document's status
   */
  updateDocumentStatus: async (id: string, status: DocumentStatus, errorMessage?: string) => {
    const updateData: Database['public']['Tables']['doc_processor_documents']['Update'] = {
      status,
      error_message: errorMessage,
      ...(status === 'processed' ? { processed_at: new Date().toISOString() } : {})
    };
    
    const { data, error } = await database
      .from('doc_processor_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update document metadata after processing
   */
  updateDocumentMetadata: async (id: string, data: {
    pageCount?: number;
    wordCount?: number;
    language?: string;
    summary?: string;
    keywords?: string[];
    analysis?: Record<string, any>;
    extractedText?: string;
    metadata?: Record<string, any>;
  }) => {
    const updateData: Database['public']['Tables']['doc_processor_documents']['Update'] = {
      page_count: data.pageCount,
      word_count: data.wordCount,
      language: data.language,
      summary: data.summary,
      keywords: data.keywords,
      analysis: data.analysis,
      extracted_text: data.extractedText,
      metadata: data.metadata,
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    const { data: result, error } = await database
      .from('doc_processor_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  /**
   * Create document chunks for a document
   */
  createDocumentChunks: async (documentId: string, chunks: {
    chunkIndex: number;
    content: string;
    tokenCount: number;
    pageNumber?: number;
    heading?: string;
    embedding?: number[];
  }[]) => {
    const insertData = chunks.map(chunk => ({
      document_id: documentId,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
      token_count: chunk.tokenCount,
      page_number: chunk.pageNumber,
      heading: chunk.heading,
      embedding: chunk.embedding,
    }));
    
    const { data, error } = await database
      .from('doc_processor_document_chunks')
      .insert(insertData)
      .select();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get document chunks for a document
   */
  getDocumentChunks: async (documentId: string) => {
    const { data, error } = await database
      .from('doc_processor_document_chunks')
      .select('*')
      .eq('document_id', documentId)
      .order('chunk_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  /**
   * Create document entities for a document
   */
  createDocumentEntities: async (documentId: string, entities: {
    entityType: string;
    entityText: string;
    metadata?: Record<string, any>;
  }[]) => {
    const insertData = entities.map(entity => ({
      document_id: documentId,
      entity_type: entity.entityType,
      entity_text: entity.entityText,
      metadata: entity.metadata,
    }));
    
    const { data, error } = await database
      .from('doc_processor_document_entities')
      .insert(insertData)
      .select();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get entities for a document
   */
  getDocumentEntities: async (documentId: string) => {
    const { data, error } = await database
      .from('doc_processor_document_entities')
      .select('*')
      .eq('document_id', documentId);
    
    if (error) throw error;
    return data;
  },

  /**
   * Create a processing task for a document
   */
  createProcessingTask: async (documentId: string, taskType: ProcessingTaskType) => {
    const { data, error } = await database
      .from('doc_processor_processing_tasks')
      .insert({
        document_id: documentId,
        task_type: taskType,
        status: 'pending' as ProcessingTaskStatus,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get tasks for a document
   */
  getDocumentTasks: async (documentId: string) => {
    const { data, error } = await database
      .from('doc_processor_processing_tasks')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Update a processing task status
   */
  updateProcessingTaskStatus: async (id: string, status: ProcessingTaskStatus, data?: {
    errorMessage?: string;
    metadata?: Record<string, any>;
    startedAt?: Date;
    completedAt?: Date;
  }) => {
    const updateData: Database['public']['Tables']['doc_processor_processing_tasks']['Update'] = {
      status,
      error_message: data?.errorMessage,
      metadata: data?.metadata,
      started_at: data?.startedAt?.toISOString(),
      completed_at: data?.completedAt?.toISOString(),
      ...(status === 'processing' ? { started_at: new Date().toISOString() } : {}),
      ...(status === 'processed' || status === 'failed' ? { completed_at: new Date().toISOString() } : {}),
    };
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    const { data: result, error } = await database
      .from('doc_processor_processing_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  /**
   * Search documents by content similarity using vector embeddings
   * Note: This uses Supabase RPC function calls
   */
  searchDocumentsBySimilarity: async (
    queryEmbedding: number[],
    matchThreshold = 0.5,
    matchCount = 10
  ) => {
    const { data, error } = await database.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      similarity_threshold: matchThreshold,
      match_count: matchCount,
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Hybrid search combining full text and vector similarity
   * Note: This uses Supabase RPC function calls
   */
  hybridSearchDocuments: async (
    queryText: string,
    queryEmbedding: number[],
    matchCount = 10,
    fullTextWeight = 1.0, 
    semanticWeight = 1.0,
    rrfK = 50
  ) => {
    const { data, error } = await database.rpc('hybrid_search_documents', {
      query_text: queryText,
      query_embedding: queryEmbedding,
      match_count: matchCount,
      full_text_weight: fullTextWeight,
      semantic_weight: semanticWeight,
      rrf_k: rrfK,
    });
    
    if (error) throw error;
    return data;
  }
};