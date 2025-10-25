import * as React from "react";

const MOBILE_BREAKPOINT = 1024; // Increased breakpoint to 1024px

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(currentIsMobile);
      // console.log("Is mobile:", currentIsMobile, "Window width:", window.innerWidth); // Removed console log for debugging
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}