"use client";

export function GeneralSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">General Settings</h1>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">General Settings</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            Configure your application general settings. Manage account details,
            preferences, and notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
