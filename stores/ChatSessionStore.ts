import { makeAutoObservable, runInAction } from "mobx";
import { RootStore } from "./index";
import { TranscriptionResult } from "./TranscriptionStore";
import { z } from "zod";

// Chat session types and schemas
export const ChatSessionSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  description: z.string().optional(),
  language: z.enum(["kk", "ru", "en"]),
  settings: z.object({
    enableDiarization: z.boolean(),
    enableEmotionDetection: z.boolean(),
    enableTextPolishing: z.boolean(),
    autoSave: z.boolean(),
  }),
});

export interface ChatSession {
  id: string;
  name: string;
  description?: string;
  language: "kk" | "ru" | "en";
  settings: {
    enableDiarization: boolean;
    enableEmotionDetection: boolean;
    enableTextPolishing: boolean;
    autoSave: boolean;
  };
  transcriptions: TranscriptionResult[];
  createdAt: Date;
  updatedAt: Date;
  userId?: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  type: "audio" | "text" | "system";
  content: string;
  audioUrl?: string;
  transcription?: TranscriptionResult;
  timestamp: Date;
  sender: "user" | "system";
}

export class ChatSessionStore {
  rootStore: RootStore;

  // State
  sessions: ChatSession[] = [];
  currentSession: ChatSession | null = null;
  messages: ChatMessage[] = [];
  isLoading = false;
  error: string | null = null;

  // Real-time state
  isRecording = false;
  recordingDuration = 0;
  recordingTimer: NodeJS.Timeout | null = null;

