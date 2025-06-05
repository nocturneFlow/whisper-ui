"use client";

import { motion } from "framer-motion";
import {
  Waves,
  UploadCloud,
  Cog,
  Sparkles,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { observer } from "mobx-react-lite";
import { useTranscriptionStore } from "@/providers/StoreProvider";
import { withErrorBoundary } from "../utils/withErrorBoundary";
import { useSafeTranscriptionStore } from "../utils/useStores";

interface LoadingIndicatorProps {
  showProgress?: boolean;
}

const LoadingIndicatorBase = observer(
  ({ showProgress = false }: LoadingIndicatorProps) => {
    const transcriptionStore = useTranscriptionStore();
    const { store: safeStore, error: storeError } = useSafeTranscriptionStore();

    // Use safe store if available, otherwise fallback to direct store
    const progress = safeStore?.progress || transcriptionStore?.progress;

    // Icons for different stages
    const getStageIcon = () => {
      if (!progress) return <Waves className="h-6 w-6 text-primary/70" />;
      switch (progress.stage) {
        case "uploading":
          return <UploadCloud className="h-6 w-6 text-primary/70" />;
        case "processing":
          return <Cog className="h-6 w-6 text-primary/70" />;
        case "analyzing":
          return <Sparkles className="h-6 w-6 text-primary/70" />;
        case "complete":
          return <CheckCircle className="h-6 w-6 text-green-500" />;
        case "error":
          return <AlertCircle className="h-6 w-6 text-red-500" />;
        default:
          return <Waves className="h-6 w-6 text-primary/70" />;
      }
    };

    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl rounded-full animate-pulse"></div>
          <div className="relative">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="rounded-full h-16 w-16 border-2 border-primary border-t-transparent relative shadow-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {getStageIcon()}
            </div>
          </div>
        </div>{" "}
        {showProgress && progress ? (
          <div className="mt-6 w-64">
            <Progress
              value={progress.progress}
              className={`h-2 ${
                progress.stage === "error"
                  ? "bg-red-200"
                  : progress.stage === "complete"
                  ? "bg-green-200"
                  : "animate-pulse"
              }`}
            />
            <motion.div
              className="mt-3 text-sm text-center font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={progress.message} // Re-animate when message changes
            >
              <p
                className={
                  progress.stage === "error"
                    ? "text-red-500"
                    : progress.stage === "complete"
                    ? "text-green-500"
                    : "text-foreground"
                }
              >
                {progress.message}
              </p>

              {progress.stage === "processing" && progress.progress > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(progress.progress)}% завершено
                </p>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.p
            className="mt-4 text-sm text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {progress?.message || "Обрабатываем аудио..."}
          </motion.p>
        )}
      </div>
    );
  }
);

// Export with error boundary protection
export const LoadingIndicator = withErrorBoundary(LoadingIndicatorBase);
