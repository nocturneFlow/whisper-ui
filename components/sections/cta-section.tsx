"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export function CTASection() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-muted/30 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl">
            Готовы улучшить работу с казахской речью?
          </h2>
          <p className="max-w-[700px] text-sm sm:text-base text-muted-foreground md:text-xl/relaxed lg:text-center">
            Начните использовать Whisper UI сегодня и откройте новый уровень
            точности в распознавании казахского языка.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row mt-3 sm:mt-4">
            <Button
              size={isMobile ? "default" : "lg"}
              asChild
              className="gap-2 group"
            >
              <Link href="/app">
                Начать бесплатно
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size={isMobile ? "default" : "lg"}
              variant="outline"
              asChild
            >
              <Link href="/pricing">Тарифные планы</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
