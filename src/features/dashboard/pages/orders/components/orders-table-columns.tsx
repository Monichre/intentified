"use client";

import { useMemo } from "react";
import { Order, OrderStatus } from "@/features/dashboard/pages/orders/types/order";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { OrderActionsDropdown } from "./orders-actions-dropdown";

export const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const useOrderColumns = () => {
  return useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order Number",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("orderNumber")}</div>
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
        header: "Date",
        cell: ({ row }) => format(new Date(row.getValue("date")), "PPp"),
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
          const status = row.getValue("status") as OrderStatus;
          return (
            <Badge className={statusColors[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
          const items = row.getValue("items") as number;
          return (
            <div className="flex items-center gap-2">
              <span>{items}</span> items
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <OrderActionsDropdown order={row.original} />,
      },
    ],
    []
  );
};
