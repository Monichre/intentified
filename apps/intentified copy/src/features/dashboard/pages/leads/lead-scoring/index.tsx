"use client";

export function LeadScoringPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Lead Scoring</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Lead Scoring System</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Set up and manage your lead scoring criteria. Automatically prioritize leads based on their likelihood to convert.
          </p>
        </div>
      </div>
    </div>
  );
} 