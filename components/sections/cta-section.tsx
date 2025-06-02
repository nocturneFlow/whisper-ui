"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";

export function CTASection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden border-t-2 border-black"
    >
      {/* Swiss Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container relative z-10 px-6 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center text-center">
            {/* Swiss-style badge */}
            <motion.div
              className="inline-flex items-center border-2 border-black bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider w-fit mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span>НАЧАТЬ СЕЙЧАС</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black font-mono mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              ГОТОВЫ УЛУЧШИТЬ РАБОТУ С КАЗАХСКОЙ РЕЧЬЮ?
            </motion.h2>

            <motion.div
              className="h-1 w-16 bg-black mb-6"
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            <motion.p
              className="text-lg font-mono text-black/80 max-w-2xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Начните использовать Whisper UI сегодня и откройте новый уровень
              точности в распознавании казахского языка.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                asChild
                className="bg-black text-white hover:bg-black/90 border-0 font-mono uppercase tracking-wider text-sm h-12 px-8"
              >
                <Link href="/app">
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    НАЧАТЬ БЕСПЛАТНО
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-black text-black hover:bg-black hover:text-white font-mono uppercase tracking-wider text-sm h-12 px-8"
              >
                <Link href="/pricing">
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    ТАРИФНЫЕ ПЛАНЫ
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
