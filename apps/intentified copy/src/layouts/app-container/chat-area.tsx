"use client"
import { ChatMessage, ChatMessageQuestion } from "./chat-message" // Corrected import path
import { ChatInput } from "./chat-input" // Corrected import path
import { Mail, MessageSquare, SunMoon } from "lucide-react"

export function ChatArea() {
  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-border bg-black shrink-0">
        <span className="text-sm font-medium text-foreground">API Requests</span>
        <span className="ml-auto text-sm text-muted-foreground">0 / 70</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-black">
        {" "}
        {/* Changed overflow to overflow-y-auto */}
        <div className="h-full">
          {" "}
          {/* This div might not be needed if ScrollArea is used, but keeping for now */}
          <ChatMessage
            type="bot" // Added type prop
            content={
              <>
                <p className="mb-4">
                  Hello! I can help you plan new apps from scratch, or new features on top of your codebase. We&apos;ll
                  walk through each decision together, to fully spec out all the details of your app.
                </p>
                <p>
                  If you don&apos;t understand a decision, just ask me to explain it- you can also branch the
                  conversation to get a second opinion. At the end, you can click Generate Docs to generate a
                  step-by-step implementation plan for Cursor/Lovable/Bolt.
                </p>
              </>
            }
          />
          <ChatMessageQuestion
            question="How comfortable are you with code?"
            options={[
              "I'm fairly comfortable with code.",
              "I'm not too comfortable with code, explain technical decisions to me.",
            ]}
          />
          <ChatMessageQuestion
            question="What are we building?"
            options={[
              "An app for my own use",
              "A minimal MVP for my startup",
              "A new feature on top of my existing codebase.",
            ]}
          />
        </div>
      </div>
      <div className="border-t border-border py-2 px-4 flex items-center bg-black shrink-0">
        <span className="text-sm text-muted-foreground">
          Have some thoughts? Tell me what sucks, is good, or meh at:
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <SunMoon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <ChatInput />
    </div>
  )
}
