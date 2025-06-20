"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/footer";
import Clock from "@/components/clock";

interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  shortcut?: string[];
}

const commandItems: CommandItem[] = [
  {
    id: "docs",
    name: "Documentation",
    description: "Open official documentation",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
    ),
    shortcut: ["⌘", "D"],
  },
  {
    id: "settings",
    name: "Settings",
    description: "Open settings page",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    shortcut: ["⌘", ","],
  },
  {
    id: "profile",
    name: "Profile",
    description: "View your profile information",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
      </svg>
    ),
    shortcut: ["⌘", "P"],
  },
  {
    id: "theme",
    name: "Switch Theme",
    description: "Change the application theme",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
      </svg>
    ),
    shortcut: ["⌘", "T"],
  },
];

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(commandItems);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle command menu with ⌘+K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearchQuery("");
        setSelectedItemIndex(0);
      }

      if (isOpen) {
        if (e.key === "Escape") {
          setIsOpen(false);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedItemIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === "Enter" && filteredItems.length > 0) {
          e.preventDefault();
          handleSelect(filteredItems[selectedItemIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedItemIndex]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(commandItems);
    } else {
      setFilteredItems(
        commandItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    setSelectedItemIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: CommandItem) => {
    console.log(`Selected: ${item.name}`);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center py-10 w-full text-sm font-mono text-neutral-600 h-24 animate-entry">
        <Link href="/craft" className="flex items-center space-x-1 text-xs font-semibold text-neutral-500 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="group-hover:text-neutral-400 transition-colors">Back to Craft</span>
        </Link>
        <div>
          <div style={{ opacity: 1, filter: "blur(0px)", transform: "none" }}>
            <Clock />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-full animate-entry delay-100">
        <p className="text-lg font-semibold text-zinc-300 font-geistSans">Command Menu</p>
        <p className="text-xs font-semibold text-neutral-500 font-geistMono mb-12">
          Boost productivity with lightning-fast keyboard navigation
        </p>
      </div>

      {/* Command Menu Demo */}
      <div className="mt-8 mb-16 animate-entry delay-200">
        <div className="relative overflow-hidden bg-neutral-800/20 p-8 rounded-lg shadow-inner flex flex-col items-center">
          <div className="mb-6 flex items-center bg-neutral-800/40 px-3 py-2 rounded-md border border-neutral-700/50 w-full max-w-md cursor-pointer" onClick={() => setIsOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-neutral-500">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <span className="text-neutral-500 text-sm">Search commands... (Press ⌘+K)</span>
          </div>

          {/* Hint */}
          <div className="mt-4 text-center text-sm text-neutral-400">
            Click the search bar or press <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-xs font-semibold text-neutral-300 border border-neutral-700">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-xs font-semibold text-neutral-300 border border-neutral-700">K</kbd> to open the command menu
          </div>

          {/* Demo items */}
          <div className="mt-8 w-full max-w-md">
            <p className="text-xs font-semibold text-neutral-500 font-geistMono mb-2">Available commands:</p>
            {commandItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-md mb-2 bg-neutral-800/30 border border-neutral-700/30">
                <div className="flex items-center">
                  <span className="text-purple-light mr-2">{item.icon}</span>
                  <span className="text-sm text-zinc-300">{item.name}</span>
                </div>
                {item.shortcut && (
                  <div className="flex items-center space-x-1">
                    {item.shortcut.map((key, i) => (
                      <kbd key={i} className="px-1.5 py-0.5 bg-neutral-800 rounded text-xs font-semibold text-neutral-300 border border-neutral-700">
                        {key}
                      </kbd>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code explanation */}
      <div className="animate-entry delay-300 mb-16">
        <div className="bg-neutral-800/20 p-6 rounded-lg border border-neutral-700/50">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">How It Works</h3>
          <p className="text-neutral-400 mb-4">
            This command menu provides a quick way to access features using keyboard shortcuts. Key features include:
          </p>
          <ul className="list-disc list-inside text-neutral-400 space-y-2 ml-2">
            <li>Global keyboard shortcut (⌘+K) to access from anywhere</li>
            <li>Fuzzy search for commands</li>
            <li>Keyboard navigation with arrow keys</li>
            <li>Visual feedback with animations and hover states</li>
            <li>Keyboard shortcuts for frequently used actions</li>
          </ul>
          <p className="text-neutral-400 mt-4">
            The implementation uses React hooks for state management and Framer Motion for smooth animations.
            The keyboard navigation is made possible with event listeners for key presses.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-md -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="overflow-hidden rounded-lg bg-neutral-800 shadow-2xl border border-neutral-700">
                <div className="flex items-center px-4 py-3 border-b border-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-neutral-500">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search commands..."
                    className="w-full bg-transparent outline-none text-zinc-200 placeholder-neutral-500 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <div className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-neutral-700 rounded text-xs font-semibold text-neutral-300">esc</kbd>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto py-2">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer ${
                          index === selectedItemIndex ? "bg-purple-darker" : "hover:bg-neutral-700"
                        }`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedItemIndex(index)}
                      >
                        <div className="flex items-center">
                          <span className={`mr-3 ${index === selectedItemIndex ? "text-purple-light" : "text-neutral-400"}`}>
                            {item.icon}
                          </span>
                          <div>
                            <p className="text-sm text-zinc-200">{item.name}</p>
                            <p className="text-xs text-neutral-500">{item.description}</p>
                          </div>
                        </div>
                        {item.shortcut && (
                          <div className="flex items-center space-x-1">
                            {item.shortcut.map((key, i) => (
                              <kbd
                                key={i}
                                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                                  index === selectedItemIndex
                                    ? "bg-purple/30 text-purple-light border-purple/30"
                                    : "bg-neutral-700 text-neutral-400 border-neutral-600"
                                } border`}
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-neutral-500 text-sm">No results found</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-neutral-700 text-xs text-neutral-500 flex justify-between">
                  <span>Navigate: ↑ ↓</span>
                  <span>Select: ↵</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="animate-entry delay-400">
        <Footer />
      </div>
    </>
  );
}
