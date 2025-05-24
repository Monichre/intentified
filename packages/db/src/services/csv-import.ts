import { database } from '../../index';
import type { Database } from '../supabase/supabase-types';

// Define CSV types based on our database schema
type CSVFile = Database['public']['Tables']['CSVFile']['Row'];
type CSVRow = Database['public']['Tables']['CSVRow']['Row'];
type CSVFileInsert = Database['public']['Tables']['CSVFile']['Insert'];
type CSVRowInsert = Database['public']['Tables']['CSVRow']['Insert'];

export type { CSVFile, CSVRow, CSVFileInsert, CSVRowInsert };

/**
 * CSV Import utility functions
 * 
 * This module provides helper functions for working with CSV import functionality
 * in the database.
 */
export const CSVImport = {
  /**
   * Create a new CSV file import record
   */
  createCSVFile: async (data: {
    name: string;
    url: string;
  }) => {
    const { data: result, error } = await database
      .from('CSVFile')
      .insert({
        ...data,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  /**
   * Get a CSV file import record by ID
   */
  getCSVFile: async (id: string) => {
    const { data, error } = await database
      .from('CSVFile')
      .select(`
        *,
        rows:CSVRow(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all CSV file import records
   */
  getAllCSVFiles: async () => {
    const { data, error } = await database
      .from('CSVFile')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update a CSV file import record status
   */
  updateCSVFileStatus: async (id: string, status: string, data?: {
    totalRows?: number;
    validRows?: number;
    invalidRows?: number;
  }) => {
    const { data: result, error } = await database
      .from('CSVFile')
      .update({
        status,
        ...data,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  /**
   * Create CSV rows for a file
   */
  createCSVRows: async (fileId: string, rows: {
    rowData: Record<string, any>;
    rowIndex: number;
    isValid?: boolean;
    errors?: string | null;
  }[]) => {
    const { data, error } = await database
      .from('CSVRow')
      .insert(
        rows.map(row => ({
          fileId,
          ...row,
        }))
      )
      .select();

    if (error) throw error;
    return data;
  },

  /**
   * Get CSV rows for a file
   */
  getCSVRows: async (fileId: string) => {
    const { data, error } = await database
      .from('CSVRow')
      .select('*')
      .eq('fileId', fileId)
      .order('rowIndex', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get valid CSV rows for a file
   */
  getValidCSVRows: async (fileId: string) => {
    const { data, error } = await database
      .from('CSVRow')
      .select('*')
      .eq('fileId', fileId)
      .eq('isValid', true)
      .order('rowIndex', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Get invalid CSV rows for a file
   */
  getInvalidCSVRows: async (fileId: string) => {
    const { data, error } = await database
      .from('CSVRow')
      .select('*')
      .eq('fileId', fileId)
      .eq('isValid', false)
      .order('rowIndex', { ascending: true });

    if (error) throw error;
    return data;
  },
};