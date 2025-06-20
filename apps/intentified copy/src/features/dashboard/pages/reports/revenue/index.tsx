"use client";

export function RevenueReportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Revenue Report</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Revenue Analytics</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Track your business revenue over time. Analyze income sources, profit margins, and financial growth.
          </p>
        </div>
      </div>
    </div>
  );
} 