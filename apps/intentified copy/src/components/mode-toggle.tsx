"use client";

// External dependencies
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Internal UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ModeToggle Component
 * Provides a dropdown menu to switch between light, dark, and system theme modes
 *
 * @component
 * @example
 * ```tsx
 * <ModeToggle />
 * ```
 */
export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Change theme"
          aria-haspopup="menu"
        >
          <Sun
            className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            aria-hidden="true"
          />
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            aria-hidden="true"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="menu" aria-label="Theme options">
        <DropdownMenuItem onClick={() => setTheme("light")} role="menuitem">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} role="menuitem">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} role="menuitem">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
