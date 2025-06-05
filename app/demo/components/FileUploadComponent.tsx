"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileAudio,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  HelpCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";
import { useSafeTranscriptionStore } from "../utils/useStores";
import { TranscribeDemoRequest } from "@/types/transcribe";
import { withErrorBoundary } from "../utils/withErrorBoundary";

const SUPPORTED_FORMATS = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/aac",
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/mkv",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const FileUploadComponentBase = observer(() => {
  const transcriptionStore = useTranscriptionStore();
  const {
    store: safeStore,
    error: storeError,
    safeTranscribeAudio,
  } = useSafeTranscriptionStore();

  // Component state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<"kk" | "ru" | "en" | null>(null);
  const [task, setTask] = useState<"transcribe" | "translate">("transcribe");
  const [enableDiarization, setEnableDiarization] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setUploadError(
        "Неподдерживаемый формат файла. Поддерживаются: MP3, WAV, OGG, M4A, AAC, MP4, AVI, MOV, MKV"
      );
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Файл слишком большой. Максимальный размер: 50 МБ");
      return;
    }

    setSelectedFile(file);
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Validate using our extracted validation function
      setUploadError(null);
      setIsValidating(true);

      try {
        const validationResult = validateFile(file);

        if (!validationResult.valid) {
          setUploadError(validationResult.error || null);
          return;
        }

        // File is valid
        setSelectedFile(file);
      } catch (err) {
        setUploadError("Ошибка при проверке файла");
        console.error("File validation error:", err);
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Validate file function - extracted for reuse
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Validate file type
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        return {
          valid: false,
          error:
            "Неподдерживаемый формат файла. Поддерживаются: MP3, WAV, OGG, M4A, AAC, MP4, AVI, MOV, MKV",
        };
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: `Файл слишком большой. Максимальный размер: ${(
            MAX_FILE_SIZE /
            (1024 * 1024)
          ).toFixed(0)} МБ`,
        };
      }

      // File is valid
      return { valid: true };
    },
    []
  );

  // Enhanced upload handler with better error handling
  const handleTranscribe = async () => {
    if (!selectedFile) return;

    try {
      setIsValidating(true);
      setUploadError(null);

      const request: TranscribeDemoRequest = {
        file: selectedFile,
        task,
        enable_diarization: enableDiarization,
      };

      // Only include language if it's selected
      if (language) {
        request.language = language;
      } else {
        setIsDetectingLanguage(true);
      }

      await safeTranscribeAudio(request);

      setIsDetectingLanguage(false);
      setIsValidating(false);
    } catch (error) {
      setIsDetectingLanguage(false);
      setIsValidating(false);
      setUploadError(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-sm font-medium">
                Аудио или видео файл
              </Label>
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept={SUPPORTED_FORMATS.join(",")}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      Изменить файл
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        Перетащите файл сюда или нажмите для выбора
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Поддерживаются аудио и видео файлы до 50 МБ
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              <div className="space-y-2">
                <Label htmlFor="language">Язык</Label>
                <Select
                  value={language || "auto"}
                  onValueChange={(value) =>
                    setLanguage(
                      value === "auto" ? null : (value as "kk" | "ru" | "en")
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Автоматическое определение" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">
                      Автоматическое определение
                    </SelectItem>
                    <SelectItem value="kk">Казахский</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">Английский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task">Задача</Label>
                <Select
                  value={task}
                  onValueChange={(value: "transcribe" | "translate") =>
                    setTask(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transcribe">Транскрибация</SelectItem>
                    <SelectItem value="translate">
                      Перевод на английский
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Diarization Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diarization"
                checked={enableDiarization}
                onCheckedChange={(checked) =>
                  setEnableDiarization(checked as boolean)
                }
              />
              <Label htmlFor="diarization" className="text-sm">
                Определение говорящих (диаризация)
              </Label>
            </div>

            {/* Error Display */}
            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <div className="flex flex-col gap-2">
                  <AlertDescription>{uploadError}</AlertDescription>
                  {retryCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-start flex items-center gap-2"
                      onClick={() => {
                        handleTranscribe();
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Попробовать снова
                    </Button>
                  )}
                </div>
              </Alert>
            )}

            {/* Store Error Display */}
            {storeError && !uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <div className="flex flex-col gap-2">
                  <AlertDescription>
                    Ошибка доступа к хранилищу данных: {storeError.message}
                  </AlertDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start flex items-center gap-2"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Перезагрузить страницу
                  </Button>
                </div>
              </Alert>
            )}

            {/* Language Detection Alert */}
            {isDetectingLanguage && (
              <Alert className="bg-muted">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>Определение языка</AlertTitle>
                <AlertDescription>
                  Язык аудио будет определен автоматически
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleTranscribe}
              disabled={!selectedFile || transcriptionStore.isProcessing}
              className="w-full"
              size="lg"
            >
              {transcriptionStore.isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                  />
                  Обрабатывается...
                </>
              ) : (
                <>
                  <FileAudio className="w-4 h-4 mr-2" />
                  Начать транскрибацию
                </>
              )}
            </Button>

            {/* Retry Button - only show if there's an error and not processing */}
            {uploadError && !transcriptionStore.isProcessing && (
              <Button
                onClick={handleTranscribe}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Повторить
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
});

// Export with error boundary protection
export const FileUploadComponent = withErrorBoundary(FileUploadComponentBase);
