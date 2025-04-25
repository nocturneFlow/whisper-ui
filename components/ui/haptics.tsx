"use client";

type FeedbackType = "success" | "error" | "warning" | "info" | "click";

/**
 * Provides haptic feedback for UI interactions (without sound)
 */
export const useHapticFeedback = () => {
  const trigger = (type: FeedbackType) => {
    // Only trigger haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      switch (type) {
        case "success":
          window.navigator.vibrate([50]);
          break;
        case "error":
          window.navigator.vibrate([100, 50, 100]);
          break;
        case "warning":
          window.navigator.vibrate([50, 20, 50]);
          break;
        case "info":
          window.navigator.vibrate([25]);
          break;
        case "click":
          window.navigator.vibrate([5]);
          break;
      }
    }
  };

  return { trigger };
};
