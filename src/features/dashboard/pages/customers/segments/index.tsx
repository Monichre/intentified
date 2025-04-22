"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function SegmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customer Segments</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customers/segments/new">
            <Button>
              <Plus className="size-4" />
              New Segment
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Customer Segmentation</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Create and manage customer segments based on behavior, purchase history, demographics, and more.
          </p>
        </div>
      </div>
    </div>
  );
} 