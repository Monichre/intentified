"use client"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button" // Corrected import path
import { Textarea } from "@/components/ui/textarea" // Corrected import path

export function ChatInput() {
  return (
    <div className="p-4 bg-black">
      <div className="relative">
        <Textarea
          placeholder="Anything else I should consider?"
          className="min-h-[60px] resize-none rounded-lg border border-border bg-secondary pr-14 text-foreground placeholder:text-muted-foreground"
        />
        <div className="absolute right-3 top-3">
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
