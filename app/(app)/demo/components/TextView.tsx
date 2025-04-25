"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text, Lock, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { TextViewProps } from "../utils/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function TextView({
  transcriptionResult,
  goBack,
  getEmotionText,
}: TextViewProps) {
  return (
    <div className="p-4">
      <div className="bg-card rounded-lg shadow-md p-6 mb-4 border border-border/50 relative">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
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
      </div>
    </div>
  );
}
