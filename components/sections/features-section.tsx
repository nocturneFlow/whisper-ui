"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UserRound,
  BarChart2,
  Youtube,
  FileAudio,
  FileText,
  Globe,
} from "lucide-react";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
};

const FeatureCard = ({
  icon,
  title,
  description,
  points,
}: FeatureCardProps) => (
  <Card className="transition-all hover:shadow-lg hover:border-primary/50">
    <CardHeader className="pb-3 sm:pb-4">
      <div className="mb-3 sm:mb-4 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-primary/10">
        {icon}
      </div>
      <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      <CardDescription className="text-xs sm:text-sm">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2 list-disc pl-5">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export function FeaturesSection() {
  const features = [
    {
      icon: <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
      title: "Поддержка казахского языка",
      description:
        "Специализированная модель обучена на многочасовых записях казахской речи",
      points: [
        "Высокоточное распознавание специфических фонем",
        "Учет диалектных особенностей",
        "Постоянное обновление словаря",
      ],
    },
    {
      icon: <UserRound className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
      title: "Диаризация дикторов",
      description:
        "Автоматическое определение и различение говорящих в аудиозаписи",
      points: [
        "Определение смены говорящих",
        "Идентификация до 10 уникальных голосов",
        "Работа с перекрывающимися репликами",
      ],
    },
    {
      icon: <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
      title: "Анализ эмоций",
      description: "Определение эмоционального оттенка речи каждого говорящего",
      points: [
        "Распознавание 7 базовых эмоций",
        "Измерение интенсивности эмоционального состояния",
        "Визуализация изменения эмоций во времени",
      ],
    },
    {
      icon: <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
      title: "YouTube транскрипция",
      description: "Автоматическое преобразование речи из видео в текст",
      points: [
        "Поддержка ссылок с любой платформы YouTube",
        "Работа с видео любой продолжительности",
        "Синхронизация текста с таймкодами видео",
      ],
    },
    {
      icon: <FileAudio className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
      title: "Поддержка форматов",
      description: "Работа с любыми аудио и видео форматами",
      points: [
        "MP3, WAV, FLAC, OGG для аудио",
        "MP4, MOV, AVI, MKV для видео",
        "Распознавание речи из аудиодорожек",
      ],
    },
    {
      icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />,
      title: "Форматы экспорта",
      description: "Гибкие настройки вывода результатов распознавания",
      points: [
        "TXT, PDF, DOCX для текста",
        "SRT, VTT для субтитров",
        "JSON, XML для структурированных данных",
      ],
    },
  ];

  return (
    <section className="w-full py-8 sm:py-12 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-6 sm:mb-10">
          <div className="inline-flex h-6 items-center rounded-full border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary">
            Возможности
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
            Полный набор инструментов для работы с казахской речью
          </h2>
          <p className="max-w-[700px] text-sm sm:text-base text-muted-foreground md:text-lg">
            Whisper UI предлагает современные технологии распознавания речи с
            учетом особенностей казахского языка
          </p>
        </div>

        <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-full lg:max-w-7xl">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
