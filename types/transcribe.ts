import { AudioFormat, AudioMetadata, AudioQuality } from "@/types/audio";

export interface TranscribeDemoRequest {
  file: File;
  language: "kk" | "ru" | "en";
  task: "transcribe" | "translate";
  enable_diarization: boolean;
  audioFormat?: AudioFormat;
  audioQuality?: AudioQuality;
  duration?: number;
  metadata?: AudioMetadata;
}

export interface TranscribeDemoResponse {
  id: number;
  text: string;
  audio_url: string;
  language: string;
  duration: number;
  filename: string;
  segments: [
    {
      start: number;
      end: number;
      speaker: "SPEAKER_00" | "SPEAKER_01" | "SPEAKER_02" | "SPEAKER_03";
      text: string;
      emotion: "hap" | "sad" | "angry" | "neutral";
      polished_text: string;
    }
  ];
  formatted_text: string;
  speakers: ("SPEAKER_00" | "SPEAKER_01" | "SPEAKER_02" | "SPEAKER_03")[];
  overall_emotion: string;
  polished_text: string;
}

export interface TranscribeDemoErrorResponse {
  detail: string;
}
