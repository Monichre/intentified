/**
 * Date formatting utilities using modern JavaScript Intl APIs
 * with explicit locales and configurations to avoid hydration errors
 */

/**
 * Configuration options for relative date formatting
 */
export interface RelativeDateOptions {
  /** Locale for formatting (defaults to en-US for consistency) */
  locale?: string;
  /** Show full day names instead of abbreviated (defaults to false) */
  fullDayNames?: boolean;
  /** Show full month names instead of abbreviated (defaults to false) */
  fullMonthNames?: boolean;
  /** The maximum hours to display as "X hours ago" before switching to time format (defaults to 6) */
  maxHoursAsRelative?: number;
  /** Format to use for timestamps (defaults to 12-hour) */
  timeFormat?: "12h" | "24h";
  /** Whether to allow future dates to be formatted relatively (defaults to true) */
  allowFuture?: boolean;
  /** Custom "now" date for testing purposes */
  now?: Date;
}

/**
 * Format a date relative to the current time using Intl.RelativeTimeFormat and Intl.DateTimeFormat
 * @param dateString ISO string or Date object
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatRelativeDate(
  dateString: string | Date,
  options: RelativeDateOptions = {},
): string {
  const {
    locale = "en-US",
    fullDayNames = false,
    fullMonthNames = false,
    maxHoursAsRelative = 6,
    timeFormat = "12h",
    allowFuture = true,
    now = new Date(),
  } = options;

  // Handle the input date
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Calculate time difference in milliseconds
  const diffMs = date.getTime() - now.getTime();
  const isPast = diffMs < 0;

  // If future dates aren't allowed and the date is in the future,
  // just return the formatted time
  if (!allowFuture && !isPast) {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: timeFormat === "12h",
    }).format(date);
  }

  // Convert to appropriate units - use floor for past, ceil for future to avoid premature transitions
  const absDiffMs = Math.abs(diffMs);
  const diffSeconds = isPast
    ? Math.floor(absDiffMs / 1000)
    : Math.ceil(absDiffMs / 1000);
  const diffMinutes = isPast
    ? Math.floor(diffSeconds / 60)
    : Math.ceil(diffSeconds / 60);
  const diffHours = isPast
    ? Math.floor(diffMinutes / 60)
    : Math.ceil(diffMinutes / 60);
  const diffDays = isPast
    ? Math.floor(diffHours / 24)
    : Math.ceil(diffHours / 24);

  // Use RelativeTimeFormat for recent dates
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  // Today - within 24 hours
  if (Math.abs(diffDays) < 1) {
    // If within a minute
    if (Math.abs(diffMinutes) < 1) {
      return rtf.format(isPast ? -diffSeconds : diffSeconds, "second");
    }

    // If within an hour
    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(isPast ? -diffMinutes : diffMinutes, "minute");
    }

    // If within the maxHoursAsRelative setting, show as hours ago
    if (Math.abs(diffHours) <= maxHoursAsRelative) {
      return rtf.format(isPast ? -diffHours : diffHours, "hour");
    }

    // Otherwise show time
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: timeFormat === "12h",
    }).format(date);
  }

  // Yesterday/Tomorrow - Capitalize first letter for "yesterday" and "tomorrow"
  if (Math.abs(diffDays) === 1) {
    const relativeDay = rtf.format(isPast ? -diffDays : diffDays, "day");
    // Ensure the first letter is capitalized
    return relativeDay.charAt(0).toUpperCase() + relativeDay.slice(1);
  }

  // Within the week
  if (Math.abs(diffDays) < 7) {
    return new Intl.DateTimeFormat(locale, {
      weekday: fullDayNames ? "long" : "short",
    }).format(date);
  }

  // Check if different year
  const dateYear = date.getFullYear();
  const nowYear = now.getFullYear();
  const showYear = dateYear !== nowYear;

  // More than a week - show date (and year if different)
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: fullMonthNames ? "long" : "short",
    ...(showYear && { year: "numeric" }),
  }).format(date);
}

/**
 * Format a date using Intl.DateTimeFormat with preset formats
 * @param dateString ISO string or Date object
 * @param format Predefined format type
 * @param locale Locale for formatting (defaults to en-US for consistency)
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  format: "short" | "medium" | "long" | "time" | "relative" = "medium",
  locale = "en-US",
): string {
  // Check for invalid date
  if (typeof dateString === "string") {
    const testDate = new Date(dateString);
    if (isNaN(testDate.getTime())) {
      return "Invalid date";
    }
  } else if (isNaN(dateString.getTime())) {
    return "Invalid date";
  }

  // Return relative format if requested
  if (format === "relative") {
    return formatRelativeDate(dateString, { locale });
  }

  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric", weekday: "long" },
    time: { hour: "numeric", minute: "2-digit", hour12: true },
  };

  return new Intl.DateTimeFormat(locale, formatOptions[format]).format(date);
}
