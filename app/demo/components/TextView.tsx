"use client";

import { Button } from "@/components/ui/button";
import { Text, Lock, FileSpreadsheet, Copy, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { TextViewProps } from "../utils/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";
import { useSafeTranscriptionStore } from "../utils/useStores";
import { withErrorBoundary } from "../utils/withErrorBoundary";
import { useState } from "react";

const TextViewBase = observer(
  ({ transcriptionResult, goBack, getEmotionText }: TextViewProps) => {
    const transcriptionStore = useTranscriptionStore();
    const { store: safeStore, copyTranscriptionToClipboard } =
      useSafeTranscriptionStore();
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyError, setCopyError] = useState<string | null>(null);

    // Copy text to clipboard with enhanced error handling
    const copyText = async () => {
      if (transcriptionResult) {
        setCopyError(null);

        try {
          // Try using the safe store helper first
          if (copyTranscriptionToClipboard) {
            const success = await copyTranscriptionToClipboard();
            if (success) {
              setCopySuccess(true);
              setTimeout(() => setCopySuccess(false), 2000);
              return;
            }
          }

          // Fallback to direct clipboard API
          await navigator.clipboard.writeText(
            transcriptionResult.polished_text || transcriptionResult.text
          );
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Copy failed:", err);
          setCopyError("Не удалось скопировать текст");
          setTimeout(() => setCopyError(null), 3000);
        }
      }
    };
    return (
      <div className="p-4">
        <div className="bg-card rounded-lg shadow-md p-6 mb-4 border border-border/50 relative">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={copyText}
                    className={`bg-background/90 backdrop-blur-sm shadow-sm border 
                    ${
                      copySuccess
                        ? "border-green-500 bg-green-50/10"
                        : "border-border/50"
                    } 
                    rounded-full p-2 flex items-center gap-1.5 cursor-pointer group hover:border-primary/50 transition-colors`}
                  >
                    <Badge
                      variant={copySuccess ? "default" : "outline"}
                      className={
                        copySuccess
                          ? "bg-green-500/90 border-green-500/80 text-white text-xs py-0 pl-1 pr-2 gap-1"
                          : "bg-primary/20 border-primary/30 text-xs py-0 pl-1 pr-2 gap-1"
                      }
                    >
                      <Copy
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
                      Скопировать текст
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Скопировать текст транскрипции</p>
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
                      Экспорт в Excel
                    </span>
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground opacity-70 group-hover:text-primary/70 transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Доступно после регистрации</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <h2 className="text-lg font-medium mb-4 flex items-center text-primary">
            <Text className="h-5 w-5 mr-2" />
            Полный текст:
          </h2>
          <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
            {transcriptionResult.polished_text || transcriptionResult.text}
          </p>
        </div>
        {transcriptionResult.overall_emotion && (
          <motion.div
            className="bg-card rounded-lg shadow-md p-6 mb-4 border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-4 flex items-center text-primary">
              <span className="text-xl mr-2">
                {
                  getEmotionText(
                    transcriptionResult.overall_emotion.toLowerCase()
                  ).emoji
                }
              </span>
              Общее настроение:
            </h2>
            <p className="text-sm text-foreground">
              {transcriptionResult.overall_emotion}
            </p>
          </motion.div>
        )}
        <div className="flex justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={goBack}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md px-6 py-2 rounded-full"
            >
              Новая транскрибация
            </Button>
          </motion.div>
        </div>{" "}
        {/* Error message if copy fails */}
        {copyError && (
          <div className="absolute -top-12 right-0">
            <Alert variant="destructive" className="py-2 px-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {copyError}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    );
  }
);

// Export with error boundary protection
export const TextView = withErrorBoundary(TextViewBase);

export default TextViewBase;
