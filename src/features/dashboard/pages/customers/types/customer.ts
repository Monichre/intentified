export type CustomerStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface Customer {
  id: string;
  customerNumber: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  totalSpent: number;
  status: CustomerStatus;
  dateJoined: string;
  lastPurchase: string;
  location: string;
}

export interface CustomerFilters {
  status: CustomerStatus | 'all';
  search: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
} 