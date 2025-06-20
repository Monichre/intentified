import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/utils/utils";
import type { SignedIn } from "@clerk/nextjs";

import { usePathname } from "next/navigation";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Leads", href: "/dashboard/leads" },
    { label: "Analytics", href: "/dashboard/analytics" },
    { label: "Pipelines", href: "/dashboard/pipelines" },
    { label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <header className="relative z-50">
      {/* Logo/Brand on the left */}
      <div className="absolute top-4 left-4 sm:left-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt="Intentified"
            width={160}
            height={40}
            className="dark:invert"
          />
        </Link>
      </div>

      {/* Circular Family Button on the right */}
      <div className="absolute top-4 right-4 sm:right-6">
        <motion.button
          className="bg-primary text-primary-foreground relative z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          initial={false}
          animate={{
            scale: open ? 1.05 : 1,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Users size={24} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-background/60 fixed inset-0 z-40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              {/* Expanded Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  staggerChildren: 0.05,
                }}
                className="bg-background border-border absolute top-16 right-0 z-50 min-w-[200px] rounded-2xl border p-2 shadow-2xl"
              >
                <nav className="flex flex-col">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="bg-border my-2 h-px" />

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    className="flex items-center justify-between px-4 py-2"
                  >
                    <span className="text-muted-foreground text-sm">Theme</span>
                    <ModeToggle />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.05 }}
                    className="mt-2"
                  >
                    <SignedIn>
                      <Button
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
                        onClick={() => {
                          // Add sign out logic here
                          setOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </SignedIn>
                  </motion.div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
