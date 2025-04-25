import { TranscribeDemoResponse } from "@/types/transcribe";
import { RefObject } from "react";

export type EmotionInfo = {
  text: string;
  emoji: string;
  color: string;
};

export type SpeakerSegment = TranscribeDemoResponse["segments"][0];

export interface TranscriptionBubbleProps {
  segment: SpeakerSegment;
  isOddSpeaker: boolean;
  isFirstInSequence: boolean;
  isLastInSequence: boolean;
  isActive: boolean;
  index: number;
  jumpToSegment: (index: number) => void;
  activeSegment: number | null;
  isPlaying: boolean;
}

export interface AudioControlsProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioLoaded: boolean;
  isPlaying: boolean;
  audioPosition: number;
  transcriptionResult: TranscribeDemoResponse;
  togglePlayback: () => void;
  handleProgressChange: (value: number[]) => void;
}

export interface SpeakerFiltersProps {
  transcriptionResult: TranscribeDemoResponse;
  filterSpeakers: string[];
  toggleSpeakerFilter: (speaker: string) => void;
  getSpeakerGradient: (speaker: string) => string;
  getSpeakerName: (speaker: string) => string;
}

export interface TranscriptionHeaderProps {
  transcriptionResult: TranscribeDemoResponse | null;
  goBack: () => void;
  getSpeakerName: (speaker: string) => string;
  getEmotionText: (emotion: string) => EmotionInfo;
  formatTime: (seconds: number) => string;
}

export interface ChatViewProps {
  transcriptionResult: TranscribeDemoResponse;
  activeSegment: number | null;
  isPlaying: boolean;
  filterSpeakers: string[];
  jumpToSegment: (index: number) => void;
  copyText: (text: string) => void;
  formatTime: (seconds: number) => string;
  getSpeakerColor: (speaker: string) => string;
  getSpeakerGradient: (speaker: string) => string;
  getSpeakerName: (speaker: string) => string;
  getEmotionText: (emotion: string) => EmotionInfo;
}

export interface TextViewProps {
  transcriptionResult: TranscribeDemoResponse;
  goBack: () => void;
  getEmotionText: (emotion: string) => EmotionInfo;
}
