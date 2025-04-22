"use client";

import { useMemo } from "react";
import { Customer, CustomerStatus } from "@/features/dashboard/pages/customers/types/customer";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { CustomerActionsDropdown } from "./customers-actions-dropdown";

export const statusColors: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  blocked: "bg-red-100 text-red-800",
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const useCustomerColumns = () => {
  return useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "customerNumber",
        header: "Customer ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("customerNumber")}</div>
        ),
      },
      {
        accessorKey: "fullName",
        header: "Contact",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.getValue("fullName")}</span>
            <span className="text-sm text-muted-foreground">
              {row.original.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => <div>{row.getValue("company")}</div>,
      },
      {
        accessorKey: "dateJoined",
        header: "Date Joined",
        cell: ({ row }) => format(new Date(row.getValue("dateJoined")), "PP"),
      },
      {
        accessorKey: "totalSpent",
        header: "Total Spent",
        cell: ({ row }) => formatCurrency(row.getValue("totalSpent")),
      },
      {
        accessorKey: "lastPurchase",
        header: "Last Purchase",
        cell: ({ row }) => {
          const lastPurchase = row.getValue("lastPurchase") as string;
          return lastPurchase 
            ? format(new Date(lastPurchase), "PP") 
            : "No purchases yet";
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => <div>{row.getValue("location")}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as CustomerStatus;
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
        cell: ({ row }) => <CustomerActionsDropdown customer={row.original} />,
      },
    ],
    []
  );
}; 