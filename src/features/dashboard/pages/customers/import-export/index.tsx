"use client";

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

export function ImportExportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Import/Export Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="size-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Customer Data Management</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Import and export customer data in various formats. Easily migrate data between systems or create backups.
          </p>
        </div>
      </div>
    </div>
  );
} 