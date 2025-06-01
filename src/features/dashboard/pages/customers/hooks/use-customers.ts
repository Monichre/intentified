import { useState, useMemo } from "react";
import { Customer, CustomerFilters } from "@/features/dashboard/pages/customers/types/customer";
import { mockCustomers } from "../data/mock-customers";
import {
  SortingState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

interface UseCustomersProps {
  initialCustomers?: Customer[];
}

export function useCustomers({ initialCustomers = mockCustomers }: UseCustomersProps = {}) {
  const [filters, setFilters] = useState<CustomerFilters>({
    status: "all",
    search: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "dateJoined", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter((customer) => {
      // Status filter
      if (filters.status !== "all" && customer.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          customer.customerNumber,
          customer.fullName,
          customer.email,
          customer.company,
          customer.location,
        ].map((field) => field.toLowerCase());

        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      // Date range filter - using dateJoined for filtering
      if (filters.dateRange.from || filters.dateRange.to) {
        const customerJoinDate = new Date(customer.dateJoined);
        if (filters.dateRange.from && customerJoinDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && customerJoinDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [initialCustomers, filters]);

  // For TanStack table, we need to handle pagination and sorting separately
  const paginatedAndSortedCustomers = useMemo(() => {
    // Early return if no filters
    if (filteredCustomers.length === 0) return [];

    // Skip sorting if no sort criteria
    if (sorting.length === 0) {
      // Just apply pagination
      const startIdx = pagination.pageIndex * pagination.pageSize;
      const endIdx = startIdx + pagination.pageSize;
      return filteredCustomers.slice(startIdx, endIdx);
    }

    // Create a sorting function that makes comparisons based on field type
    const compareValues = (
      a: number | string | Date,
      b: number | string | Date,
      desc: boolean
    ): number => {
      const direction = desc ? -1 : 1;

      // Handle different value types
      if (a === b) return 0;

      // Handle null/undefined values
      if (a == null) return direction;
      if (b == null) return -direction;

      // Check if values are dates (try to detect ISO strings)
      if (typeof a === "string" && typeof b === "string") {
        // ISO date format detection (more reliable than checking for "T")
        const isDateA = /^\d{4}-\d{2}-\d{2}(T|\s)/.test(a);
        const isDateB = /^\d{4}-\d{2}-\d{2}(T|\s)/.test(b);

        if (isDateA && isDateB) {
          const dateA = new Date(a).getTime();
          const dateB = new Date(b).getTime();
          return (dateA - dateB) * direction;
        }

        // Regular string comparison
        return a.localeCompare(b) * direction;
      }

      // Number comparison
      if (typeof a === "number" && typeof b === "number") {
        return (a - b) * direction;
      }

      // Default comparison (converts to string)
      return String(a).localeCompare(String(b)) * direction;
    };

    // Apply sorting
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      // Handle multi-sorting using sortingState array
      for (const sort of sorting) {
        const key = sort.id as keyof Customer;
        const compared = compareValues(a[key], b[key], sort.desc);
        if (compared !== 0) return compared;
      }
      return 0;
    });

    // Apply pagination
    const startIdx = pagination.pageIndex * pagination.pageSize;
    const endIdx = startIdx + pagination.pageSize;
    return sortedCustomers.slice(startIdx, endIdx);
  }, [filteredCustomers, sorting, pagination]);

  const updateFilters = (newFilters: Partial<CustomerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    setSorting(
      updaterOrValue instanceof Function
        ? updaterOrValue(sorting)
        : updaterOrValue
    );
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    setPagination(
      updaterOrValue instanceof Function
        ? updaterOrValue(pagination)
        : updaterOrValue
    );
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      search: "",
      dateRange: { from: undefined, to: undefined },
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    // Raw filtered customers (no pagination applied)
    allCustomers: filteredCustomers,
    // Customers with pagination and sorting applied
    customers: paginatedAndSortedCustomers,
    // Total count for pagination
    pageCount: Math.ceil(filteredCustomers.length / pagination.pageSize),
    // States
    filters,
    sorting,
    pagination,
    // Update handlers
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  };
} 