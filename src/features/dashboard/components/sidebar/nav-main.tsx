"use client";

// External dependencies
import { type LucideIcon } from "lucide-react";

// Internal components and hooks
import { useActiveMenu } from "@/hooks/use-active-menu";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarMenuWrapper } from "./sidebar-menu-wrapper";

/**
 * Props interface for NavMain component
 * @interface NavMainProps
 * @property {Object[]} items - Array of navigation items
 * @property {string} items[].title - Title of the navigation item
 * @property {string} items[].url - URL for the navigation item
 * @property {LucideIcon} items[].icon - Icon component for the navigation item
 * @property {Object[]} [items[].items] - Optional sub-items for the navigation item
 */
interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

/**
 * NavMain Component
 *
 * Primary navigation section in the dashboard sidebar.
 * Displays main platform navigation links with collapsible sub-items.
 */
export function NavMain({ items }: NavMainProps) {
  const { activeItems } = useActiveMenu(items);

  return (
    <SidebarGroup aria-label="Platform navigation">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {activeItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="hover:bg-transparent"
          >
            <SidebarMenuWrapper key={item.url} item={item} />
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
