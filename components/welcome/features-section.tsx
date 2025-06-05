"use client";

import * as React from "react";
import {
  UserRound,
  BarChart2,
  Youtube,
  FileAudio,
  FileText,
  Globe,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
  index: number;
};

const FeatureCard = ({
  icon,
  title,
  description,
  points,
  index,
}: FeatureCardProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="border-2 border-black bg-white p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{
        boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
        translateY: -2,
      }}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-black">
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="font-mono text-lg font-bold tracking-tight text-black mb-2">
        {title}
      </h3>
      <p className="font-mono text-sm text-black/80 mb-4">{description}</p>
      <ul className="space-y-2 font-mono">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start">
            <motion.span
              className="mr-2 text-xs"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: index * 0.1 + idx * 0.1 + 0.3 }}
            >
              ◆
            </motion.span>
            <span className="text-xs text-black/80">{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export function FeaturesSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Globe className="h-5 w-5" />,
      title: "ПОДДЕРЖКА КАЗАХСКОГО ЯЗЫКА",
      description:
        "Специализированная модель обучена на многочасовых записях казахской речи",
      points: [
        "Высокоточное распознавание специфических фонем",
        "Учет диалектных особенностей",
        "Постоянное обновление словаря",
      ],
    },
    {
      icon: <UserRound className="h-5 w-5" />,
      title: "ДИАРИЗАЦИЯ ДИКТОРОВ",
      description:
        "Автоматическое определение и различение говорящих в аудиозаписи",
      points: [
        "Определение смены говорящих",
        "Идентификация до 10 уникальных голосов",
        "Работа с перекрывающимися репликами",
      ],
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      title: "АНАЛИЗ ЭМОЦИЙ",
      description: "Определение эмоционального оттенка речи каждого говорящего",
      points: [
        "Распознавание 7 базовых эмоций",
        "Измерение интенсивности эмоционального состояния",
        "Визуализация изменения эмоций во времени",
      ],
    },
    {
      icon: <Youtube className="h-5 w-5" />,
      title: "YOUTUBE ТРАНСКРИПЦИЯ",
      description: "Автоматическое преобразование речи из видео в текст",
      points: [
        "Поддержка ссылок с любой платформы YouTube",
        "Работа с видео любой продолжительности",
        "Синхронизация текста с таймкодами видео",
      ],
    },
    {
      icon: <FileAudio className="h-5 w-5" />,
      title: "ПОДДЕРЖКА ФОРМАТОВ",
      description: "Работа с любыми аудио и видео форматами",
      points: [
        "MP3, WAV, FLAC, OGG для аудио",
        "MP4, MOV, AVI, MKV для видео",
        "Распознавание речи из аудиодорожек",
      ],
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "ФОРМАТЫ ЭКСПОРТА",
      description: "Гибкие настройки вывода результатов распознавания",
      points: [
        "TXT, PDF, DOCX для текста",
        "SRT, VTT для субтитров",
        "JSON, XML для структурированных данных",
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 md:py-32 bg-white overflow-hidden"
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
            <span>ВОЗМОЖНОСТИ</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black font-mono mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ПОЛНЫЙ НАБОР
            <br />
            ИНСТРУМЕНТОВ
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
            Whisper UI предлагает современные технологии распознавания речи с
            учетом особенностей казахского языка
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
