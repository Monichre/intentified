"use client";

import { Invoice } from "@/features/dashboard/pages/invoices/types/invoice";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { InvoicesTablePagination } from "./invoices-table-pagination";
import { useInvoiceColumns } from "./invoices-table-columns";
import { InvoicesTableHeaderCell } from "./invoices-table-header-cell";
import { Separator } from "@/components/ui/separator";

interface InvoicesTableProps {
  invoices: Invoice[];
  totalRows: number;
  sorting: SortingState;
  onSort: OnChangeFn<SortingState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  pageCount: number;
}

export function InvoicesTable({
  invoices,
  totalRows,
  sorting,
  onSort,
  pagination,
  onPaginationChange,
  pageCount,
}: InvoicesTableProps) {
  const columns = useInvoiceColumns();

  const table = useReactTable({
    data: invoices,
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount,
    onSortingChange: onSort,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <InvoicesTableHeaderCell key={header.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator />
      <InvoicesTablePagination table={table} totalRows={totalRows} />
    </div>
  );
} 