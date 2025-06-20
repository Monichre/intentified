"use client"

export function DocumentPanel() {
  return (
    <div className="flex flex-col w-[350px] h-full border-l border-border bg-black shrink-0">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Product Requirements Document</h2>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col justify-center items-center h-full text-center">
          <p className="text-muted-foreground text-sm">PRD has not been generated yet.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Click &apos;Generate Docs&apos; in the chat controls to create it.
          </p>
        </div>
      </div>
    </div>
  )
}
