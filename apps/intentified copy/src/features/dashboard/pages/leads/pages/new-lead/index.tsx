"use client";

export function NewLeadPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Lead</h1>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">New Lead</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            This page shows all leads that have been successfully completed and
            delivered to customers. Review past leads and generate reports.
          </p>
        </div>
      </div>
    </div>
  );
}
