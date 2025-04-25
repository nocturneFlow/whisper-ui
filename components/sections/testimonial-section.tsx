"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export function TestimonialSection() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <section className="w-full py-8 sm:py-12 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] max-w-full lg:max-w-7xl mx-auto">
          <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
            <div className="inline-flex h-6 items-center rounded-full border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary">
              Отзывы пользователей
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl">
              Используют эксперты и обычные пользователи
            </h2>
            <p className="max-w-[600px] text-sm sm:text-base text-muted-foreground md:text-lg">
              Whisper UI уже помогает лингвистам, журналистам, исследователям и
              студентам в работе с казахской речью.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size={isMobile ? "default" : "default"}
                asChild
                className="gap-2"
              >
                <Link href="/app">Попробовать бесплатно</Link>
              </Button>
              <Button
                size={isMobile ? "default" : "default"}
                variant="outline"
                asChild
              >
                <Link href="/case-studies">
                  Истории успеха
                  <ExternalLink className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
            <blockquote className="space-y-2 bg-muted p-4 sm:p-6 rounded-lg border shadow-sm w-full max-w-[500px]">
              <div className="flex gap-1 sm:gap-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <p className="text-base sm:text-lg md:text-xl italic">
                "Whisper UI радикально изменил способ обработки интервью на
                казахском языке. Точность превосходит все, что я использовал
                ранее, а функция диаризации особенно полезна при работе с
                групповыми обсуждениями."
              </p>
              <footer className="text-xs sm:text-sm text-muted-foreground">
                <div className="font-medium">Айгуль Нурланова</div>
                <div>Журналист, Казахстанская правда</div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