  // WebSocket connection for real-time features
  wsConnection: WebSocket | null = null;
  wsReconnectAttempts = 0;
  maxReconnectAttempts = 5;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.loadSessions();
  }

  // Load sessions from localStorage
  private loadSessions() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatSessions");
      if (stored) {
        try {
          const sessions = JSON.parse(stored);
          runInAction(() => {
            this.sessions = sessions.map((session: any) => ({
              ...session,
              createdAt: new Date(session.createdAt),
              updatedAt: new Date(session.updatedAt),
              transcriptions: session.transcriptions.map((t: any) => ({
                ...t,
                timestamp: new Date(t.timestamp),
              })),
            }));
          });
        } catch (error) {
          console.error("Failed to load chat sessions:", error);
        }
      }
    }
  }

  // Save sessions to localStorage
  private saveSessions() {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatSessions", JSON.stringify(this.sessions));
    }
  }

  // Create new chat session
  async createSession(data: z.infer<typeof ChatSessionSchema>) {
    this.setLoading(true);
    this.clearError();

    try {
      const validatedData = ChatSessionSchema.parse(data);

      const newSession: ChatSession = {
        id: this.generateSessionId(),
        name: validatedData.name,
        description: validatedData.description,
        language: validatedData.language,
        settings: validatedData.settings,
        transcriptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: this.rootStore.authStore.user?.id,
      };

      runInAction(() => {
        this.sessions.unshift(newSession);
        this.currentSession = newSession;
      });

      this.saveSessions();

      // Initialize WebSocket connection for real-time features
      if (this.rootStore.authStore.isAuthenticated) {
        this.initializeWebSocket(newSession.id);
      }

      return newSession;
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : "Failed to create session";
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Update chat session
  async updateSession(sessionId: string, updates: Partial<ChatSession>) {
    const sessionIndex = this.sessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error("Session not found");
    }

    runInAction(() => {
      this.sessions[sessionIndex] = {
        ...this.sessions[sessionIndex],
        ...updates,
        updatedAt: new Date(),
      };

      if (this.currentSession?.id === sessionId) {
        this.currentSession = this.sessions[sessionIndex];
      }
    });

    this.saveSessions();
  }

  // Delete chat session
  async deleteSession(sessionId: string) {
    runInAction(() => {
      this.sessions = this.sessions.filter((s) => s.id !== sessionId);
      if (this.currentSession?.id === sessionId) {
        this.currentSession = null;
        this.messages = [];
      }
    });

    this.saveSessions();

    // Close WebSocket if this was the current session
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  // Set current session
  setCurrentSession(sessionId: string) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    runInAction(() => {
      this.currentSession = session;
      this.messages = this.getSessionMessages(sessionId);
    });

    // Initialize WebSocket for real-time features
    if (this.rootStore.authStore.isAuthenticated) {
      this.initializeWebSocket(sessionId);
    }
  }

  // Add transcription to current session
  addTranscriptionToSession(transcription: TranscriptionResult) {
    if (!this.currentSession) {
      throw new Error("No active session");
    }

    const sessionIndex = this.sessions.findIndex(
      (s) => s.id === this.currentSession!.id
    );
    if (sessionIndex === -1) {
      throw new Error("Session not found");
    }

    runInAction(() => {
      this.sessions[sessionIndex].transcriptions.push(transcription);
      this.sessions[sessionIndex].updatedAt = new Date();
      this.currentSession = this.sessions[sessionIndex];
    });

    // Add message to chat
    this.addMessage({
      type: "audio",
      content: transcription.text,
      audioUrl: transcription.audio_url,
      transcription,
      sender: "user",
    });

    this.saveSessions();
  }

  // Add message to current session
  addMessage(messageData: Omit<ChatMessage, "id" | "sessionId" | "timestamp">) {
    if (!this.currentSession) {
      throw new Error("No active session");
    }

    const message: ChatMessage = {
      id: this.generateMessageId(),
      sessionId: this.currentSession.id,
      timestamp: new Date(),
      ...messageData,
    };

    runInAction(() => {
      this.messages.push(message);
    });

    // Send via WebSocket if connected
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(
        JSON.stringify({
          type: "new_message",
          data: message,
        })
      );
    }

    this.saveMessages();
  }

  // Get messages for a session
  private getSessionMessages(sessionId: string): ChatMessage[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`messages_${sessionId}`);
      if (stored) {
        try {
          return JSON.parse(stored).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        } catch (error) {
          console.error("Failed to load session messages:", error);
        }
      }
    }
    return [];
  }

  // Save messages for current session
  private saveMessages() {
    if (typeof window !== "undefined" && this.currentSession) {
      localStorage.setItem(
        `messages_${this.currentSession.id}`,
        JSON.stringify(this.messages)
      );
    }
  }

  // Initialize WebSocket connection
  private initializeWebSocket(sessionId: string) {
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/chat/${sessionId}`;

      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onopen = () => {
        console.log("WebSocket connected");
        this.wsReconnectAttempts = 0;

        // Send authentication if available
        if (this.rootStore.authStore.sessionToken) {
          this.wsConnection?.send(
            JSON.stringify({
              type: "auth",
              token: this.rootStore.authStore.sessionToken,
            })
          );
        }
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.wsConnection.onclose = () => {
        console.log("WebSocket disconnected");
        this.wsConnection = null;

        // Attempt to reconnect
        if (this.wsReconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.wsReconnectAttempts++;
            this.initializeWebSocket(sessionId);
          }, Math.pow(2, this.wsReconnectAttempts) * 1000);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
    }
  }

  // Handle WebSocket messages
  private handleWebSocketMessage(data: any) {
    switch (data.type) {
      case "transcription_progress":
        // Update transcription progress in real-time
        if (this.rootStore.transcriptionStore.isProcessing) {
          this.rootStore.transcriptionStore.setProgress(data.progress);
        }
        break;
      case "new_message":
        // Add new message from other sources
        runInAction(() => {
          this.messages.push({
            ...data.message,
            timestamp: new Date(data.message.timestamp),
          });
        });
        this.saveMessages();
        break;
      default:
        console.log("Unknown WebSocket message type:", data.type);
    }
  }

  // Start recording audio
  startRecording() {
    runInAction(() => {
      this.isRecording = true;
      this.recordingDuration = 0;
    });

    // Start recording timer
    this.recordingTimer = setInterval(() => {
      runInAction(() => {
        this.recordingDuration++;
      });
    }, 1000);

    // Add system message
    this.addMessage({
      type: "system",
      content: "Recording started...",
      sender: "system",
    });
  }

  // Stop recording audio
  stopRecording() {
    runInAction(() => {
      this.isRecording = false;
    });

    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    // Add system message
    this.addMessage({
      type: "system",
      content: `Recording stopped (${this.formatDuration(
        this.recordingDuration
      )})`,
      sender: "system",
    });

    runInAction(() => {
      this.recordingDuration = 0;
    });
  }

  // Format duration in MM:SS format
  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  // Export session data
  exportSession(sessionId: string): string {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const messages = this.getSessionMessages(sessionId);

    return JSON.stringify(
      {
        session,
        messages,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  // Import session data
  async importSession(data: string) {
    try {
      const parsed = JSON.parse(data);
      const session = {
        ...parsed.session,
        id: this.generateSessionId(), // Generate new ID to avoid conflicts
        createdAt: new Date(parsed.session.createdAt),
        updatedAt: new Date(),
        transcriptions: parsed.session.transcriptions.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        })),
      };

      runInAction(() => {
        this.sessions.unshift(session);
      });

      // Save messages separately
      if (parsed.messages && parsed.messages.length > 0) {
        const messages = parsed.messages.map((msg: any) => ({
          ...msg,
          sessionId: session.id,
          timestamp: new Date(msg.timestamp),
        }));

        if (typeof window !== "undefined") {
          localStorage.setItem(
            `messages_${session.id}`,
            JSON.stringify(messages)
          );
        }
      }

      this.saveSessions();
      return session;
    } catch (error) {
      throw new Error("Invalid session data format");
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  // Generate unique message ID
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  // Utility methods
  private setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  private clearError() {
    this.error = null;
  }

  setError(error: string) {
    this.error = error;
  }

  // Get session statistics
  getSessionStats(sessionId: string) {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    const messages = this.getSessionMessages(sessionId);
    const audioMessages = messages.filter((m) => m.type === "audio");
    const totalDuration = session.transcriptions.reduce(
      (acc, t) => acc + t.duration,
      0
    );

    const speakers = new Set();
    const emotions: Record<string, number> = {};

    session.transcriptions.forEach((t) => {
      if (t.segments) {
        t.segments.forEach((segment) => {
          speakers.add(segment.speaker);
          emotions[segment.emotion] = (emotions[segment.emotion] || 0) + 1;
        });
      }
    });

    return {
      totalMessages: messages.length,
      audioMessages: audioMessages.length,
      totalTranscriptions: session.transcriptions.length,
      totalDuration: Math.round(totalDuration),
      uniqueSpeakers: speakers.size,
      emotions,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  // Cleanup method
  cleanup() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }
}
