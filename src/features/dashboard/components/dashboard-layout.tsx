"use client";

// External dependencies
import React from "react";
import { useIsClient } from "@uidotdev/usehooks";

// Internal components
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { Separator } from "@/components/ui/separator";
import { DashboardSkeleton } from "./dashboard-skeleton";

/**
 * Props interface for DashboardLayoutWrapper component
 */
type Props = {
  children: React.ReactNode;
};

/**
 * DashboardLayoutWrapper Component
 *
 * Main layout wrapper for dashboard pages.
 * Handles sidebar state and provides the basic layout structure with
 * sidebar, header, and content area.
 *
 * @param {Props} props - Component props
 * @param {React.ReactNode} props.children - Content to render in the main area
 */
function DashboardLayoutWrapper({ children }: Props) {
  const isClient = useIsClient();

  // Get sidebar open state from localStorage, with fallback to true
  const isOpen = isClient
    ? localStorage.getItem("sidebar-open")
      ? localStorage.getItem("sidebar-open") === "true"
      : true
    : true;

  // Show skeleton during initial client-side rendering
  if (!isClient) {
    return <DashboardSkeleton />;
  }

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar id="main-sidebar" />
      <SidebarInset
        className="flex flex-col md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0"
        role="main"
      >
        <DashboardHeader />
        <Separator className="bg-secondary" aria-hidden="true" />
        <div
          className="flex-1 overflow-auto p-4"
          aria-label="Dashboard content"
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayoutWrapper;
