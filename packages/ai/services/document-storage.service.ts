import type { SupabaseClient } from '@supabase/supabase-js';

interface Database {
  from: (table: string) => any;
}

export interface CompanyDocument {
  id: string;
  companyProfileId: string;
  userId: string;
  title: string;
  description?: string;
  documentType: 'financial_report' | 'pitch_deck' | 'whitepaper' | 'case_study' | 'product_spec' | 'legal_doc' | 'other';
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  storagePath: string;
  storageBucket: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  extractedText?: string;
  summary?: string;
  tags: string[];
  aiAnalysis: Record<string, any>;
  sentimentScore?: number;
  keyTopics: string[];
  visibility: 'private' | 'team' | 'public';
  accessPermissions: Record<string, any>;
  uploadedAt: string;
  processedAt?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: string[];
  sentiment: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
  };
  topics: Array<{
    topic: string;
    relevance: number;
  }>;
  entities: Array<{
    name: string;
    type: 'person' | 'company' | 'location' | 'money' | 'date' | 'other';
    confidence: number;
  }>;
  metadata: {
    pageCount?: number;
    wordCount: number;
    readingTime: number; // minutes
    language: string;
  };
  insights: Array<{
    type: string;
    content: string;
    confidence: number;
  }>;
}

export const makeDocumentStorageService = (db: Database, supabase: SupabaseClient, userId: string) => {
  
  /**
   * Upload document to Supabase Storage
   */
  const uploadDocument = async (
    companyProfileId: string,
    file: File,
    metadata: {
      title: string;
      description?: string;
      documentType: CompanyDocument['documentType'];
      visibility?: CompanyDocument['visibility'];
    }
  ): Promise<string> => {
    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `companies/${companyProfileId}/documents/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw new Error(`Failed to upload file: ${uploadError.message}`);

    // Save document record to database
    const { data: docData, error: docError } = await db
      .from('company_documents')
      .insert({
        company_profile_id: companyProfileId,
        user_id: userId,
        title: metadata.title,
        description: metadata.description,
        document_type: metadata.documentType,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: filePath,
        storage_bucket: 'company-documents',
        processing_status: 'pending',
        visibility: metadata.visibility || 'private',
        tags: [],
        ai_analysis: {},
        key_topics: [],
        access_permissions: {}
      })
      .select('id')
      .single();

    if (docError) throw new Error(`Failed to save document record: ${docError.message}`);

    // Trigger document processing (you can implement this as a background job)
    processDocumentAsync(docData.id);

    return docData.id;
  };

  /**
   * Process document (extract text, analyze, etc.)
   */
  const processDocument = async (documentId: string): Promise<DocumentAnalysis> => {
    // Update status to processing
    await db
      .from('company_documents')
      .update({ 
        processing_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    try {
      // Get document record
      const { data: doc, error: docError } = await db
        .from('company_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) throw new Error(`Document not found: ${docError.message}`);

      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(doc.storage_bucket)
        .download(doc.storage_path);

      if (downloadError) throw new Error(`Failed to download file: ${downloadError.message}`);

      // Extract text based on file type
      let extractedText = '';
      if (doc.mime_type?.includes('pdf')) {
        extractedText = await extractTextFromPDF(fileData);
      } else if (doc.mime_type?.includes('text') || doc.mime_type?.includes('application/vnd.openxmlformats')) {
        extractedText = await extractTextFromDocument(fileData, doc.mime_type);
      }

      // Analyze document with AI
      const analysis = await analyzeDocumentWithAI(extractedText, doc.document_type);

      // Update document with analysis results
      await db
        .from('company_documents')
        .update({
          processing_status: 'completed',
          processed_at: new Date().toISOString(),
          extracted_text: extractedText,
          summary: analysis.summary,
          tags: analysis.topics.map(t => t.topic),
          ai_analysis: analysis,
          sentiment_score: analysis.sentiment.score,
          key_topics: analysis.topics.slice(0, 10).map(t => t.topic),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      return analysis;

    } catch (error) {
      // Update status to failed
      await db
        .from('company_documents')
        .update({ 
          processing_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      throw error;
    }
  };

  /**
   * Get documents for a company
   */
  const getCompanyDocuments = async (
    companyProfileId: string,
    options: {
      documentType?: CompanyDocument['documentType'];
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<CompanyDocument[]> => {
    let query = db
      .from('company_documents')
      .select('*')
      .eq('company_profile_id', companyProfileId)
      .eq('user_id', userId); // RLS - user can only see their own docs

    if (options.documentType) {
      query = query.eq('document_type', options.documentType);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(options.offset || 0, (options.offset || 0) + (options.limit || 10) - 1);

    const { data, error } = await query;

    if (error) throw new Error(`Failed to get documents: ${error.message}`);

    return (data || []).map(doc => ({
      id: doc.id,
      companyProfileId: doc.company_profile_id,
      userId: doc.user_id,
      title: doc.title,
      description: doc.description,
      documentType: doc.document_type,
      fileName: doc.file_name,
      fileSize: doc.file_size,
      mimeType: doc.mime_type,
      storagePath: doc.storage_path,
      storageBucket: doc.storage_bucket,
      processingStatus: doc.processing_status,
      extractedText: doc.extracted_text,
      summary: doc.summary,
      tags: doc.tags || [],
      aiAnalysis: doc.ai_analysis || {},
      sentimentScore: doc.sentiment_score,
      keyTopics: doc.key_topics || [],
      visibility: doc.visibility,
      accessPermissions: doc.access_permissions || {},
      uploadedAt: doc.uploaded_at,
      processedAt: doc.processed_at,
      lastAccessedAt: doc.last_accessed_at,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    }));
  };

  /**
   * Get document download URL
   */
  const getDocumentDownloadUrl = async (
    documentId: string,
    expiresIn: number = 3600 // 1 hour
  ): Promise<string> => {
    // Get document record
    const { data: doc, error: docError } = await db
      .from('company_documents')
      .select('storage_path, storage_bucket')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (docError) throw new Error(`Document not found: ${docError.message}`);

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from(doc.storage_bucket)
      .createSignedUrl(doc.storage_path, expiresIn);

    if (urlError) throw new Error(`Failed to generate download URL: ${urlError.message}`);

    // Update last accessed timestamp
    await db
      .from('company_documents')
      .update({ 
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    return urlData.signedUrl;
  };

  /**
   * Search documents by content
   */
  const searchDocuments = async (
    companyProfileId: string,
    query: string,
    options: {
      documentType?: CompanyDocument['documentType'];
      limit?: number;
    } = {}
  ): Promise<CompanyDocument[]> => {
    let dbQuery = db
      .from('company_documents')
      .select('*')
      .eq('company_profile_id', companyProfileId)
      .eq('user_id', userId)
      .textSearch('extracted_text', query, {
        type: 'websearch',
        config: 'english'
      });

    if (options.documentType) {
      dbQuery = dbQuery.eq('document_type', options.documentType);
    }

    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .limit(options.limit || 10);

    const { data, error } = await dbQuery;

    if (error) throw new Error(`Failed to search documents: ${error.message}`);

    return (data || []).map(doc => ({
      id: doc.id,
      companyProfileId: doc.company_profile_id,
      userId: doc.user_id,
      title: doc.title,
      description: doc.description,
      documentType: doc.document_type,
      fileName: doc.file_name,
      fileSize: doc.file_size,
      mimeType: doc.mime_type,
      storagePath: doc.storage_path,
      storageBucket: doc.storage_bucket,
      processingStatus: doc.processing_status,
      extractedText: doc.extracted_text,
      summary: doc.summary,
      tags: doc.tags || [],
      aiAnalysis: doc.ai_analysis || {},
      sentimentScore: doc.sentiment_score,
      keyTopics: doc.key_topics || [],
      visibility: doc.visibility,
      accessPermissions: doc.access_permissions || {},
      uploadedAt: doc.uploaded_at,
      processedAt: doc.processed_at,
      lastAccessedAt: doc.last_accessed_at,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at
    }));
  };

  /**
   * Delete document
   */
  const deleteDocument = async (documentId: string): Promise<void> => {
    // Get document record
    const { data: doc, error: docError } = await db
      .from('company_documents')
      .select('storage_path, storage_bucket')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (docError) throw new Error(`Document not found: ${docError.message}`);

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(doc.storage_bucket)
      .remove([doc.storage_path]);

    if (storageError) {
      console.error('Failed to delete file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await db
      .from('company_documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', userId);

    if (dbError) throw new Error(`Failed to delete document record: ${dbError.message}`);
  };

  // Helper functions (implement based on your needs)
  const processDocumentAsync = async (documentId: string) => {
    // Queue this for background processing
    // You can use Supabase Edge Functions, external queue, or immediate processing
    setTimeout(() => processDocument(documentId), 1000);
  };

  const extractTextFromPDF = async (fileData: Blob): Promise<string> => {
    // Implement PDF text extraction using pdf-parse or similar
    // For now, return placeholder
    return "PDF text extraction not implemented";
  };

  const extractTextFromDocument = async (fileData: Blob, mimeType: string): Promise<string> => {
    // Implement document text extraction based on type
    return "Document text extraction not implemented";
  };

  const analyzeDocumentWithAI = async (text: string, documentType: string): Promise<DocumentAnalysis> => {
    // Implement AI analysis using your AI service
    // This is a placeholder - integrate with your AI models
    return {
      summary: "AI analysis not implemented",
      keyPoints: [],
      sentiment: {
        score: 0,
        label: 'neutral',
        confidence: 0
      },
      topics: [],
      entities: [],
      metadata: {
        wordCount: text.split(' ').length,
        readingTime: Math.ceil(text.split(' ').length / 200),
        language: 'en'
      },
      insights: []
    };
  };

  return {
    uploadDocument,
    processDocument,
    getCompanyDocuments,
    getDocumentDownloadUrl,
    searchDocuments,
    deleteDocument
  };
};

export type DocumentStorageService = ReturnType<typeof makeDocumentStorageService>;