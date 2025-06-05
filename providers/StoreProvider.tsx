"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { RootStore } from "@/stores";

let store: RootStore | undefined;

function initializeStore(): RootStore {
  const _store = store ?? new RootStore();

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;

  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

// Create a context for the store
const RootStoreContext = createContext<RootStore | null>(null);

// Provider component that wraps the app
export function MobXProvider({ children }: { children: ReactNode }) {
  const store = initializeStore();

  // Cleanup WebSocket connections when component unmounts
  React.useEffect(() => {
    return () => {
      store.chatSessionStore.cleanup();
    };
  }, [store]);

  return (
    <RootStoreContext.Provider value={store}>
      {children}
    </RootStoreContext.Provider>
  );
}

// Hook to use the store in components
export function useRootStore() {
  const context = useContext(RootStoreContext);
  if (context === null) {
    throw new Error("useRootStore must be used within a MobXProvider");
  }
  return context;
}

// Utility hooks to access individual stores
export const useAuthStore = () => useRootStore().authStore;
export const useTranscriptionStore = () => useRootStore().transcriptionStore;
export const useChatSessionStore = () => useRootStore().chatSessionStore;
