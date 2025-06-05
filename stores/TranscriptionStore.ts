import { makeAutoObservable, runInAction } from "mobx";
import {
  TranscribeDemoRequest,
  TranscribeDemoResponse,
  TranscribeDemoErrorResponse,
} from "@/types/transcribe";
import { RootStore } from "./index";
import { z } from "zod";

// Enhanced Zod validation schemas
export const TranscriptionRequestSchema = z.object({
  file: z.instanceof(File, { message: "Valid audio file is required" }),
  language: z
    .enum(["kk", "ru", "en"], {
      message: "Invalid language selection",
    })
    .optional(),
  task: z.enum(["transcribe", "translate"], {
    message: "Invalid task selection",
  }),
  enable_diarization: z.boolean(),
  audioFormat: z.string().optional(),
  audioQuality: z.string().optional(),
  duration: z.number().positive().optional(),
});

export interface TranscriptionSegment {
  start: number;
  end: number;
  speaker: "SPEAKER_00" | "SPEAKER_01" | "SPEAKER_02" | "SPEAKER_03";
  text: string;
  emotion: "hap" | "sad" | "angry" | "neutral";
  polished_text: string;
}

export interface TranscriptionResult extends TranscribeDemoResponse {
  timestamp: Date;
  sessionId?: string;
}

export interface TranscriptionProgress {
  stage: "uploading" | "processing" | "analyzing" | "complete" | "error";
  progress: number;
  message: string;
}

export class TranscriptionStore {
  rootStore: RootStore;

  // State
  currentTranscription: TranscriptionResult | null = null;
  transcriptionHistory: TranscriptionResult[] = [];
  isProcessing = false;
  error: string | null = null;
  progress: TranscriptionProgress | null = null;

