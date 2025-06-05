import { AuthStore } from "./AuthStore";
import { TranscriptionStore } from "./TranscriptionStore";
import { ChatSessionStore } from "./ChatSessionStore";

export class RootStore {
  authStore: AuthStore;
  transcriptionStore: TranscriptionStore;
  chatSessionStore: ChatSessionStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.transcriptionStore = new TranscriptionStore(this);
    this.chatSessionStore = new ChatSessionStore(this);
  }
}

// We'll use the context from StoreProvider.tsx
// Export the RootStore class which can be used as a type too

// These hooks will be imported from the providers/StoreProvider.tsx file instead
