import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Determines if the current viewport width is considered mobile based on a predefined breakpoint.
 * This hook is SSR-safe, initializing to `false` and updating on the client side.
 *
 * @returns `true` if the viewport is mobile, `false` otherwise.
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
