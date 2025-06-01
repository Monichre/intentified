"use client";

import { useMemo } from "react";
import { Invoice, InvoiceStatus } from "@/features/dashboard/pages/invoices/types/invoice";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceActionsDropdown } from "./invoices-actions-dropdown";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const statusColors: Record<InvoiceStatus, string> = {
  draft: "bg-slate-100 text-slate-800",
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-red-100 text-red-800",
};

export const useInvoiceColumns = () => {
  return useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("invoiceNumber")}</div>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.getValue("customerName")}</span>
            <span className="text-sm text-muted-foreground">
              {row.original.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Issue Date",
        cell: ({ row }) => format(new Date(row.getValue("date")), "PPp"),
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => format(new Date(row.getValue("dueDate")), "PPp"),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatCurrency(row.getValue("amount")),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as InvoiceStatus;
          return (
            <Badge className={statusColors[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <InvoiceActionsDropdown invoice={row.original} />,
      },
    ],
    []
  );
}; 