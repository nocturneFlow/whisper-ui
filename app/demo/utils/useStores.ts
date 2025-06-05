"use client";

import { useState, useEffect } from "react";
import {
  useTranscriptionStore,
  useRootStore,
  useAuthStore,
  useChatSessionStore,
} from "@/providers/StoreProvider";
import { toJS } from "mobx";

/**
 * A utility hook to safely access the transcription store with additional helper methods
 * and proper error handling
 */
export function useSafeTranscriptionStore() {
  const [error, setError] = useState<Error | null>(null);

  // Safely access the store, catching any errors
  let store: any;
  try {
    store = useTranscriptionStore();
  } catch (err) {
    console.error("Error accessing transcription store:", err);
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error("Failed to access transcription store"));
    }
  }

  // Enhanced helper methods that work safely with the store
  const helpers = {
    // Get a serializable copy of the current transcription data
    getSerializedTranscription: () => {
      if (!store?.currentTranscription) return null;
      try {
        return toJS(store.currentTranscription);
      } catch (err) {
        console.error("Error serializing transcription data:", err);
        return null;
      }
    },

    // Safely copy transcription text to clipboard
    copyTranscriptionToClipboard: async () => {
      if (!store?.currentTranscription) return false;

      try {
        let text =
          store.currentTranscription.polished_text ||
          store.currentTranscription.text ||
          "";

        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error("Error copying to clipboard:", err);
        return false;
      }
    },

    // Safe wrapper for the store's transcribeAudio method
    safeTranscribeAudio: async (request: any) => {
      if (!store) throw new Error("Transcription store is not available");

      try {
        return await store.transcribeAudio(request);
      } catch (err) {
        // Re-throw with enhanced error message
        const errorMessage =
          err instanceof Error ? err.message : "Unknown transcription error";
        throw new Error(`Transcription failed: ${errorMessage}`);
      }
    },

    // Helper to handle long-running operations safely
    withProgressTracking: async (
      operation: () => Promise<any>,
      initialMessage: string
    ) => {
      if (!store) throw new Error("Transcription store is not available");

      // Set initial progress state
      store.setProgress?.({
        stage: "processing",
        progress: 0,
        message: initialMessage,
      });

      try {
        const result = await operation();
        return result;
      } catch (err) {
        // Handle error in progress tracking
        store.setError?.(
          err instanceof Error ? err.message : "Operation failed"
        );
        throw err;
      } finally {
        // Always clean up progress state
        setTimeout(() => {
          store.clearProgress?.();
        }, 2000);
      }
    },

    // Export transcript as formatted text
    exportTranscriptionAsText: (transcription: any) => {
      if (!store) return "";

      try {
        // Add timestamp if not present (needed for the store method to work)
        const transcriptionWithTimestamp = transcription.timestamp
          ? transcription
          : { ...transcription, timestamp: new Date() };

        return store.exportTranscriptionAsText(transcriptionWithTimestamp);
      } catch (err) {
        console.error("Error exporting transcription as text:", err);

        // Fallback to simple text export if store method fails
        let text = `Transcription\n`;
        if (transcription.filename) text += `File: ${transcription.filename}\n`;
        if (transcription.language)
          text += `Language: ${transcription.language}\n`;
        if (transcription.duration)
          text += `Duration: ${transcription.duration}s\n\n`;

        text += transcription.polished_text || transcription.text || "";
        return text;
      }
    },
  };

  return {
    store,
    error,
    ...helpers,
  };
}

/**
 * A utility hook to safely access any store with proper error handling
 */
export function useSafeStore(
  storeType: "root" | "auth" | "transcription" | "chatSession"
) {
  const [error, setError] = useState<Error | null>(null);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    try {
      let storeInstance;

      switch (storeType) {
        case "root":
          storeInstance = useRootStore();
          break;
        case "auth":
          storeInstance = useAuthStore();
          break;
        case "transcription":
          storeInstance = useTranscriptionStore();
          break;
        case "chatSession":
          storeInstance = useChatSessionStore();
          break;
        default:
          throw new Error(`Unknown store type: ${storeType}`);
      }

      setStore(storeInstance);
    } catch (err) {
      console.error(`Error accessing ${storeType} store:`, err);
      setError(
        err instanceof Error
          ? err
          : new Error(`Failed to access ${storeType} store`)
      );
    }
  }, [storeType]);

  return { store, error };
}
