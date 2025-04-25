export type AudioFormat =
  | "mp3"
  | "wav"
  | "ogg"
  | "flac"
  | "webm"
  | "m4a"
  | "aac";

export type AudioQuality = "low" | "medium" | "high";

export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  sampleRate?: number;
  channels?: number;
  bitrate?: number;
  fileSize?: number;
  recordedAt?: Date;
}

export interface AudioProcessingOptions {
  removeNoise?: boolean;
  enhanceClarity?: boolean;
  normalizeVolume?: boolean;
  speedFactor?: number;
}
