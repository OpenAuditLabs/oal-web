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

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      fn(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean, lastFn: NodeJS.Timeout, lastTime: number;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(this, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
}
