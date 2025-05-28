/**
 * This file contains Supabase database types for compatibility with
 * existing Supabase client usage in the application.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      CSVFile: {
        Row: {
          id: string
          name: string
          url: string
          createdAt: string
          updatedAt: string
          status: string
          totalRows: number
          validRows: number
          invalidRows: number
        }
        Insert: {
          id?: string
          name: string
          url: string
          createdAt?: string
          updatedAt?: string
          status?: string
          totalRows?: number
          validRows?: number
          invalidRows?: number
        }
        Update: {
          id?: string
          name?: string
          url?: string
          createdAt?: string
          updatedAt?: string
          status?: string
          totalRows?: number
          validRows?: number
          invalidRows?: number
        }
      }
      CSVRow: {
        Row: {
          id: string
          fileId: string
          rowData: Json
          rowIndex: number
          isValid: boolean
          errors?: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          fileId: string
          rowData: Json
          rowIndex: number
          isValid?: boolean
          errors?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          fileId?: string
          rowData?: Json
          rowIndex?: number
          isValid?: boolean
          errors?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      doc_processor_documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          file_path: string
          file_type: Database["public"]["Enums"]["document_type"]
          file_size: number
          mime_type: string
          file_hash: string
          user_id: string
          status: Database["public"]["Enums"]["document_status"]
          error_message?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          analysis?: Json | null
          page_count?: number | null
          word_count?: number | null
          language?: string | null
          summary?: string | null
          keywords?: string[] | null
          processed_at?: string | null
          description?: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          file_path: string
          file_type: Database["public"]["Enums"]["document_type"]
          file_size: number
          mime_type: string
          file_hash: string
          user_id: string
          status?: Database["public"]["Enums"]["document_status"]
          error_message?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          analysis?: Json | null
          page_count?: number | null
          word_count?: number | null
          language?: string | null
          summary?: string | null
          keywords?: string[] | null
          processed_at?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          file_path?: string
          file_type?: Database["public"]["Enums"]["document_type"]
          file_size?: number
          mime_type?: string
          file_hash?: string
          user_id?: string
          status?: Database["public"]["Enums"]["document_status"]
          error_message?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          analysis?: Json | null
          page_count?: number | null
          word_count?: number | null
          language?: string | null
          summary?: string | null
          keywords?: string[] | null
          processed_at?: string | null
          description?: string | null
        }
      }
      doc_processor_document_chunks: {
        Row: {
          id: string
          created_at: string
          document_id: string
          chunk_index: number
          content: string
          token_count: number
          embedding: number[] | null
          page_number: number | null
          heading: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          document_id: string
          chunk_index: number
          content: string
          token_count: number
          embedding?: number[] | null
          page_number?: number | null
          heading?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          document_id?: string
          chunk_index?: number
          content?: string
          token_count?: number
          embedding?: number[] | null
          page_number?: number | null
          heading?: string | null
        }
      }
      doc_processor_document_entities: {
        Row: {
          id: string
          created_at: string
          document_id: string
          entity_type: string
          entity_text: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          document_id: string
          entity_type: string
          entity_text: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          document_id?: string
          entity_type?: string
          entity_text?: string
          metadata?: Json | null
        }
      }
      doc_processor_processing_tasks: {
        Row: {
          id: string
          created_at: string
          document_id: string
          task_type: Database["public"]["Enums"]["processing_task_type"]
          status: Database["public"]["Enums"]["processing_task_status"]
          error_message?: string | null
          metadata?: Json | null
          started_at?: string | null
          completed_at?: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          document_id: string
          task_type: Database["public"]["Enums"]["processing_task_type"]
          status?: Database["public"]["Enums"]["processing_task_status"]
          error_message?: string | null
          metadata?: Json | null
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          document_id?: string
          task_type?: Database["public"]["Enums"]["processing_task_type"]
          status?: Database["public"]["Enums"]["processing_task_status"]
          error_message?: string | null
          metadata?: Json | null
          started_at?: string | null
          completed_at?: string | null
        }
      }
      csv_files: {
        Row: {
          id: string
          name: string
          url: string
          created_at: string
          updated_at: string
          status: string
          total_rows: number
          valid_rows: number
          invalid_rows: number
        }
        Insert: {
          id?: string
          name: string
          url: string
          created_at?: string
          updated_at?: string
          status?: string
          total_rows?: number
          valid_rows?: number
          invalid_rows?: number
        }
        Update: {
          id?: string
          name?: string
          url?: string
          created_at?: string
          updated_at?: string
          status?: string
          total_rows?: number
          valid_rows?: number
          invalid_rows?: number
        }
      }
      csv_rows: {
        Row: {
          id: string
          file_id: string
          row_data: Json
          row_index: number
          is_valid: boolean
          errors?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          file_id: string
          row_data: Json
          row_index: number
          is_valid?: boolean
          errors?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          row_data?: Json
          row_index?: number
          is_valid?: boolean
          errors?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: number[]
          similarity_threshold: number
          match_count?: number
        }
        Returns: {
          id: string
          document_id: string
          content: string
          token_count: number
          page_number: number | null
          heading: string | null
          similarity: number
          doc_processor_documents: {
            title: string
          }
        }[]
      }
      hybrid_search_documents: {
        Args: {
          query_text: string
          query_embedding: number[]
          match_count?: number
          full_text_weight?: number
          semantic_weight?: number
          rrf_k?: number
        }
        Returns: {
          id: string
          title: string
          content: string
          page_number: number | null
          heading: string | null
          combined_score: number
        }[]
      }
    }
    Enums: {
      document_type: "pdf" | "docx" | "txt" | "webpage" | "other"
      document_status: "pending" | "processing" | "processed" | "failed" | "error"
      processing_task_type: "extract" | "analyze" | "vectorize"
      processing_task_status: "pending" | "processing" | "processed" | "failed" | "error"
    }
  }
}