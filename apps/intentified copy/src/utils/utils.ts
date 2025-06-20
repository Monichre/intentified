import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeEmptyHeadings = (
  headings: Record<string, string[]>
): Record<string, string[]> => {
  const filteredHeadings: Record<string, string[]> = {};

  Object.entries(headings).forEach(([tag, entries]) => {
    const filteredEntries = entries.filter((entry) => entry.trim() !== "");
    if (filteredEntries.length > 0) {
      filteredHeadings[tag] = filteredEntries;
    }
  });

  return filteredHeadings;
};
