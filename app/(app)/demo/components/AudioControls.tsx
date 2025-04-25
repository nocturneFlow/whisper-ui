"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle } from "lucide-react";
import { AudioControlsProps } from "../utils/types";
import { formatTime } from "../utils/helpers";

export function AudioControls({
  audioLoaded,
  isPlaying,
  audioPosition,
  transcriptionResult,
  togglePlayback,
  handleProgressChange,
}: AudioControlsProps) {
  if (!audioLoaded || !transcriptionResult) {
    return null;
  }

  return (
    <motion.div
      className="mt-2 px-4 sm:px-8 py-1"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 p-0 flex items-center justify-center text-muted-foreground"
          onClick={togglePlayback}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <PauseCircle className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <PlayCircle className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <span className="text-xs text-muted-foreground w-10">
          {formatTime(audioPosition)}
        </span>
        <Slider
          value={[audioPosition]}
          min={0}
          max={transcriptionResult.duration}
          step={0.1}
          onValueChange={handleProgressChange}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-10">
          {formatTime(transcriptionResult.duration)}
        </span>
      </div>
    </motion.div>
  );
}
