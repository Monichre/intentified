"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useInvoices } from "./hooks/use-invoices";
import { InvoicesTable } from "./components/invoices-table";
import { InvoicesFilters } from "./components/invoices-filters";
import { Button } from "@/components/ui/button";

export function InvoicesPage() {
  const {
    invoices,
    allInvoices,
    pageCount,
    filters,
    sorting,
    pagination,
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  } = useInvoices();

  const isEmpty = allInvoices.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">All Invoices</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices/new">
            <Button>
              <Plus className="size-4" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <InvoicesFilters filters={filters} onFiltersChange={updateFilters} />
        </div>
        <div className="p-3">
          <InvoicesTable
            invoices={invoices}
            totalRows={allInvoices.length}
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
            <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
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