"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLeads } from "./hooks/use-leads";
import { LeadsTable } from "./components/leads-table";
import { LeadsFilters } from "./components/leads-filters";
import { Button } from "@/components/ui/button";

export function LeadsPage() {
  const {
    leads,
    allLeads,
    pageCount,
    filters,
    sorting,
    pagination,
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  } = useLeads();

  const isEmpty = allLeads.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/leads/new">
            <Button>
              <Plus className="size-4" />
              New Lead
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <LeadsFilters filters={filters} onFiltersChange={updateFilters} />
        </div>
        <div className="p-3">
          <LeadsTable
            leads={leads}
            totalRows={allLeads.length}
            sorting={sorting}
            onSort={handleSortingChange}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            pageCount={pageCount}
          />
        </div>
      </div>

      {isEmpty && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No leads found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter to find what you are looking
              for.
            </p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 