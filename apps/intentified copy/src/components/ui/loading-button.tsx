"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "./loading-spinner";

const buttonCopy = {
  idle: "Generate with ai",
  loading: <Spinner size={16} color="rgba(0, 0, 0, 0.65)" />,
  success: "Success!",
  error: "Try again!",
} as const;

export function LoadingButton({
  status,
  type = "button",
  disabled,
}: {
  status: "loading" | "idle" | "success" | "error";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className="blue-button "
      disabled={status === "loading" || disabled}
      //   onClick={handleClick}
      type={type}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          key={status}
        >
          {buttonCopy[status]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
