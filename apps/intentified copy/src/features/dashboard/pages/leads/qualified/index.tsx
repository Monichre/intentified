"use client";

export function QualifiedLeadsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Qualified Leads</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Qualified Leads</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            View and manage your qualified leads. These are leads that have been vetted and are ready for the next steps in your sales process.
          </p>
        </div>
      </div>
    </div>
  );
} 