"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import { TranscriptionHeaderProps } from "../utils/types";

export function TranscriptionHeader({
  transcriptionResult,
  goBack,
  getSpeakerName,
  getEmotionText,
  formatTime,
}: TranscriptionHeaderProps) {
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
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
