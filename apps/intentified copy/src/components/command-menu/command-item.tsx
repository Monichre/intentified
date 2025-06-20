import React from "react";
import { motion } from "framer-motion";

interface CommandItemProps {
  icon: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

export const CommandItem: React.FC<CommandItemProps> = ({
  icon,
  label,
  shortcut,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        boxShadow: "0 0 8px rgba(59, 130, 246, 0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="text-foreground flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 transition-all duration-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary-500/20 text-primary flex h-6 w-6 items-center justify-center rounded-md">
          <Icon icon={icon} className="text-lg" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {shortcut && (
        <div className="flex items-center gap-1">
          {shortcut.split(" ").map((key, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-primary-400 mx-0.5">+</span>}
              <kbd className="bg-content3 text-primary-500 border-primary-500/30 rounded border px-1.5 py-0.5 text-xs font-medium">
                {key}
              </kbd>
            </React.Fragment>
          ))}
        </div>
      )}
    </motion.div>
  );
};
