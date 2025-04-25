import * as React from "react";

/**
 * Hook to detect if a device is folded (for foldable devices)
 * @returns Whether the device is in a folded state
 */
export function useFoldDetection(): boolean {
  const [isFolded, setIsFolded] = React.useState(false);

  React.useEffect(() => {
    // Check for fold capabilities and set up event listeners
    const checkFoldState = () => {
      try {
        // Type-safe access to the fold API
        if (
          typeof window !== "undefined" &&
          window.screen &&
          "fold" in window.screen &&
          window.screen.fold
        ) {
          setIsFolded(window.screen.fold.posture === "folded");
        }
      } catch (error) {
        console.log("Fold detection not supported");
      }
    };

    checkFoldState();

    // Add fold change event listener if supported
    try {
      window.addEventListener("resize", checkFoldState);
      if ("screenfold" in window) {
        window.addEventListener("screenfold", checkFoldState);
      }
    } catch (error) {
      // Silently fail on unsupported browsers
    }

    return () => {
      try {
        window.removeEventListener("resize", checkFoldState);
        if ("screenfold" in window) {
          window.removeEventListener("screenfold", checkFoldState);
        }
      } catch (error) {
        // Silently fail on cleanup
      }
    };
  }, []);

  return isFolded;
}
