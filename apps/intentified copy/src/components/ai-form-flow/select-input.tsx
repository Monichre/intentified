"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Option } from "./types";

interface SelectInputProps {
  options: Option[];
  onSubmit: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  multiSelect?: boolean;
}

// Industry icons mapping
const industryIcons: Record<string, string> = {
  technology: "💻",
  "e-commerce": "🛒",
  healthcare: "🏥",
  finance: "💰",
  education: "📚",
  retail: "🛍️",
  manufacturing: "🏭",
  consulting: "💼",
  media: "📺",
  "real-estate": "🏠",
  automotive: "🚗",
  food: "🍕",
  travel: "✈️",
  fitness: "💪",
  gaming: "🎮",
  other: "🔧",
};

export function SelectInput({
  options,
  onSubmit,
  placeholder = "Select an option...",
  autoFocus = false,
  disabled = false,
  multiSelect = false,
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"dropdown" | "cards">("cards");
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-open cards view for industry questions
  useEffect(() => {
    if (autoFocus && options.length > 0) {
      // Check if this looks like an industry selection
      const hasIndustryOptions = options.some(
        (option) =>
          option.value.toLowerCase().includes("technology") ||
          option.value.toLowerCase().includes("healthcare") ||
          option.value.toLowerCase().includes("finance") ||
          option.label.toLowerCase().includes("technology") ||
          option.label.toLowerCase().includes("healthcare") ||
          option.label.toLowerCase().includes("finance"),
      );

      if (hasIndustryOptions) {
        setViewMode("cards");
        setIsOpen(true);
      } else {
        setViewMode("dropdown");
        if (containerRef.current) {
          const timer = setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.focus();
              setIsOpen(true);
            }
          }, 100);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [autoFocus, options]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          handleOptionSelect(options[highlightedIndex]);
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    if (isOpen && viewMode === "dropdown") {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, highlightedIndex, options, viewMode]);

  const handleOptionSelect = (option: Option) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      setSelectedValues(newValues);
    } else {
      setSelectedValue(option.value);
      setIsOpen(false);
      onSubmit(option.value);
    }
  };

  const handleSubmitMultiple = () => {
    if (selectedValues.length > 0) {
      onSubmit(selectedValues.join(", "));
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const option = options.find((o) => o.value === selectedValues[0]);
        return option?.label || selectedValues[0];
      }
      return `${selectedValues.length} selected`;
    } else {
      if (!selectedValue) return placeholder;
      const option = options.find((o) => o.value === selectedValue);
      return option?.label || selectedValue;
    }
  };

  const getIndustryIcon = (optionValue: string) => {
    const normalizedValue = optionValue.toLowerCase().replace(/\s+/g, "-");
    return industryIcons[normalizedValue] || industryIcons.other;
  };

  // Cards view for industry selection
  if (viewMode === "cards" && isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          {options.map((option, index) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className={`group relative rounded-lg border p-2 transition-all duration-200 hover:scale-102 hover:shadow-md ${
                selectedValue === option.value ||
                selectedValues.includes(option.value)
                  ? "border-cyan-400 bg-cyan-400/10 shadow-md shadow-cyan-400/20"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              } `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Icon */}
              <div className="mb-1 text-lg transition-transform group-hover:scale-105">
                {getIndustryIcon(option.value)}
              </div>

              {/* Label */}
              <div className="mb-0.5 text-xs leading-tight font-medium text-white">
                {option.label}
              </div>

              {/* Description - truncated for smaller cards */}
              {option.description && (
                <div className="line-clamp-2 text-[10px] leading-tight text-gray-400">
                  {option.description.length > 25
                    ? `${option.description.substring(0, 25)}...`
                    : option.description}
                </div>
              )}

              {/* Selected indicator - smaller */}
              {(selectedValue === option.value ||
                selectedValues.includes(option.value)) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-cyan-400"
                >
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-black"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/0 to-blue-500/0 transition-all duration-200 group-hover:from-cyan-400/5 group-hover:to-blue-500/5" />
            </motion.button>
          ))}
        </div>

        {multiSelect && selectedValues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center"
          >
            <motion.button
              type="button"
              onClick={handleSubmitMultiple}
              className="rounded-md bg-gradient-to-r from-cyan-400 to-teal-500 px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue with {selectedValues.length} selection
              {selectedValues.length > 1 ? "s" : ""}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Original dropdown view for other types of selections
  return (
    <div className="relative w-full" ref={containerRef} tabIndex={0}>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="form-input flex w-full items-center justify-between text-left"
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
      >
        <span
          className={
            selectedValue || selectedValues.length > 0
              ? "text-foreground"
              : "text-muted-foreground"
          }
        >
          {getDisplayValue()}
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card border-border absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`hover:bg-accent hover:text-accent-foreground w-full px-3 py-2 text-left transition-colors ${
                  index === highlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : ""
                } ${
                  (
                    multiSelect
                      ? selectedValues.includes(option.value)
                      : selectedValue === option.value
                  )
                    ? "bg-primary/10 text-primary font-medium"
                    : ""
                }`}
                whileHover={{ backgroundColor: "var(--accent)" }}
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      {option.description}
                    </div>
                  )}
                </div>
                {multiSelect && selectedValues.includes(option.value) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 inline-block"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}

            {multiSelect && selectedValues.length > 0 && (
              <div className="border-border border-t p-2">
                <motion.button
                  type="button"
                  onClick={handleSubmitMultiple}
                  className="w-full rounded-md bg-gradient-to-br from-cyan-400 to-teal-600 px-3 py-2 font-medium text-black transition-opacity hover:opacity-90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Select {selectedValues.length} option
                  {selectedValues.length > 1 ? "s" : ""}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
