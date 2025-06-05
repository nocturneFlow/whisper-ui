"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound,
  Lock,
  Download,
  Share2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";
import { useSafeTranscriptionStore } from "../utils/useStores";
import { withErrorBoundary } from "../utils/withErrorBoundary";
import { AudioControls } from "./AudioControls";

// Wrapping with observer for MobX reactivity
const ChatViewBase = observer(
  ({
    transcriptionResult,
    activeSegment,
    isPlaying,
    filterSpeakers,
    jumpToSegment,
    copyText,
    formatTime,
    getSpeakerColor,
    getSpeakerGradient,
    getSpeakerName,
    getEmotionText,
    audioRef,
    audioLoaded,
    audioPosition,
    togglePlayback,
    handleProgressChange,
  }: ChatViewProps) => {
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const transcriptionStore = useTranscriptionStore();
    const {
      store: safeStore,
      error: storeError,
      exportTranscriptionAsText,
    } = useSafeTranscriptionStore();
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null); // Copy text to clipboard with enhanced error handling
    const copyTranscription = async () => {
      if (!transcriptionResult) return;

      setCopyError(null);

      try {
        // Use our enhanced safe store method if available
        if (exportTranscriptionAsText) {
          const formattedText = exportTranscriptionAsText(transcriptionResult);
          await navigator.clipboard.writeText(formattedText);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
          return;
        }

        // Fallback to direct store use if safe method not available
        const tempTranscriptionResult = {
          ...transcriptionResult,
          timestamp: new Date(), // Add timestamp required by TranscriptionResult interface
        };

        const text = transcriptionStore.exportTranscriptionAsText(
          tempTranscriptionResult
        );

        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
        setCopyError("Не удалось скопировать текст");
        setTimeout(() => setCopyError(null), 3000);
      }
    };

    return (
      <ScrollArea className="flex-1 p-0 relative flex flex-col overflow-auto">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              {" "}
              <TooltipTrigger asChild>
                <div
                  className={`bg-background/90 backdrop-blur-sm shadow-sm border 
                    ${
                      copySuccess
                        ? "border-green-500 bg-green-50/10"
                        : "border-border/50"
                    } 
                    rounded-full p-2 flex items-center gap-1.5 cursor-pointer group 
                    ${
                      copySuccess ? "" : "hover:border-primary/50"
                    } transition-all`}
                  onClick={copyTranscription}
                >
                  <Badge
                    variant={copySuccess ? "default" : "outline"}
                    className={
                      copySuccess
                        ? "bg-green-500/90 border-green-500/80 text-white text-xs py-0 pl-1 pr-2 gap-1"
                        : "bg-primary/20 border-primary/30 text-xs py-0 pl-1 pr-2 gap-1"
                    }
                  >
                    <Share2
                      className={`h-3 w-3 ${
                        copySuccess ? "text-white" : "text-primary"
                      }`}
                    />
                    <span
                      className={copySuccess ? "text-white" : "text-primary"}
                    >
                      {copySuccess ? "Скопировано!" : "Копировать"}
                    </span>
                  </Badge>
                  <span className="text-xs text-muted-foreground mr-1">
                    {copySuccess ? "Текст скопирован" : "Скопировать текст"}
                  </span>
                </div>
              </TooltipTrigger>{" "}
              <TooltipContent>
                <p className="text-xs">
                  {copySuccess
                    ? "Текст скопирован в буфер обмена"
                    : "Скопировать текст транскрипции"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
        </div>{" "}
        {/* Audio Controls */}
        {audioRef &&
          audioLoaded !== undefined &&
          audioPosition !== undefined &&
          togglePlayback &&
          handleProgressChange && (
            <AudioControls
              audioRef={audioRef}
              audioLoaded={audioLoaded}
              isPlaying={isPlaying}
              audioPosition={audioPosition}
              transcriptionResult={transcriptionResult}
              togglePlayback={togglePlayback}
              handleProgressChange={handleProgressChange}
            />
          )}
        {/* Error message if copy fails */}
        {copyError && (
          <div className="absolute -top-12 right-0 z-30">
            <Alert variant="destructive" className="py-2 px-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {copyError}
              </AlertDescription>
            </Alert>
          </div>
        )}
        {/* Store error message */}
        {storeError && (
          <div className="absolute -top-12 right-0 z-30">
            <Alert variant="destructive" className="py-2 px-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs flex items-center gap-2">
                <span>Ошибка хранилища данных</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Перезагрузить
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div ref={chatContainerRef} className="h-full w-full">
          <div className="space-y-2 pb-6 pt-3 px-2 pr-4">
            {transcriptionResult.segments.map((segment, index) => {
              const isOddSpeaker =
                segment.speaker.endsWith("00") ||
                segment.speaker.endsWith("02");

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
                        jumpToSegment={(idx) => {
                          const element = document.getElementById(
                            `segment-${idx}`
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }}
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
);

// Export with error boundary protection
export const ChatView = withErrorBoundary(ChatViewBase);
