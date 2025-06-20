"use client";

// External dependencies
import type React from "react";
import { useIsClient } from "@uidotdev/usehooks";

// Internal components
import { AppContainer } from "@/layouts/app-container/app-container";
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
 * Main layout wrapper for dashboard pages using the three-column design.
 * Integrates AppHeader, AppSidebar, and ChatPanel in a unified layout.
 * Implements the visual specification with proper spacing and styling.
 *
 * @param {Props} props - Component props
 * @param {React.ReactNode} props.children - Content to render in the main area
 */
function DashboardLayoutWrapper({ children }: Props) {
  const isClient = useIsClient();

  // Show skeleton during initial client-side rendering
  if (!isClient) {
    return <DashboardSkeleton />;
  }

  return <AppContainer>{children}</AppContainer>;
}

export default DashboardLayoutWrapper;
