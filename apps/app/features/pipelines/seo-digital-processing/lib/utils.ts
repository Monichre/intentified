import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToHttps = (inputUrl) => {
  if (!/^https?:\/\//i.test(inputUrl)) {
    return `https://${inputUrl}`;
  }
  return inputUrl;
};

/**
 * Removes empty entries from the headings object.
 * @param headings The headings object to filter.
 * @returns The filtered headings object without empty entries.
 */
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

/**
 * Removes the protocol (http/https) from the URL.
 * @param url The URL to process.
 * @returns The URL without the protocol.
 */
export function removeProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}

/**
 * Converts a score percentage to a letter grade.
 * @param scorePercentage The score percentage to convert.
 * @returns The corresponding letter grade.
 */
export function getGrade(scorePercentage: number): string {
  if (scorePercentage >= 90) {
    return "A";
  } else if (scorePercentage >= 80) {
    return "B";
  } else if (scorePercentage >= 70) {
    return "C";
  } else if (scorePercentage >= 60) {
    return "D";
  } else {
    return "F";
  }
}

/**
 * Computes the Levenshtein distance between two strings.
 * The Levenshtein distance is a measure of the difference between two sequences.
 * It is calculated as the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into the other.
 * @param a The first string.
 * @param b The second string.
 * @returns The Levenshtein distance between the two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  if (an === 0) return bn; // If the first string is empty, return the length of the second string
  if (bn === 0) return an; // If the second string is empty, return the length of the first string

  // Initialize the matrix
  const matrix = Array(bn + 1)
    .fill(null)
    .map(() => Array(an + 1).fill(null));

  // Fill the first row and column
  for (let i = 0; i <= an; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= bn; j += 1) matrix[j][0] = j;

  // Fill the rest of the matrix
  for (let i = 1; i <= bn; i += 1) {
    for (let j = 1; j <= an; j += 1) {
      const indicator = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1, // Deletion
        matrix[i - 1][j] + 1, // Insertion
        matrix[i - 1][j - 1] + indicator // Substitution
      );
    }
  }

  return matrix[bn][an]; // Return the final value in the matrix, which is the Levenshtein distance
}

/**
 * Calculates the semantic relevance of a title to a content body.
 * Uses Levenshtein distance to allow for flexible matching of words.
 * @param title The title string.
 * @param content The content string.
 * @returns The semantic relevance score, as a ratio of common words to total words in the title.
 */
export function calculateSemanticRelevance(
  title: string,
  content: string
): number {
  const titleWords = title.toLowerCase().match(/\w+/g); // Extract words from title and convert to lowercase
  const contentWords = content.toLowerCase().match(/\w+/g); // Extract words from content and convert to lowercase

  // Create sets from words to filter out duplicates
  const titleWordSet = new Set(titleWords);
  const contentWordSet = new Set(contentWords);

  // Use a more flexible matching strategy with Levenshtein distance
  const commonWords = Array.from(titleWordSet).filter((titleWord) =>
    Array.from(contentWordSet).some(
      (contentWord) => levenshteinDistance(titleWord, contentWord) <= 2 // Allow small threshold for close matches
    )
  );

  // Calculate relevance score as the ratio of common words to total words in title
  const relevanceScore = commonWords.length / titleWordSet.size;

  return relevanceScore; // Return the relevance score
}
