"use client";

export function PaidInvoicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Paid Invoices</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Paid Invoices</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            View all paid invoices. Access payment history and generate financial reports.
          </p>
        </div>
      </div>
    </div>
  );
}