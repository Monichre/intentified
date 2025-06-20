import React from "react";

import { motion } from "framer-motion";

interface CommandEmptyProps {
  query: string;
}

export const CommandEmpty: React.FC<CommandEmptyProps> = ({ query }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center px-4 py-8 text-center"
    >
      <div className="bg-content3 border-primary-500/30 pulse-animation mb-4 flex h-12 w-12 items-center justify-center rounded-full border">
        <Icon icon="lucide:search-x" className="text-primary-400 text-2xl" />
      </div>
      <p className="text-foreground mb-1 font-medium">No results found</p>
      <p className="text-foreground-400 text-sm">
        No commands found for "
        <span className="text-primary-500 font-medium">{query}</span>"
      </p>
    </motion.div>
  );
};
