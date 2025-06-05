"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { FileAudio, Settings, FileText } from "lucide-react";

export function HowItWorksSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: <FileAudio className="h-6 w-6" />,
      title: "ЗАГРУЗИТЕ МЕДИАФАЙЛ",
      description: "Загрузите аудио/видео файл или вставьте ссылку на YouTube",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "НАСТРОЙТЕ ПАРАМЕТРЫ",
      description: "Выберите нужные опции анализа и формат вывода результатов",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "ПОЛУЧИТЕ РЕЗУЛЬТАТЫ",
      description: "Просмотрите и скачайте готовую транскрипцию с метаданными",
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
        <div className="flex flex-col mb-16">
          {/* Swiss-style badge */}
          <motion.div
            className="inline-flex items-center border-2 border-black bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider w-fit mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span>ПРОЦЕСС</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black font-mono mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ТРИ ПРОСТЫХ ШАГА
          </motion.h2>

          <motion.div
            className="h-1 w-16 bg-black mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 64 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className="text-lg font-mono text-black/80 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Получите качественную транскрипцию казахской речи за считанные
            минуты
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
            >
              {/* Step number */}
              <div className="absolute -top-8 -left-2 font-mono text-6xl font-bold opacity-10">
                {index + 1}
              </div>

              {/* Step content */}
              <div className="border-2 border-black bg-white p-6 h-full relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-black bg-black text-white">
                  {step.icon}
                </div>
                <h3 className="font-mono text-lg font-bold tracking-tight text-black mb-3">
                  {step.title}
                </h3>
                <p className="font-mono text-sm text-black/80">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
