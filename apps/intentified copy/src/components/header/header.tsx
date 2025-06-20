"use client";

// External imports
import Link from "next/link";
import { useState } from "react";
import { Menu, Zap, Users } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// Internal imports
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
// import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";

/**
 * NavLink component for consistent styling of navigation links
 */
export const NavLink = ({
  href,
  isActive,
  onClick,
  children,
}: {
  href: string;
  isActive: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id) || document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Update the URL hash without jumping
        window.history.pushState(null, "", href);
      }
      if (onClick) onClick();
    }
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "relative rounded-md px-4 py-2 text-sm font-medium tracking-wide transition-all",
        isActive
          ? "bg-primary text-background"
          : "text-foreground hover:bg-background/80 hover:text-primary",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};

export function Header({ children }: { children?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const activeHash = ""; // Fix for linter error - would be provided by useActiveSection hook

  // Check if we're on a dashboard route
  const isDashboardView = pathname?.includes("dashboard");

  // If on dashboard, render the dashboard header instead
  if (isDashboardView) {
    return <DashboardHeader />;
  }

  return (
    <>
      {/* Desktop Header */}
      <header className={cn("fixed inset-x-0 top-4 z-50")}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-border/30 relative rounded-full border bg-black shadow-lg backdrop-blur-xl">
            <nav
              className="flex h-16 items-center justify-between px-4 sm:px-6"
              aria-label="Main navigation"
            >
              {/* Logo */}
              <Link
                href="/"
                className="group flex items-center gap-2.5"
                aria-label="Intentified homepage"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo-icon.png"
                    alt="Intentified"
                    width={30}
                    height={30}
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  href="/landing-two"
                  className={cn(
                    "relative rounded-md px-4 py-2 text-sm font-medium tracking-wide transition-all",
                    "hover:bg-background/80 hover:text-primary text-foreground",
                  )}
                >
                  Landing 2
                </Link>
                <Link
                  href="/landing-three"
                  className={cn(
                    "relative rounded-md px-4 py-2 text-sm font-medium tracking-wide transition-all",
                    "hover:bg-background/80 hover:text-primary text-foreground",
                  )}
                >
                  Landing 3
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <SignedIn>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-sm tracking-wide text-white"
                  >
                    <Link href="/dashboard" className="text-white">
                      Dashboard
                    </Link>
                  </Button>
                </SignedIn>
                <SignedOut>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-sm tracking-wide text-white"
                  >
                    <Link href="/sign-in" className="text-white">
                      Sign in
                    </Link>
                  </Button>
                </SignedOut>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-background/80 rounded-full p-2 transition-colors md:hidden"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu
                  className="h-5 w-5 text-black dark:text-white"
                  aria-hidden="true"
                />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-background/80 fixed inset-0 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="bg-background/95 border-border/50 fixed inset-x-0 top-0 border-b p-6">
            <div className="mt-20 flex flex-col gap-2 space-y-1">
              {navItems.map((item) => {
                const hash = `#${item.toLowerCase()}`;
                const isActive = activeHash === hash;
                return (
                  <NavLink
                    key={item}
                    href={hash}
                    isActive={isActive}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </NavLink>
                );
              })}
              <div className="border-border/50 mt-6 grid grid-cols-2 gap-3 border-t pt-6">
                <SignedIn>
                  <Button className="text-foreground w-full font-medium tracking-wide">
                    <Link href="/dashboard" className="col-span-2 w-full">
                      Dashboard
                    </Link>
                  </Button>
                </SignedIn>
                <SignedOut>
                  <Button
                    variant="outline"
                    className="text-foreground w-full font-medium tracking-wide"
                  >
                    <Link href="/sign-in" className="w-full">
                      Sign in
                    </Link>
                  </Button>
                  <Button className="text-background bg-primary w-full font-medium tracking-wide">
                    <Link href="/sign-up" className="w-full">
                      Get Started
                    </Link>
                  </Button>
                </SignedOut>
              </div>
              <div className="flex items-center justify-end pt-6">
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
