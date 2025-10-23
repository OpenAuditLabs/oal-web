import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to detect if the current view is mobile based on a predefined breakpoint.
 * This hook is safe for Server-Side Rendering (SSR) as it initializes to `false`
 * and only performs client-side detection within a `useEffect` hook.
 *
 * @returns {boolean} `true` if the view is mobile, `false` otherwise.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Ensure window is defined before accessing it, for SSR safety.
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };

      // Set initial value
      checkIsMobile();

      // Add event listener for window resize
      window.addEventListener("resize", checkIsMobile);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", checkIsMobile);
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return isMobile;
}
