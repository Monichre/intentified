"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoicesTablePaginationProps<TData> {
  table: Table<TData>;
  totalRows: number;
}

export function InvoicesTablePagination<TData>({
  table,
  totalRows,
}: InvoicesTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 gap-y-4 px-2 md:flex-row">
      <div className="flex w-full items-center space-x-2 md:w-auto">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-muted-foreground w-full flex-1 text-sm md:w-auto">
        {totalRows} row(s) total
      </div>
      <div className="flex flex-wrap items-center space-x-6 gap-y-4 lg:space-x-8">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="size-4" />{" "}
            <span className="hidden md:block">First</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="size-4" />{" "}
            <span className="hidden md:block">Previous</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="size-4" />{" "}
            <span className="hidden md:block">Next</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="size-4" />{" "}
            <span className="hidden md:block">Last</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
