"use client";

import { motion } from "framer-motion";
import { TranscriptionBubbleProps } from "../utils/types";
import { getEmotionText } from "../utils/helpers";

export function TranscriptionBubble({
  segment,
  isOddSpeaker,
  isFirstInSequence,
  isActive,
}: TranscriptionBubbleProps) {
  const emotion = segment.emotion ? getEmotionText(segment.emotion) : null;

  // Using colors from globals.css
  const bubbleColorClass = isOddSpeaker
    ? "bg-primary/10 border-primary/20"
    : "bg-accent/10 border-accent/20";

  // Shadow based on active state
  const shadowClass = isActive ? "shadow-lg" : "shadow-sm";

  return (
    <div className="space-y-1 max-w-full">
      {isFirstInSequence && (
        <div
          className={`flex items-center mb-1 gap-2 ${
            isOddSpeaker ? "justify-end" : "justify-start"
          }`}
        >
          <p
            className={`text-xs font-medium ${
              isOddSpeaker ? "text-primary" : "text-accent"
            }`}
          >
            {segment.speaker.replace("SPEAKER_", "Говорящий ")}
          </p>
        </div>
      )}

      <motion.div
        className={`px-4 py-3 relative ${shadowClass} ${bubbleColorClass}
          ${isActive ? "ring-1 ring-ring" : ""}
          ${
            isOddSpeaker
              ? "rounded-xl rounded-tr-sm"
              : "rounded-xl rounded-tl-sm"
          }
          transition-all duration-200 ease-in-out
        `}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        layout
        transition={{
          layout: { duration: 0.2, type: "spring" },
        }}
      >
        <p className="text-sm sm:text-base leading-relaxed">
          {segment.polished_text || segment.text}
        </p>

        {emotion && (
          <div className="absolute -bottom-1.5 -right-1 flex items-center justify-center">
            <motion.div
              className="text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {emotion.emoji}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
