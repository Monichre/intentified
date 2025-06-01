"use client";

import {
  OrderFilters,
  OrderStatus,
} from "@/features/dashboard/pages/orders/types/order";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import { Search } from "lucide-react";

interface OrdersFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: Partial<OrderFilters>) => void;
}

const STATUS_OPTIONS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function OrdersFilters({
  filters,
  onFiltersChange,
}: OrdersFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search orders..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ status: value as OrderStatus | "all" })
          }
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePickerWithRange
          className="w-full md:w-auto"
          value={{
            from: filters.dateRange.from,
            to: filters.dateRange.to,
          }}
          onChange={(dateRange) =>
            onFiltersChange({
              dateRange: dateRange
                ? { from: dateRange.from, to: dateRange.to }
                : undefined,
            })
          }
        />
      </div>
    </div>
  );
}
