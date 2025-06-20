import { useState, useMemo } from "react";
import { Lead, LeadFilters } from "@/features/dashboard/pages/leads/types/lead";
import { mockLeads } from "../data/mock-leads";
import {
  SortingState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";

interface UseLeadsProps {
  initialLeads?: Lead[];
}

export function useLeads({ initialLeads = mockLeads }: UseLeadsProps = {}) {
  const [filters, setFilters] = useState<LeadFilters>({
    status: "all",
    search: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      // Status filter
      if (filters.status !== "all" && lead.status !== filters.status) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          lead.leadNumber,
          lead.fullName,
          lead.email,
          lead.company,
        ].map((field) => field.toLowerCase());

        if (!searchableFields.some((field) => field.includes(searchLower))) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const leadDate = new Date(lead.date);
        if (filters.dateRange.from && leadDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && leadDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [initialLeads, filters]);

  // For TanStack table, we need to handle pagination and sorting separately
  const paginatedAndSortedLeads = useMemo(() => {
    // Early return if no filters
    if (filteredLeads.length === 0) return [];

    // Skip sorting if no sort criteria
    if (sorting.length === 0) {
      // Just apply pagination
      const startIdx = pagination.pageIndex * pagination.pageSize;
      const endIdx = startIdx + pagination.pageSize;
      return filteredLeads.slice(startIdx, endIdx);
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
    const sortedLeads = [...filteredLeads].sort((a, b) => {
      // Handle multi-sorting using sortingState array
      for (const sort of sorting) {
        const key = sort.id as keyof Lead;
        const compared = compareValues(a[key], b[key], sort.desc);
        if (compared !== 0) return compared;
      }
      return 0;
    });

    // Apply pagination
    const startIdx = pagination.pageIndex * pagination.pageSize;
    const endIdx = startIdx + pagination.pageSize;
    return sortedLeads.slice(startIdx, endIdx);
  }, [filteredLeads, sorting, pagination]);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
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
    // Raw filtered leads (no pagination applied)
    allLeads: filteredLeads,
    // Leads with pagination and sorting applied
    leads: paginatedAndSortedLeads,
    // Total count for pagination
    pageCount: Math.ceil(filteredLeads.length / pagination.pageSize),
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