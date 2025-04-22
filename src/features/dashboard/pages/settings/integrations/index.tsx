"use client";

export function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Manage Integrations</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Connect your application with other services and platforms. Manage API connections, webhooks, and third-party integrations.
          </p>
        </div>
      </div>
    </div>
  );
} 