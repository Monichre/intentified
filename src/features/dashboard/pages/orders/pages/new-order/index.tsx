"use client";

export function NewOrderPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Order</h1>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">New Order</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            This page shows all orders that have been successfully completed and
            delivered to customers. Review past orders and generate reports.
          </p>
        </div>
      </div>
    </div>
  );
}
