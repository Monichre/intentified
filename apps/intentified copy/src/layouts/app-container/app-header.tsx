"use client";

// External dependencies
import * as React from "react";
import Link from "next/link";
import { Zap, Search, MessageSquare, Plus } from "lucide-react";

// Internal components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

/**
 * AppHeader Component
 *
 * Top header for the three-column dashboard layout.
 * Contains logo, search, navigation tabs, and user profile.
 */
export function AppHeader() {
  const { user } = useUser();

  const userData = {
    name: user?.fullName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "user@example.com",
    avatar: user?.imageUrl || "/avatars/avatar.png",
  };

  return (
    <header
      className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#2A2A2A] bg-[#111111] px-6"
      role="banner"
      aria-label="Application header"
    >
      {/* Left section - Logo and Search */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Go to dashboard home"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#3B82F6] text-white">
            <Zap className="size-4" />
          </div>
          <span className="text-sm font-semibold text-white">Intentified</span>
        </Link>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 transform text-[#6B7280]" />
          <Input
            placeholder="Search..."
            className="h-9 w-64 border-[#2A2A2A] bg-[#1A1A1A] pl-10 text-white placeholder:text-[#6B7280] focus:border-[#3B82F6]"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Center section - Navigation Tabs */}
      <nav
        className="flex items-center gap-6"
        role="navigation"
        aria-label="Main navigation"
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-[#9CA3AF] transition-colors hover:bg-[#1F1F1F] hover:text-white"
          aria-label="Create new item"
        >
          <Plus className="mr-2 size-4" />
          Create
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#9CA3AF] transition-colors hover:bg-[#1F1F1F] hover:text-white"
          aria-label="Market insights"
        >
          Market
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#9CA3AF] transition-colors hover:bg-[#1F1F1F] hover:text-white"
          aria-label="Learning resources"
        >
          Learn
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-[#9CA3AF] transition-colors hover:bg-[#1F1F1F] hover:text-white"
          aria-label="Planning tools"
        >
          Plan
        </Button>
      </nav>

      {/* Right section - User Profile */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#9CA3AF] transition-colors hover:bg-[#1F1F1F] hover:text-white"
          aria-label="Open chat"
        >
          <MessageSquare className="size-4" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage
            src={userData.avatar}
            alt={`${userData.name}'s profile`}
          />
          <AvatarFallback className="bg-[#2A2A2A] text-xs text-white">
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