  // Audio analysis state
  audioAnalysis = {
    duration: 0,
    format: "",
    quality: "",
    fileSize: 0,
  };

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.loadTranscriptionHistory();
  }

  // Load transcription history from localStorage
  private loadTranscriptionHistory() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("transcriptionHistory");
      if (stored) {
        try {
          const history = JSON.parse(stored);
          runInAction(() => {
            this.transcriptionHistory = history.map((item: any) => ({
              ...item,
              timestamp: new Date(item.timestamp),
            }));
          });
        } catch (error) {
          console.error("Failed to load transcription history:", error);
        }
      }
    }
  }

  // Save transcription history to localStorage
  private saveTranscriptionHistory() {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "transcriptionHistory",
        JSON.stringify(this.transcriptionHistory)
      );
    }
  }

  // Transcribe audio file
  async transcribeAudio(
    request: z.infer<typeof TranscriptionRequestSchema>,
    sessionId?: string
  ) {
    this.setProcessing(true);
    this.clearError();
    this.setProgress({
      stage: "uploading",
      progress: 0,
      message: "Preparing audio file...",
    });

    try {
      // Validate request
      const validatedRequest = TranscriptionRequestSchema.parse(request);

      // Analyze audio file
      await this.analyzeAudioFile(validatedRequest.file);

      // Update progress
      this.setProgress({
        stage: "uploading",
        progress: 25,
        message: "Uploading audio file...",
      }); // Create FormData
      const formData = new FormData();
      formData.append("file", validatedRequest.file);
      if (validatedRequest.language) {
        formData.append("language", validatedRequest.language);
      }
      formData.append("task", validatedRequest.task);
      formData.append(
        "enable_diarization",
        validatedRequest.enable_diarization.toString()
      );

      if (sessionId) {
        formData.append("session_id", sessionId);
      }

      // Update progress
      this.setProgress({
        stage: "processing",
        progress: 50,
        message: "Processing audio with Whisper AI...",
      });

      // Make API request
      const response = await fetch("/api/transcribe/demo", {
        method: "POST",
        body: formData,
        headers: this.rootStore.authStore.sessionToken
          ? {
              Authorization: `Bearer ${this.rootStore.authStore.sessionToken}`,
            }
          : {},
      });

      // Update progress
      this.setProgress({
        stage: "analyzing",
        progress: 75,
        message: "Analyzing speech patterns and emotions...",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          (result as TranscribeDemoErrorResponse).detail ||
            "Transcription failed"
        );
      }

      const transcriptionResult: TranscriptionResult = {
        ...(result as TranscribeDemoResponse),
        timestamp: new Date(),
        sessionId,
      };

      // Update progress
      this.setProgress({
        stage: "complete",
        progress: 100,
        message: "Transcription completed successfully!",
      });

      runInAction(() => {
        this.currentTranscription = transcriptionResult;
        this.transcriptionHistory.unshift(transcriptionResult);

        // Keep only last 50 transcriptions
        if (this.transcriptionHistory.length > 50) {
          this.transcriptionHistory = this.transcriptionHistory.slice(0, 50);
        }
      });

      this.saveTranscriptionHistory();

      // Clear progress after delay
      setTimeout(() => {
        this.clearProgress();
      }, 2000);

      return transcriptionResult;
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : "Transcription failed";
        this.setProgress({
          stage: "error",
          progress: 0,
          message: this.error,
        });
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isProcessing = false;
      });
    }
  }

  // Analyze audio file
  private async analyzeAudioFile(file: File) {
    return new Promise<void>((resolve) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        runInAction(() => {
          this.audioAnalysis = {
            duration: audio.duration,
            format: file.type,
            quality: this.determineAudioQuality(file),
            fileSize: file.size,
          };
        });
        resolve();
      };

      audio.onerror = () => {
        runInAction(() => {
          this.audioAnalysis = {
            duration: 0,
            format: file.type,
            quality: "unknown",
            fileSize: file.size,
          };
        });
        resolve();
      };

      audio.src = URL.createObjectURL(file);
    });
  }

  // Determine audio quality based on file size and type
  private determineAudioQuality(file: File): string {
    const sizeInMB = file.size / (1024 * 1024);

    if (file.type.includes("wav") || file.type.includes("flac")) {
      return "high";
    } else if (sizeInMB > 5) {
      return "medium";
    } else {
      return "standard";
    }
  }

  // Get transcription by ID
  getTranscriptionById(id: number): TranscriptionResult | null {
    return this.transcriptionHistory.find((t) => t.id === id) || null;
  }

  // Delete transcription from history
  deleteTranscription(id: number) {
    runInAction(() => {
      this.transcriptionHistory = this.transcriptionHistory.filter(
        (t) => t.id !== id
      );
      if (this.currentTranscription?.id === id) {
        this.currentTranscription = null;
      }
    });
    this.saveTranscriptionHistory();
  }

  // Clear all transcription history
  clearHistory() {
    runInAction(() => {
      this.transcriptionHistory = [];
      this.currentTranscription = null;
    });
    this.saveTranscriptionHistory();
  }

  // Export transcription as JSON
  exportTranscription(transcription: TranscriptionResult): string {
    return JSON.stringify(transcription, null, 2);
  }

  // Export transcription as text
  exportTranscriptionAsText(transcription: TranscriptionResult): string {
    let text = `Transcription - ${transcription.filename}\n`;
    text += `Language: ${transcription.language}\n`;
    text += `Duration: ${transcription.duration}s\n`;
    text += `Date: ${transcription.timestamp.toLocaleString()}\n\n`;

    if (transcription.segments && transcription.segments.length > 0) {
      text += "Segments:\n";
      transcription.segments.forEach((segment, index) => {
        text += `[${this.formatTime(segment.start)} - ${this.formatTime(
          segment.end
        )}] `;
        text += `${segment.speaker}: ${segment.text}\n`;
        if (segment.polished_text !== segment.text) {
          text += `  Polished: ${segment.polished_text}\n`;
        }
        text += `  Emotion: ${segment.emotion}\n\n`;
      });
    } else {
      text += `Full Text:\n${transcription.text}\n\n`;
      if (transcription.polished_text) {
        text += `Polished Text:\n${transcription.polished_text}\n`;
      }
    }

    return text;
  }

  // Format time in MM:SS format
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  // Utility methods
  private setProcessing(processing: boolean) {
    this.isProcessing = processing;
  }

  private clearError() {
    this.error = null;
  }

  setError(error: string) {
    this.error = error;
  }
  // Make setProgress public so it can be used by external components
  setProgress(progress: TranscriptionProgress) {
    this.progress = progress;
  }

  // Make clearProgress public so it can be used by external components
  clearProgress() {
    this.progress = null;
  }

  // Get current transcription stats
  get currentStats() {
    if (!this.currentTranscription) return null;

    const segments = this.currentTranscription.segments || [];
    const speakers = new Set(segments.map((s) => s.speaker));
    const emotions = segments.reduce((acc, segment) => {
      acc[segment.emotion] = (acc[segment.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSegments: segments.length,
      uniqueSpeakers: speakers.size,
      emotions,
      duration: this.currentTranscription.duration,
      wordCount: this.currentTranscription.text.split(" ").length,
    };
  }
}
