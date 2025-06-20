"use client"
import type React from "react"
import { MessageSquare } from "lucide-react" // Bot and User icons are not used here, removed.
import { Checkbox } from "@/components/ui/checkbox" // Corrected import path

type MessageType = "bot" | "user"

type MessageProps = {
  type: MessageType
  content: React.ReactNode
  hasActions?: boolean
}

export function ChatMessage({ type, content, hasActions = false }: MessageProps) {
  return (
    <div className="flex gap-4 py-6 px-6 border-b border-border">
      <div className="flex-shrink-0 mt-1">
        <div className="bg-transparent h-6 w-6 flex items-center justify-center">
          {/* Using a generic message icon for now, can be customized based on 'type' */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <rect x="4" y="6" width="16" height="12" rx="2" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
            <path
              d="M4 9L12 13L20 9"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-foreground text-sm">
          {" "}
          {/* Added text-sm for consistency */}
          {content}
        </div>
        {hasActions && (
          <div className="mt-4">
            <MessageSquare className="h-4 w-4 text-muted-foreground inline mr-2" />
            <button className="text-xs text-muted-foreground hover:text-primary transition">Edit</button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ChatMessageQuestion({ question, options }: { question: string; options: string[] }) {
  // Create a slug from the question for unique IDs
  const questionSlug = question
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
  return (
    <div className="flex gap-4 py-6 px-6 border-b border-border">
      <div className="flex-shrink-0 mt-1">
        <div className="bg-transparent h-6 w-6 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <rect x="4" y="6" width="16" height="12" rx="2" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />
            <path
              d="M4 9L12 13L20 9"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1">
        <div className="text-foreground mb-4 text-sm">
          {" "}
          {/* Added text-sm */}
          <p>{question}</p>
        </div>
        <div className="space-y-3">
          {options.map((option, i) => (
            <div key={`${questionSlug}-opt-${i}`} className="flex items-center space-x-2">
              <Checkbox
                id={`${questionSlug}-option-${i}`}
                className="border-muted-foreground data-[state=checked]:bg-accent-green data-[state=checked]:border-accent-green data-[state=checked]:text-black"
              />
              <label
                htmlFor={`${questionSlug}-option-${i}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground group-hover:text-foreground data-[state=checked]:text-foreground"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
