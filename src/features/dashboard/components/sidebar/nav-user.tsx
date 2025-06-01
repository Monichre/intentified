"use client";

// External dependencies
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

// Internal components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * NavUser Component
 *
 * User profile section in the dashboard sidebar footer.
 * Displays user information and provides a dropdown with user-related actions.
 */
export function NavUser() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { signOut } = useClerk();
  const { user } = useUser();

  // If user is not loaded yet, show default data
  const userData = {
    name: user?.fullName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
    avatar: user?.imageUrl || "/avatars/avatar.png",
  };

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer hover:bg-transparent hover:font-bold hover:underline hover:underline-offset-4"
              aria-label="User profile and options"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.avatar} alt={`${userData.name}'s profile`} />
                <AvatarFallback className="rounded-lg">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            role="menu"
            aria-label="User options"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={userData.avatar}
                    alt={`${userData.name}'s profile`}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem role="menuitem">
                <Sparkles aria-hidden="true" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem role="menuitem">
                <BadgeCheck aria-hidden="true" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem role="menuitem">
                <CreditCard aria-hidden="true" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem role="menuitem">
                <Bell aria-hidden="true" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} role="menuitem">
              <LogOut aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}