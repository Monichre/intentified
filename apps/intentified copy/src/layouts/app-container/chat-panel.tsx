"use client";

// External dependencies
import * as React from "react";
import { ChevronDown, Mic, AtSign, Send } from "lucide-react";

// Internal components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ChatPanel Component
 *
 * Right panel for the three-column dashboard layout.
 * Contains model selector, chat messages, and input area.
 */
export function ChatPanel() {
  const [selectedModel, setSelectedModel] = React.useState("Claude 3.5 Sonnet");
  const [message, setMessage] = React.useState("");

  return (
    <aside
      className="flex w-1/3 flex-col border-l border-[#2A2A2A] bg-[#0A0A0A]"
      role="complementary"
      aria-label="Chat panel"
    >
      {/* Header with Model Selector */}
      <div className="flex h-14 items-center justify-between border-b border-[#2A2A2A] px-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-white hover:bg-[#1F1F1F]"
              aria-label="Select AI model"
            >
              <div className="mr-2 h-4 w-4 rounded bg-[#3B82F6]" />
              {selectedModel}
              <ChevronDown className="ml-2 size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-48 border-[#2A2A2A] bg-[#1A1A1A]"
            role="menu"
          >
            {/* {models.map((model) => (
              <DropdownMenuItem
                key={model}
                onClick={() => setSelectedModel(model)}
                className="cursor-pointer text-white hover:bg-[#1F1F1F]"
                role="menuitem"
              >
                <div className="mr-2 h-4 w-4 rounded bg-[#3B82F6]" />
                {model}
              </DropdownMenuItem>
            ))} */}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
          aria-label="New chat"
        >
          New Chat
        </Button>
      </div>

      {/* Chat Content Area */}
      <div className="flex flex-1 flex-col px-8">
        {/* Welcome Message */}
        <div className="py-8 text-center">
          <h2 className="mb-2 text-2xl font-semibold text-white">
            Rise and shine, lionheart!
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Ask AI anything, @ to mention
          </p>
        </div>

        {/* Chat Prompts */}
        <ScrollArea className="mb-6 flex-1">
          <div className="space-y-3">
            {/* {chatPrompts.map((prompt, index) => (
              <button
                key={index}
                className="w-full cursor-pointer rounded-lg border border-transparent bg-[#1A1A1A] p-4 text-left text-sm text-white transition-colors hover:border-[#2A2A2A] hover:bg-[#1F1F1F]"
                aria-label={`Use prompt: ${prompt}`}
              >
                {prompt}
              </button>
            ))} */}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="pb-6">
          <div className="relative">
            <div className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#111111] p-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-1 text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
                aria-label="Add attachment"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </Button>

              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask AI anything, @ to mention"
                className="flex-1 border-none bg-transparent p-0 text-white placeholder:text-[#6B7280] focus:ring-0 focus:outline-none"
                aria-label="Chat message input"
              />

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-1 text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
                  aria-label="Mention someone"
                >
                  <AtSign className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-1 text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
                  aria-label="Voice input"
                >
                  <Mic className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-[#6B7280]">
            <span>Gemini 2.0 Flash • 23 Fresh</span>
            <span>⌘ + ↵ to send message</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
