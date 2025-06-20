"use client";

// External dependencies
import * as React from "react";

// Internal components
import { AppHeader } from "@/layouts/app-container/app-header";
import { ToolsPanel } from "@/layouts/app-container/tools-panel";
import { ContainerContent } from "@/layouts/app-container/container-content";
import { ChatPanel } from "@/layouts/app-container/chat-panel";

/**
 * AppContainer Component
 *
 * Three-column layout container for the dashboard application.
 * Implements the visual specification with:
 * - Left Tools Panel (280px fixed width)
 * - Main Content Area (flexible width)
 * - Right Chat Panel (776px fixed width)
 */
export function AppContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A]">
      {/* Left Tools Panel - 280px fixed width */}
      <ToolsPanel />

      {/* Main Content Area - Flexible width */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <ContainerContent>{children}</ContainerContent>
      </div>

      {/* Right Chat Panel - 776px fixed width */}
      <ChatPanel />
    </div>
  );
}
