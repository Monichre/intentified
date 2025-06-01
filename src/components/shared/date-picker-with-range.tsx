"use client";

// External dependencies
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Internal UI components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Props interface for DatePickerWithRange component
 * @interface DatePickerWithRangeProps
 * @property {DateRange | undefined} value - Currently selected date range
 * @property {(date: DateRange | undefined) => void} onChange - Callback function to update selected date range
 * @property {string} [className] - Optional CSS class name for additional styling
 */
interface DatePickerWithRangeProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  className?: string;
}

/**
 * DatePickerWithRange Component
 * A date range picker component with popover calendar allowing selection of start and end dates
 *
 * @component
 * @example
 * ```tsx
 * <DatePickerWithRange
 *   value={dateRange}
 *   onChange={handleDateRangeChange}
 *   className="my-date-picker"
 * />
 * ```
 */
export function DatePickerWithRange({
  value,
  onChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date-range-picker"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal md:w-[300px]",
              !value && "text-muted-foreground",
            )}
            aria-label="Choose date range"
            aria-haspopup="dialog"
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          role="dialog"
          aria-label="Calendar date range picker"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            aria-label="Select date range"
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
