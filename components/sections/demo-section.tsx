"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileAudio,
  Mic,
  Youtube,
  Loader2,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useRef } from "react";
import { TranscribeDemoResponse } from "@/types/transcribe";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export function DemoSection() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Пожалуйста, выберите файл");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", "kk"); // Default to Kazakh
      formData.append("task", "transcribe");
      formData.append("enable_diarization", "true");

      const response = await fetch("/api/transcribe/demo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Ошибка транскрибации");
      }

      // Store transcription result in localStorage
      localStorage.setItem("transcriptionResult", JSON.stringify(data));

      // Redirect to the demo page
      router.push("/demo");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при обработке файла"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemo = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section
      id="demo"
      className="w-full py-8 sm:py-12 md:py-24 bg-muted/30 overflow-hidden"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-6 sm:mb-10 max-w-3xl mx-auto">
          <div className="inline-flex h-6 items-center rounded-full border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary">
            Демонстрация
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
            Попробуйте прямо сейчас
          </h2>
          <p className="max-w-[700px] text-sm sm:text-base text-muted-foreground md:text-lg">
            Выберите способ загрузки для демонстрации возможностей системы
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="file"
                className="text-xs sm:text-sm font-medium"
              >
                Файл
              </TabsTrigger>
              <TabsTrigger
                value="youtube"
                className="text-xs sm:text-sm font-medium"
              >
                YouTube
              </TabsTrigger>
              <TabsTrigger
                value="mic"
                className="text-xs sm:text-sm font-medium"
              >
                Микрофон
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 sm:mt-6 rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <TabsContent value="file" className="space-y-4 sm:space-y-6 m-0">
                <div
                  className={`flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center py-6 sm:py-10 ${
                    isDragging
                      ? "border-2 border-dashed border-primary rounded-lg"
                      : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="rounded-full p-2 sm:p-3 bg-muted/50">
                    <FileAudio className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium">
                    Загрузите аудио или видео
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-2 sm:mb-4">
                    Поддерживаются форматы MP3, WAV, FLAC, MP4, MOV и другие
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="audio/*,video/*"
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <Button
                      size={isMobile ? "default" : "lg"}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Выбрать файл
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      или перетащите файл сюда
                    </p>
                  </div>

                  {file && (
                    <div className="mt-4 w-full max-w-md">
                      <Alert className="bg-muted/50">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Файл выбран</AlertTitle>
                        <AlertDescription className="text-xs">
                          {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
                          МБ)
                        </AlertDescription>
                      </Alert>

                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={handleFileUpload}
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isLoading ? "Обработка..." : "Транскрибировать"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert
                      variant="destructive"
                      className="mt-4 w-full max-w-md"
                    >
                      <Info className="h-4 w-4" />
                      <AlertTitle>Ошибка</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
              <TabsContent
                value="youtube"
                className="space-y-4 sm:space-y-6 m-0"
              >
                <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center py-6 sm:py-10">
                  <div className="rounded-full p-2 sm:p-3 bg-muted/50">
                    <Youtube className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium">
                    Вставьте ссылку на YouTube видео
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-2 sm:mb-4">
                    Работает с любыми видео на казахском языке с YouTube
                  </p>
                  <div className="flex w-full max-w-md flex-col sm:flex-row gap-2 sm:items-center">
                    <Input
                      type="text"
                      placeholder="https://youtube.com/watch?v=..."
                      className="min-h-9"
                    />
                    <Button type="submit" className="sm:flex-shrink-0">
                      Начать
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="mic" className="space-y-4 sm:space-y-6 m-0">
                <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center py-6 sm:py-10">
                  <div className="rounded-full p-2 sm:p-3 bg-muted/50">
                    <Mic className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium">
                    Запись с микрофона
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-2 sm:mb-4">
                    Говорите, и система будет транскрибировать речь в реальном
                    времени
                  </p>
                  <Button variant="outline" className="gap-2 group">
                    <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-destructive animate-pulse"></div>
                    Начать запись
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
