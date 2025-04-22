export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  email: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  items: number;
  paymentMethod: string;
}

export interface InvoiceFilters {
  status: InvoiceStatus | 'all';
  search: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
} 