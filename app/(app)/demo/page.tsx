"use client";

import { useEffect, useState } from "react";
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
 * Demo Page Component - Displays a transcription result in a simple chat interface
 * focusing only on showing the conversation with speaker differentiation and emotions
 */
export default function DemoPage() {
  // State management
  const [transcriptionResult, setTranscriptionResult] =
    useState<TranscribeDemoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const router = useRouter();

  // Load transcription data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("transcriptionResult");
      if (storedData) {
        const parsedData = JSON.parse(storedData) as TranscribeDemoResponse;
        setTranscriptionResult(parsedData);
      } else {
        setError(
          "Нет данных транскрибации. Пожалуйста, загрузите файл на главной странице."
        );
      }
    } catch (err) {
      setError(
        "Ошибка при получении результатов транскрибации. Пожалуйста, попробуйте снова."
      );
    }
  }, []);

  const goBack = () => {
    router.push("/#demo");
  };

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
        <PremiumDemoBanner />

        {error ? (
          <Alert variant="destructive" className="mx-auto max-w-3xl shadow-md">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
                </TabsList>
              </div>

              <TabsContent
                value="chat"
                className="mt-0 flex-1 flex flex-col data-[state=active]:flex bg-card rounded-xl shadow-md border border-border/50 overflow-hidden"
              >
                <ChatView
                  transcriptionResult={transcriptionResult}
                  activeSegment={activeSegment}
                  isPlaying={false}
                  filterSpeakers={[]}
                  jumpToSegment={() => {}}
                  copyText={() => {}}
                  formatTime={formatTime}
                  getSpeakerColor={getSpeakerColor}
                  getSpeakerGradient={getSpeakerGradient}
                  getSpeakerName={getSpeakerName}
                  getEmotionText={getEmotionText}
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
          <div className="flex-1 flex items-center justify-center">
            <LoadingIndicator />
          </div>
        )}
      </div>
    </div>
  );
}
