"use client";

import { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { TranscribeDemoResponse } from "@/types/transcribe";
import {
  MessageSquare,
  FileText,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";

// Import our utility functions
import {
  formatTime,
  getSpeakerColor,
  getSpeakerGradient,
  getEmotionText,
  getSpeakerName,
} from "./utils/helpers";

// Import our components
import { TranscriptionHeader } from "./components/TranscriptionHeader";
import { ChatView } from "./components/ChatView";
import { TextView } from "./components/TextView";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { TranscriptionStats } from "./components/TranscriptionStats";
import { FileUploadComponent } from "./components/FileUploadComponent";

/**
 * Premium Demo Banner - Shows feature limitations and encourages sign up
 */
function PremiumDemoBanner() {
  return (
    <motion.div
      className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-xl border border-primary/20 p-4 mb-6 relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.3,
      }}
    >
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <Sparkles className="h-32 w-32 text-primary" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Демо-режим
              <Badge
                variant="outline"
                className="bg-primary/20 text-primary border-primary/30 text-xs py-0"
              >
                Ограниченная функциональность
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[500px]">
              Вы работаете с ограниченной демо-версией. Зарегистрируйтесь, чтобы
              получить доступ к полной функциональности: загрузке
              неограниченного количества файлов, экспорту результатов и
              дополнительным возможностям анализа.
            </p>
          </div>
        </div>

        <Link href="/sign-up" className="sm:shrink-0">
          <Button className="group" size="sm">
            Зарегистрироваться
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * Demo Page Component - Displays a transcription result using TranscriptionStore
 * with proper error handling and loading states
 */
const DemoPage = observer(() => {
  // Store access
  const transcriptionStore = useTranscriptionStore();

  // Local state
  const [error, setError] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current || !value.length) return;
    audioRef.current.currentTime = value[0];
    setAudioPosition(value[0]);
  };

  // Audio event handlers
  useEffect(() => {
    if (!transcriptionStore.currentTranscription?.audio_url) return;

    const audio = new Audio(transcriptionStore.currentTranscription.audio_url);
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setAudioPosition(audio.currentTime);
    });

    audio.addEventListener("loadeddata", () => {
      setAudioLoaded(true);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setAudioPosition(0);
      audio.currentTime = 0;
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });

    return () => {
      audio.pause();
      audio.src = "";
      audio.remove();
      audioRef.current = null;
      setAudioLoaded(false);
      setIsPlaying(false);
      setAudioPosition(0);
    };
  }, [transcriptionStore.currentTranscription?.audio_url]);

  const router = useRouter();
  // Load transcription data
  useEffect(() => {
    // First check if we have a current transcription in the store
    if (transcriptionStore.currentTranscription) {
      return;
    }

    // If not, try to load from localStorage (backwards compatibility)
    try {
      const storedData = localStorage.getItem("transcriptionResult");
      if (storedData) {
        const parsedData = JSON.parse(storedData) as TranscribeDemoResponse;
        // We can't directly set the currentTranscription, but we can clear error
        setError(null);
        // Note: In a real implementation, you might want to convert this to the store format
      } else {
        // No error when there's no stored data - we'll show upload component
        setError(null);
      }
    } catch {
      setError(
        "Ошибка при получении результатов транскрибации. Пожалуйста, попробуйте снова."
      );
    }
  }, [transcriptionStore.currentTranscription]);
  const goBack = () => {
    router.push("/#demo");
  };

  // Get the current transcription result
  const transcriptionResult = transcriptionStore.currentTranscription;

  // Show store error if any
  const displayError = error || transcriptionStore.error;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted/50">
      <TranscriptionHeader
        transcriptionResult={transcriptionResult}
        goBack={goBack}
        getSpeakerName={getSpeakerName}
        getEmotionText={getEmotionText}
        formatTime={formatTime}
      />

      <div className="flex-1 container max-w-screen-lg mx-auto py-4 flex flex-col px-4 overflow-hidden">
        <PremiumDemoBanner />{" "}
        {displayError ? (
          <Alert variant="destructive" className="mx-auto max-w-3xl shadow-md">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        ) : transcriptionStore.isProcessing ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingIndicator showProgress={true} />
          </div>
        ) : transcriptionResult ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs
              defaultValue="chat"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex justify-center mb-6">
                <TabsList className="bg-card/90 shadow-md rounded-full h-12 p-1">
                  <TabsTrigger
                    value="chat"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-8 h-10 transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Диалог</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-8 h-10 transition-all flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Текст</span>
                  </TabsTrigger>
                </TabsList>{" "}
              </div>

              {/* Show transcription stats when available */}
              <TranscriptionStats formatTime={formatTime} />

              <TabsContent
                value="chat"
                className="mt-0 flex-1 flex flex-col data-[state=active]:flex bg-card rounded-xl shadow-md border border-border/50 overflow-hidden"
              >
                <ChatView
                  transcriptionResult={transcriptionResult}
                  activeSegment={activeSegment}
                  isPlaying={isPlaying}
                  filterSpeakers={[]}
                  jumpToSegment={() => {}}
                  copyText={() => {}}
                  formatTime={formatTime}
                  getSpeakerColor={getSpeakerColor}
                  getSpeakerGradient={getSpeakerGradient}
                  getSpeakerName={getSpeakerName}
                  getEmotionText={getEmotionText}
                  audioRef={audioRef}
                  audioLoaded={audioLoaded}
                  audioPosition={audioPosition}
                  togglePlayback={togglePlayback}
                  handleProgressChange={handleProgressChange}
                />
              </TabsContent>

              <TabsContent
                value="text"
                className="mt-0 flex-1 overflow-auto data-[state=active]:animate-in data-[state=active]:fade-in-50 data-[state=active]:zoom-in-95"
              >
                <TextView
                  transcriptionResult={transcriptionResult}
                  goBack={goBack}
                  getEmotionText={getEmotionText}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-8">
            <FileUploadComponent />
          </div>
        )}
      </div>
    </div>
  );
});

// The component is already wrapped with observer when it was created
export default DemoPage;
