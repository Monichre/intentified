"use client";

export function SupportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">Customer Support</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Get help with using our platform. Contact our support team, browse documentation, or view FAQs.
          </p>
        </div>
      </div>
    </div>
  );
} 