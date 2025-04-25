/**
 * Type declarations for the Screen Fold API
 * This API is experimental and not yet included in standard TypeScript definitions
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Fold_API
 */

interface FoldState {
  /**
   * The angle between the two screens. Ranges from 0 to 360 degrees.
   */
  angle: number;

  /**
   * The hinge width in CSS pixels.
   */
  hingeWidth: number;

  /**
   * The orientation of the hinge: "vertical" or "horizontal".
   */
  orientation: "vertical" | "horizontal";

  /**
   * The posture of the device: "folded", "continuous", "flat", etc.
   */
  posture: "folded" | "continuous" | "flat" | "unknown";
}

interface Screen {
  /**
   * Contains information about the fold state of the screen.
   * Part of the experimental Screen Fold API.
   */
  fold?: FoldState;
}

declare global {
  interface WindowEventMap {
    /**
     * The event fired when the fold state changes.
     */
    screenfold: Event;
  }
}
