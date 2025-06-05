"use client";

import { motion } from "framer-motion";
import { TranscriptionBubbleProps } from "../utils/types";
import { formatTime, getEmotionText } from "../utils/helpers";
import { observer } from "mobx-react-lite";
import { Clock, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { withErrorBoundary } from "../utils/withErrorBoundary";

// Wrap with error boundary for resilience
const TranscriptionBubbleBase = observer(
  ({
    segment,
    isOddSpeaker,
    isFirstInSequence,
    isActive,
    index,
    jumpToSegment,
    activeSegment,
    isPlaying,
  }: TranscriptionBubbleProps) => {
    const emotion = segment.emotion ? getEmotionText(segment.emotion) : null;
    const duration = segment.end - segment.start;

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
        )}{" "}
        <motion.div
          className={`px-4 py-3 pb-5 relative ${shadowClass} ${bubbleColorClass}
          ${isActive ? "ring-2 ring-ring/60" : ""}
          ${
            isOddSpeaker
              ? "rounded-xl rounded-tr-sm"
              : "rounded-xl rounded-tl-sm"
          }
          transition-all duration-200 ease-in-out
          hover:shadow-md cursor-pointer
          group
        `}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          layout
          onClick={() => jumpToSegment(index)}
          whileHover={{ scale: 1.01 }}
          transition={{
            layout: { duration: 0.2, type: "spring" },
          }}
        >
          <p className="text-sm sm:text-base leading-relaxed">
            {segment.text || segment.text}
          </p>

          {/* Bottom row with timestamp and controls */}
          <div
            className={`absolute bottom-1 ${
              isOddSpeaker ? "right-3" : "left-3"
            } flex items-center gap-2 text-muted-foreground text-xs`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(segment.start)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <p>Начало сегмента: {formatTime(segment.start)}</p>
                  <p>Конец сегмента: {formatTime(segment.end)}</p>
                  <p>Длительность: {formatTime(duration)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="hidden group-hover:flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArrowRight
                      className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100 hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        jumpToSegment(index);
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Перейти к этому сегменту</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

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
);

// Export with error boundary protection
export const TranscriptionBubble = withErrorBoundary(TranscriptionBubbleBase);
