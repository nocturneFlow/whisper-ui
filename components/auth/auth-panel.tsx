"use client";

import { ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  FloatingElements,
  InteractiveBg,
} from "@/components/ui/floating-elements";

interface AuthPanelProps {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function AuthPanel({
  children,
  icon: Icon,
  title,
  description,
}: AuthPanelProps) {
  const leftPanelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left side decorative panel (visible on desktop) */}
      <motion.div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 bg-sidebar-primary flex-col justify-center items-center relative overflow-hidden p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* <InteractiveBg /> */}
        {/* <FloatingElements /> */}

        <motion.div
          className="relative z-10 text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <Icon className="mx-auto h-16 w-16 text-sidebar-accent mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-sidebar-primary-foreground mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-sidebar-accent-foreground text-lg">
            {description}
          </p>
        </motion.div>
        <div className="absolute top-10 left-10 w-24 h-24 bg-sidebar-accent/20 rounded-full filter blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-sidebar-accent/20 rounded-full filter blur-xl"></div>
      </motion.div>
      {/* Right side panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
