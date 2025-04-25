"use client";

import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SpeakerFiltersProps } from "../utils/types";

export function SpeakerFilters({
  transcriptionResult,
  filterSpeakers,
  toggleSpeakerFilter,
  getSpeakerGradient,
  getSpeakerName,
}: SpeakerFiltersProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-1.5 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <span className="flex space-x-0.5">
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </span>
          <span className="hidden sm:inline">Фильтр говорящих</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px] rounded-xl p-1 border-border/50"
      >
        {transcriptionResult.speakers.map((speaker) => {
          const speakerName = getSpeakerName(speaker);
          const isActive = !filterSpeakers.includes(speaker);

          return (
            <DropdownMenuItem
              key={speaker}
              className="flex items-center gap-2 cursor-pointer rounded-lg my-0.5"
              onClick={() => toggleSpeakerFilter(speaker)}
            >
              <div
                className={`w-4 h-4 rounded-full ${getSpeakerGradient(
                  speaker
                )} flex items-center justify-center transition-transform ${
                  isActive ? "scale-100" : "scale-75 opacity-50"
                }`}
              >
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-1.5 w-1.5 rounded-full bg-white"
                  />
                )}
              </div>
              <span
                className={`transition-colors ${
                  isActive ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {speakerName}
              </span>
              {isActive && (
                <CheckCheck className="h-3.5 w-3.5 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
