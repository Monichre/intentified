export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export interface Lead {
  id: string;
  leadNumber: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  status: LeadStatus;
  date: string;
  source: string;
}

export interface LeadFilters {
  status: LeadStatus | 'all';
  search: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
} 