"use client";
import { Logo } from "../../components/logo"; // Corrected import path
import { MessageSquare } from "lucide-react";

export function ConversationSidebar() {
  return (
    <div className="border-border flex h-full w-[250px] shrink-0 flex-col border-r bg-black">
      <div className="p-4">
        <Logo size="small" />
      </div>
      <div className="text-muted-foreground px-4 py-2 text-sm font-medium">
        Conversations
      </div>
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col">
          <div className="bg-secondary hover:bg-secondary/80 flex cursor-pointer items-center px-4 py-2">
            <span className="text-foreground font-medium">Conversation 1</span>
          </div>
          <div className="border-muted hover:bg-secondary/50 ml-4 cursor-pointer border-l-2 py-1 pl-4">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="h-3.5 w-3.5"
              >
                <path
                  d="M15 19.0009L8.99981 13.0007M8.99981 13.0007L15 7.00049M8.99981 13.0007H20M4 19.0009V5.00049"
                  stroke="#848486"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-muted-foreground text-sm">Main Branch</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-border border-t p-2">
        <div className="flex justify-center">
          <MessageSquare className="text-muted-foreground h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
