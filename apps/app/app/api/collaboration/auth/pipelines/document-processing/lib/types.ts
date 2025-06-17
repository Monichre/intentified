export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
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
          error?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          analysis?: Json | null
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
          error?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          analysis?: Json | null
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
          error?: string | null
          extracted_text?: string | null
          metadata?: Json | null
          analysis?: Json | null
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
          error?: string | null
          metadata?: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          document_id: string
          task_type: Database["public"]["Enums"]["processing_task_type"]
          status?: Database["public"]["Enums"]["processing_task_status"]
          error?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          document_id?: string
          task_type?: Database["public"]["Enums"]["processing_task_type"]
          status?: Database["public"]["Enums"]["processing_task_status"]
          error?: string | null
          metadata?: Json | null
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
    }
    Enums: {
      document_type: "pdf" | "docx" | "txt"
      document_status: "pending" | "processing" | "processed" | "error"
      processing_task_type: "extract" | "analyze" | "vectorize"
      processing_task_status: "pending" | "processing" | "processed" | "error"
    }
  }
}
