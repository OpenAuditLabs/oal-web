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
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      fn.apply(this, args);
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
  let lastCall = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();
    const elapsed = now - lastCall;

    if (elapsed >= wait) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      fn.apply(this, args);
      lastCall = now;
    } else {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        lastCall = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, wait - elapsed);
    }
  };
}
