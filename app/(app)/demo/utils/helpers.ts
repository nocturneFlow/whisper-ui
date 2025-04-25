import { EmotionInfo } from "./types";

/**
 * Formats seconds into MM:SS display format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Gets the color scheme for a speaker's UI elements
 */
export const getSpeakerColor = (speaker: string): string => {
  const speakerNum = parseInt(speaker.replace("SPEAKER_", ""));
  const colors = [
    "bg-blue-500/10 border-blue-300/30 text-blue-600 hover:bg-blue-500/15",
    "bg-rose-500/10 border-rose-300/30 text-rose-600 hover:bg-rose-500/15",
    "bg-amber-500/10 border-amber-300/30 text-amber-600 hover:bg-amber-500/15",
    "bg-emerald-500/10 border-emerald-300/30 text-emerald-600 hover:bg-emerald-500/15",
    "bg-violet-500/10 border-violet-300/30 text-violet-600 hover:bg-violet-500/15",
    "bg-cyan-500/10 border-cyan-300/30 text-cyan-600 hover:bg-cyan-500/15",
    "bg-indigo-500/10 border-indigo-300/30 text-indigo-600 hover:bg-indigo-500/15",
    "bg-pink-500/10 border-pink-300/30 text-pink-600 hover:bg-pink-500/15",
  ];
  return colors[speakerNum % colors.length];
};

/**
 * Gets the gradient color for a speaker's avatar
 */
export const getSpeakerGradient = (speaker: string): string => {
  const speakerNum = parseInt(speaker.replace("SPEAKER_", ""));
  const gradients = [
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-rose-400 to-rose-600",
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-emerald-400 to-emerald-600",
    "bg-gradient-to-br from-violet-400 to-violet-600",
    "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
  ];
  return gradients[speakerNum % gradients.length];
};

/**
 * Gets formatted emotion text, emoji and color scheme
 */
export const getEmotionText = (emotion: string): EmotionInfo => {
  const emotionMap: Record<string, EmotionInfo> = {
    hap: {
      text: "Радость",
      emoji: "😊",
      color: "text-green-500 bg-green-500/10 border-green-200/30",
    },
    sad: {
      text: "Грусть",
      emoji: "😔",
      color: "text-blue-500 bg-blue-500/10 border-blue-200/30",
    },
    angry: {
      text: "Злость",
      emoji: "😠",
      color: "text-red-500 bg-red-500/10 border-red-200/30",
    },
    neutral: {
      text: "Нейтрально",
      emoji: "😐",
      color: "text-gray-500 bg-gray-500/10 border-gray-200/30",
    },
  };

  return (
    emotionMap[emotion] || {
      text: emotion,
      emoji: "❓",
      color: "text-purple-500 bg-purple-500/10 border-purple-200/30",
    }
  );
};

/**
 * Gets speaker name from speaker ID
 */
export const getSpeakerName = (speaker: string): string => {
  const speakerNumber = parseInt(speaker.replace("SPEAKER_", "")) + 1;
  return `Говорящий ${speakerNumber}`;
};
