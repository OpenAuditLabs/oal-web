import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date into a short, localized date and time string.
 * @param date The date to format, can be a Date object or a string.
 * @returns A string representing the formatted date and time.
 * @throws {TypeError} If the provided date is invalid.
 */
export function formatShortDate(date: string | Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new TypeError('Invalid date provided to formatShortDate');
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(d);
}
