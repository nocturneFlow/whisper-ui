"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Download, Share } from "lucide-react";
import { TranscriptionHeaderProps } from "../utils/types";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";
import { useSafeTranscriptionStore } from "../utils/useStores";
import { withErrorBoundary } from "../utils/withErrorBoundary";

const TranscriptionHeaderBase = observer(
  ({
    transcriptionResult,
    goBack,
    getEmotionText,
    formatTime,
  }: TranscriptionHeaderProps) => {
    const transcriptionStore = useTranscriptionStore();
    const { store: safeStore } = useSafeTranscriptionStore();

    // Calculate additional stats if result available
    const audioAnalysis = transcriptionStore.audioAnalysis;
    return (
      <header className="sticky top-0 bg-background/90 backdrop-blur-md z-10 shadow-sm">
        <div className="container max-w-screen-lg mx-auto py-4 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={goBack}
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-muted transition-all"
              title="Назад"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {transcriptionResult && (
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-medium">
                    {transcriptionResult.filename}
                  </h1>
                  {transcriptionResult.overall_emotion && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xl"
                      title={`Общее настроение: ${transcriptionResult.overall_emotion}`}
                    >
                      {
                        getEmotionText(
                          transcriptionResult.overall_emotion.toLowerCase()
                        ).emoji
                      }
                    </motion.span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  {" "}
                  <span className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {formatTime(transcriptionResult.duration)}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs h-5 bg-secondary/80 text-secondary-foreground border-secondary/50 font-normal"
                  >
                    {transcriptionResult.speakers.length}
                    {transcriptionResult.speakers.length === 1
                      ? " говорящий"
                      : " говорящих"}
                  </Badge>
                  {audioAnalysis.format && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 bg-muted/80 text-muted-foreground border-muted/50 font-normal"
                    >
                      {audioAnalysis.format}
                    </Badge>
                  )}
                  {audioAnalysis.quality && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 bg-primary/10 text-primary border-primary/30 font-normal"
                    >
                      Качество: {audioAnalysis.quality}
                    </Badge>
                  )}
                </div>
              </div>
            )}{" "}
          </div>
        </div>
      </header>
    );
  }
);

// Export with error boundary protection
export const TranscriptionHeader = withErrorBoundary(TranscriptionHeaderBase);
