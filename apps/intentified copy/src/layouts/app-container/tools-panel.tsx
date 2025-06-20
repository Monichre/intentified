"use client";

// External dependencies
import * as React from "react";
import {
  Settings,
  Search,
  Bookmark,
  History,
  Zap,
  Database,
  FileText,
  BarChart3,
  Users,
  Mail,
  Calendar,
  Star,
} from "lucide-react";

// Internal components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

/**
 * ToolsPanel Component
 *
 * Left panel for the three-column dashboard layout.
 * Contains quick access tools, favorites, and navigation shortcuts.
 */
export function ToolsPanel() {
  const [activeCategory, setActiveCategory] = React.useState("favorites");

  const toolCategories = [
    {
      id: "favorites",
      label: "Favorites",
      icon: Star,
      tools: [
        { name: "Lead Scoring", icon: BarChart3, shortcut: "⌘ + L" },
        { name: "Email Templates", icon: Mail, shortcut: "⌘ + E" },
        { name: "Analytics", icon: BarChart3, shortcut: "⌘ + A" },
        { name: "Quick Search", icon: Search, shortcut: "⌘ + K" },
      ],
    },
    {
      id: "automation",
      label: "Automation",
      icon: Zap,
      tools: [
        { name: "Workflows", icon: Zap, shortcut: "⌘ + W" },
        { name: "Triggers", icon: Settings, shortcut: "⌘ + T" },
        { name: "Pipelines", icon: Database, shortcut: "⌘ + P" },
      ],
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      tools: [
        { name: "Documents", icon: FileText, shortcut: "⌘ + D" },
        { name: "Templates", icon: Bookmark, shortcut: "⌘ + B" },
        { name: "Library", icon: Database, shortcut: "⌘ + Y" },
      ],
    },
  ];

  const recentActions = [
    { name: "Lead qualified", time: "2m ago", type: "success" },
    { name: "Email sent", time: "5m ago", type: "info" },
    { name: "Pipeline updated", time: "12m ago", type: "warning" },
    { name: "Report generated", time: "1h ago", type: "success" },
  ];

  return (
    <aside
      className="flex w-[280px] flex-col border-r border-[#2A2A2A] bg-[#0A0A0A]"
      role="complementary"
      aria-label="Tools panel"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#2A2A2A] px-6">
        <h2 className="text-sm font-semibold text-white">Tools</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
          aria-label="Tools settings"
        >
          <Settings className="size-4" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col px-6">
        {/* Quick Actions */}
        <div className="py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-12 flex-col gap-1 text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
            >
              <Search className="size-4" />
              <span className="text-xs">Search</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-12 flex-col gap-1 text-[#9CA3AF] hover:bg-[#1F1F1F] hover:text-white"
            >
              <Zap className="size-4" />
              <span className="text-xs">Automate</span>
            </Button>
          </div>
        </div>

        {/* Tool Categories */}
        <ScrollArea className="flex-1">
          <div className="space-y-6">
            {toolCategories.map((category) => (
              <div key={category.id}>
                <div className="mb-3 flex items-center gap-2">
                  <category.icon className="size-4 text-[#6B7280]" />
                  <h3 className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
                    {category.label}
                  </h3>
                </div>
                <div className="space-y-1">
                  {category.tools.map((tool, index) => (
                    <button
                      key={index}
                      className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm transition-colors hover:bg-[#1F1F1F]"
                      aria-label={tool.name}
                    >
                      <div className="flex items-center gap-2">
                        <tool.icon className="size-4 text-[#9CA3AF]" />
                        <span className="text-white">{tool.name}</span>
                      </div>
                      <span className="text-xs text-[#6B7280]">
                        {tool.shortcut}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Recent Activity */}
        <div className="border-t border-[#2A2A2A] py-4">
          <div className="mb-3 flex items-center gap-2">
            <History className="size-4 text-[#6B7280]" />
            <h3 className="text-xs font-medium tracking-wide text-[#6B7280] uppercase">
              Recent
            </h3>
          </div>
          <div className="space-y-2">
            {recentActions.slice(0, 3).map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      action.type === "success"
                        ? "bg-green-500"
                        : action.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span className="text-white">{action.name}</span>
                </div>
                <span className="text-[#6B7280]">{action.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
