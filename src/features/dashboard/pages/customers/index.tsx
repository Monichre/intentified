"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useCustomers } from "./hooks/use-customers";
import { CustomersTable } from "./components/customers-table";
import { CustomersFilters } from "./components/customers-filters";
import { Button } from "@/components/ui/button";

export function CustomersPage() {
  const {
    customers,
    allCustomers,
    pageCount,
    filters,
    sorting,
    pagination,
    updateFilters,
    handleSortingChange,
    handlePaginationChange,
    handleClearFilters,
  } = useCustomers();

  const isEmpty = allCustomers.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customers/new">
            <Button>
              <Plus className="size-4" />
              New Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <CustomersFilters filters={filters} onFiltersChange={updateFilters} />
        </div>
        <div className="p-3">
          <CustomersTable
            customers={customers}
            totalRows={allCustomers.length}
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
            <h3 className="mt-4 text-lg font-semibold">No customers found</h3>
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