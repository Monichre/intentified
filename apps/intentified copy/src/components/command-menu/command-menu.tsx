import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CommandItem } from "./command-item";
import { CommandGroup } from "./command-group";
import { CommandEmpty } from "./command-empty";
import "./command-menu.css";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Focus input when menu opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Filter menu items based on search query
  const getFilteredItems = () => {
    if (!searchQuery) return null;

    const query = searchQuery.toLowerCase();

    const actions = [
      {
        id: "new-file",
        icon: "lucide:file-plus",
        label: "New File",
        shortcut: "N",
      },
      {
        id: "new-tab",
        icon: "lucide:plus-square",
        label: "New Tab",
        shortcut: "T",
      },
      {
        id: "settings",
        icon: "lucide:settings",
        label: "Open Settings",
        shortcut: ",",
      },
      {
        id: "help",
        icon: "lucide:help-circle",
        label: "Help & Documentation",
        shortcut: "H",
      },
    ].filter((item) => item.label.toLowerCase().includes(query));

    const pages = [
      { id: "home", icon: "lucide:home", label: "Home", shortcut: "G H" },
      {
        id: "dashboard",
        icon: "lucide:layout-dashboard",
        label: "Dashboard",
        shortcut: "G D",
      },
      {
        id: "projects",
        icon: "lucide:folder",
        label: "Projects",
        shortcut: "G P",
      },
      {
        id: "calendar",
        icon: "lucide:calendar",
        label: "Calendar",
        shortcut: "G C",
      },
      {
        id: "messages",
        icon: "lucide:message-square",
        label: "Messages",
        shortcut: "G M",
      },
    ].filter((item) => item.label.toLowerCase().includes(query));

    const tools = [
      {
        id: "calculator",
        icon: "lucide:calculator",
        label: "Calculator",
        shortcut: "C",
      },
      {
        id: "color-picker",
        icon: "lucide:palette",
        label: "Color Picker",
        shortcut: "P",
      },
      {
        id: "screenshot",
        icon: "lucide:camera",
        label: "Take Screenshot",
        shortcut: "S",
      },
      { id: "timer", icon: "lucide:timer", label: "Timer", shortcut: "T M" },
    ].filter((item) => item.label.toLowerCase().includes(query));

    return { actions, pages, tools };
  };

  const filteredItems = getFilteredItems();
  const hasResults =
    filteredItems &&
    (filteredItems.actions.length > 0 ||
      filteredItems.pages.length > 0 ||
      filteredItems.tools.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="command-menu-overlay fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        >
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="bg-content1 command-menu-container futuristic-border w-full max-w-xl overflow-hidden rounded-lg"
          >
            <div className="border-primary-500/20 bg-content2 flex items-center gap-3 border-b p-4">
              <Icon icon="lucide:search" className="text-primary text-lg" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="underlined"
                className="flex-1 border-none shadow-none focus:ring-0"
                classNames={{
                  inputWrapper: "bg-transparent shadow-none",
                  input: "text-foreground placeholder:text-foreground-500",
                }}
              />
              <div className="flex items-center gap-1">
                <kbd className="bg-content3 text-primary-500 border-primary-500/30 rounded border px-2 py-1 text-xs font-semibold">
                  ESC
                </kbd>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!searchQuery ? (
                <div className="p-2">
                  <CommandGroup title="Quick Actions">
                    <CommandItem
                      icon="lucide:file-plus"
                      label="New File"
                      shortcut="N"
                      onSelect={() => {
                        console.log("New file");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:plus-square"
                      label="New Tab"
                      shortcut="T"
                      onSelect={() => {
                        console.log("New tab");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:settings"
                      label="Open Settings"
                      shortcut=","
                      onSelect={() => {
                        console.log("Settings");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:help-circle"
                      label="Help & Documentation"
                      shortcut="H"
                      onSelect={() => {
                        console.log("Help");
                        onClose();
                      }}
                    />
                  </CommandGroup>

                  <Divider className="my-2" />

                  <CommandGroup title="Go To">
                    <CommandItem
                      icon="lucide:home"
                      label="Home"
                      shortcut="G H"
                      onSelect={() => {
                        console.log("Home");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:layout-dashboard"
                      label="Dashboard"
                      shortcut="G D"
                      onSelect={() => {
                        console.log("Dashboard");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:folder"
                      label="Projects"
                      shortcut="G P"
                      onSelect={() => {
                        console.log("Projects");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:calendar"
                      label="Calendar"
                      shortcut="G C"
                      onSelect={() => {
                        console.log("Calendar");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:message-square"
                      label="Messages"
                      shortcut="G M"
                      onSelect={() => {
                        console.log("Messages");
                        onClose();
                      }}
                    />
                  </CommandGroup>

                  <Divider className="my-2" />

                  <CommandGroup title="Tools">
                    <CommandItem
                      icon="lucide:calculator"
                      label="Calculator"
                      shortcut="C"
                      onSelect={() => {
                        console.log("Calculator");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:palette"
                      label="Color Picker"
                      shortcut="P"
                      onSelect={() => {
                        console.log("Color picker");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:camera"
                      label="Take Screenshot"
                      shortcut="S"
                      onSelect={() => {
                        console.log("Screenshot");
                        onClose();
                      }}
                    />
                    <CommandItem
                      icon="lucide:timer"
                      label="Timer"
                      shortcut="T M"
                      onSelect={() => {
                        console.log("Timer");
                        onClose();
                      }}
                    />
                  </CommandGroup>
                </div>
              ) : (
                <div className="p-2">
                  {!hasResults ? (
                    <CommandEmpty query={searchQuery} />
                  ) : (
                    <>
                      {filteredItems?.actions.length > 0 && (
                        <CommandGroup title="Actions">
                          {filteredItems.actions.map((item) => (
                            <CommandItem
                              key={item.id}
                              icon={item.icon}
                              label={item.label}
                              shortcut={item.shortcut}
                              onSelect={() => {
                                console.log(item.label);
                                onClose();
                              }}
                            />
                          ))}
                        </CommandGroup>
                      )}

                      {filteredItems?.pages.length > 0 && (
                        <>
                          {filteredItems.actions.length > 0 && (
                            <Divider className="my-2" />
                          )}
                          <CommandGroup title="Pages">
                            {filteredItems.pages.map((item) => (
                              <CommandItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                shortcut={item.shortcut}
                                onSelect={() => {
                                  console.log(item.label);
                                  onClose();
                                }}
                              />
                            ))}
                          </CommandGroup>
                        </>
                      )}

                      {filteredItems?.tools.length > 0 && (
                        <>
                          {(filteredItems.actions.length > 0 ||
                            filteredItems.pages.length > 0) && (
                            <Divider className="my-2" />
                          )}
                          <CommandGroup title="Tools">
                            {filteredItems.tools.map((item) => (
                              <CommandItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                shortcut={item.shortcut}
                                onSelect={() => {
                                  console.log(item.label);
                                  onClose();
                                }}
                              />
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
