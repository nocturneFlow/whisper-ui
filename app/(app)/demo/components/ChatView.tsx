"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { UserRound, Lock, Download } from "lucide-react";
import { TranscriptionBubble } from "./TranscriptionBubble";
import { ChatViewProps } from "../utils/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function ChatView({
  transcriptionResult,
  activeSegment,
  isPlaying,
  getSpeakerGradient,
  getSpeakerName,
}: ChatViewProps) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <ScrollArea className="flex-1 p-0 relative flex flex-col overflow-auto">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-background/90 backdrop-blur-sm shadow-sm border border-border/50 rounded-full p-2 flex items-center gap-1.5 cursor-not-allowed group">
                <Badge
                  variant="outline"
                  className="bg-primary/20 border-primary/30 text-xs py-0 pl-1 pr-2 gap-1"
                >
                  <Lock className="h-3 w-3 text-primary" />
                  <span className="text-primary">Premium</span>
                </Badge>
                <span className="text-xs text-muted-foreground mr-1">
                  Экспорт в PDF
                </span>
                <Download className="h-4 w-4 text-muted-foreground opacity-70 group-hover:text-primary/70 transition-colors" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Доступно после регистрации</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div ref={chatContainerRef} className="h-full w-full">
        <div className="space-y-2 pb-6 pt-3 px-2 pr-4">
          {transcriptionResult.segments.map((segment, index) => {
            const isOddSpeaker =
              segment.speaker.endsWith("00") || segment.speaker.endsWith("02");

            const isFirstInSequence =
              index === 0 ||
              transcriptionResult.segments[index - 1].speaker !==
                segment.speaker;

            const isLastInSequence =
              index === transcriptionResult.segments.length - 1 ||
              transcriptionResult.segments[index + 1].speaker !==
                segment.speaker;

            const isActive = index === activeSegment;

            // Using chart colors from globals.css for avatar variations
            const avatarColors = {
              SPEAKER_00: "bg-primary text-primary-foreground",
              SPEAKER_01: "bg-accent text-accent-foreground",
              SPEAKER_02: "bg-[var(--color-chart-3)] text-white",
              SPEAKER_03: "bg-[var(--color-chart-4)] text-white",
            };

            const avatarColor =
              avatarColors[segment.speaker as keyof typeof avatarColors] ||
              "bg-[var(--color-chart-5)] text-white";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                }}
                className={`flex w-full px-2 sm:px-6 ${
                  isFirstInSequence ? "mt-6" : "mt-1"
                }`}
                id={`segment-${index}`}
              >
                <div
                  className={`w-full flex ${
                    isOddSpeaker ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[85%] ${
                      isOddSpeaker ? "flex-row-reverse" : "flex-row"
                    } items-end gap-2 relative`}
                  >
                    {isFirstInSequence && (
                      <motion.div
                        className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full 
                          ${avatarColor}
                          flex items-center justify-center shadow-md
                          ${isOddSpeaker ? "ml-2" : "mr-2"}
                        `}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        }}
                      >
                        <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    )}
                    {!isFirstInSequence && (
                      <div
                        className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 ${
                          isOddSpeaker ? "ml-2" : "mr-2"
                        } opacity-0`}
                      ></div>
                    )}

                    <TranscriptionBubble
                      segment={segment}
                      isOddSpeaker={isOddSpeaker}
                      isFirstInSequence={isFirstInSequence}
                      isLastInSequence={isLastInSequence}
                      isActive={isActive}
                      index={index}
                      jumpToSegment={() => {}}
                      activeSegment={activeSegment}
                      isPlaying={isPlaying}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
