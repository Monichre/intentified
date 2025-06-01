"use client";

export function PendingOrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pending Orders</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            This page shows all orders that are currently pending fulfillment or payment. Manage and process these orders to complete them.
          </p>
        </div>
      </div>
    </div>
  );
} 