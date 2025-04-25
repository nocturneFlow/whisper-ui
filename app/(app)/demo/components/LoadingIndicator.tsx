"use client";

import { motion } from "framer-motion";
import { Waves } from "lucide-react";

export function LoadingIndicator() {
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
            <Waves className="h-6 w-6 text-primary/70" />
          </div>
        </div>
      </div>
      <motion.p
        className="mt-4 text-sm text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Обрабатываем аудио...
      </motion.p>
    </div>
  );
}
