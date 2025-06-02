"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Quote, ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, useInView } from "framer-motion";

export function TestimonialSection() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote:
        "Whisper UI радикально изменил способ обработки интервью на казахском языке. Точность превосходит все, что я использовал ранее, а функция диаризации особенно полезна при работе с групповыми обсуждениями.",
      author: "Айгуль Нурланова",
      role: "Журналист, Казахстанская правда",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 md:py-32 bg-white overflow-hidden border-t-2 border-black"
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
        <div className="grid gap-12 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center">
            {/* Swiss-style badge */}
            <motion.div
              className="inline-flex items-center border-2 border-black bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider w-fit mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span>ОТЗЫВЫ</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black font-mono mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              МНЕНИЯ НАШИХ
              <br />
              ПОЛЬЗОВАТЕЛЕЙ
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
              Whisper UI уже помогает лингвистам, журналистам, исследователям и
              студентам в работе с казахской речью.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                asChild
                className="bg-black text-white hover:bg-black/90 border-0 font-mono uppercase tracking-wider text-sm h-12 px-8"
              >
                <Link href="/app">
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    ПОПРОБОВАТЬ
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.span>
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-2 border-black text-black hover:bg-black hover:text-white font-mono uppercase tracking-wider text-sm h-12 px-8"
              >
                <Link href="/case-studies">
                  <span className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ИСТОРИИ УСПЕХА
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Testimonial */}
          <motion.div
            className="mt-6 lg:mt-0 h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }
            }
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="border-2 border-black bg-white p-6 h-full relative">
              <Quote className="h-10 w-10 text-black/20 absolute top-4 left-4" />

              <div className="pt-6 pb-2 pl-4">
                <p className="text-lg font-mono text-black leading-relaxed mb-8">
                  "{testimonials[0].quote}"
                </p>

                <div className="border-t-2 border-black/10 pt-4">
                  <div className="font-mono font-bold text-black">
                    {testimonials[0].author}
                  </div>
                  <div className="font-mono text-sm text-black/60">
                    {testimonials[0].role}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-16 h-16 border-t-2 border-l-2 border-black flex items-center justify-center bg-black text-white">
                <div className="font-mono font-bold text-2xl">5.0</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
