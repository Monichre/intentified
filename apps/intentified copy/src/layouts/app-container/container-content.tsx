"use client";

// External dependencies
import * as React from "react";

/**
 * ContainerContent Component
 *
 * Central content wrapper for the three-column dashboard layout.
 * Provides consistent padding and styling for the main content area.
 */
interface ContainerContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ContainerContent({
  children,
  className = "",
}: ContainerContentProps) {
  return (
    <main
      className={`flex-1 overflow-auto bg-[#0A0A0A] p-8 ${className}`}
      role="main"
      aria-label="Main content"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-full w-full">{children}</div>
      </div>
    </main>
  );
}
