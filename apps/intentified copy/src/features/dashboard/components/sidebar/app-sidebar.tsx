"use client";

// External dependencies
import * as React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

// Internal components
import { NavMain } from "@/features/dashboard/components/sidebar/nav-main";
import { NavWorkspace } from "@/features/dashboard/components/sidebar/nav-workspace";
import { NavSecondary } from "@/features/dashboard/components/sidebar/nav-secondary";
import { NavUser } from "@/features/dashboard/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarMenus } from "@/data/sidebar-menus";

/**
 * AppSidebar Component
 *
 * Main application sidebar with navigation sections for the dashboard.
 * Fixed width of 112px according to visual specification.
 * Includes app logo/header, main navigation, workspace selection,
 * secondary links, and user profile.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  // Persist sidebar open state in localStorage
  React.useEffect(() => {
    localStorage.setItem("sidebar-open", open.toString());
  }, [open]);

  return (
    <Sidebar
      className="w-28 border-r border-[#2A2A2A] bg-[#111111]"
      variant="inset"
      collapsible="icon"
      {...props}
      aria-label="Main navigation"
    >
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/dashboard"
                className="flex items-center justify-center transition-colors hover:bg-[#1F1F1F]"
                aria-label="Go to dashboard home"
              >
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#3B82F6] text-white"
                  aria-hidden="true"
                >
                  <Zap className="size-4" />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavMain items={sidebarMenus.navMain} />
        <NavWorkspace workspaces={sidebarMenus.workspaces} />
        <NavSecondary items={sidebarMenus.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="p-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
