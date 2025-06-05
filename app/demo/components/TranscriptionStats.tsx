"use client";

import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";
import { Card } from "@/components/ui/card";
import {
  Clock,
  User,
  VolumeX,
  Volume2,
  BarChart3,
  MoveHorizontal,
} from "lucide-react";

interface TranscriptionStatsProps {
  formatTime: (seconds: number) => string;
}

export const TranscriptionStats = observer(
  ({ formatTime }: TranscriptionStatsProps) => {
    const transcriptionStore = useTranscriptionStore();
    const transcriptionResult = transcriptionStore.currentTranscription;

    if (!transcriptionResult) return null;

    // Calculate stats
    const totalSegments = transcriptionResult.segments.length;
    const totalDuration = transcriptionResult.duration;
    const speakerCount = transcriptionResult.speakers.length;

    // Calculate average segment length
    const avgSegmentDuration = totalDuration / totalSegments;

    // Calculate silence percentage (assuming silence is when no one is speaking)
    // This is an approximation since we don't have actual silence detection
    const totalSpeakingTime = transcriptionResult.segments.reduce(
      (total, segment) => total + (segment.end - segment.start),
      0
    );
    const silencePercentage = Math.max(
      0,
      Math.min(100, ((totalDuration - totalSpeakingTime) / totalDuration) * 100)
    );

    // Count emotions
    const emotions: Record<string, number> = {};
    transcriptionResult.segments.forEach((segment) => {
      emotions[segment.emotion] = (emotions[segment.emotion] || 0) + 1;
    });

    // Get dominant emotion
    const dominantEmotion =
      Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

    // Calculate word count (rough estimate)
    const wordCount = transcriptionResult.text.split(/\s+/).length;

    const statItems = [
      {
        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
        label: "Длительность",
        value: formatTime(totalDuration),
      },
      {
        icon: <User className="h-4 w-4 text-muted-foreground" />,
        label: "Говорящих",
        value: speakerCount.toString(),
      },
      {
        icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
        label: "Сегментов",
        value: totalSegments.toString(),
      },
      {
        icon: <MoveHorizontal className="h-4 w-4 text-muted-foreground" />,
        label: "Слов",
        value: wordCount.toString(),
      },
      {
        icon: <VolumeX className="h-4 w-4 text-muted-foreground" />,
        label: "Тишина",
        value: `${Math.round(silencePercentage)}%`,
      },
    ];

    return (
      <Card className="rounded-xl overflow-hidden mb-6 border-border/50">
        <div className="p-4 bg-muted/30">
          <h3 className="text-sm font-medium text-primary flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Статистика аудио
          </h3>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-2 rounded-md hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center justify-center p-2 rounded-full bg-background shadow-sm mb-2">
                {item.icon}
              </div>
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
              <span className="font-medium">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    );
  }
);
