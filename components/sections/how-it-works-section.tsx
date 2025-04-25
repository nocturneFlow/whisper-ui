"use client";

import * as React from "react";

export function HowItWorksSection() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-24 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-6 sm:mb-10 max-w-3xl mx-auto">
          <div className="inline-flex h-6 items-center rounded-full border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary">
            Как это работает
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl">
            Три простых шага
          </h2>
          <p className="max-w-[700px] text-sm sm:text-base text-muted-foreground md:text-lg">
            Получите качественную транскрипцию казахской речи за считанные
            минуты
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6 sm:mt-10 max-w-full sm:max-w-6xl mx-auto">
          <div className="relative flex flex-col items-center">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3 sm:mb-4 z-10">
              <span className="text-xl sm:text-2xl font-bold">1</span>
            </div>
            {/* Connector line - visible only on larger screens */}
            <div
              className="absolute top-6 sm:top-8 left-1/2 h-0.5 w-full bg-primary/30 hidden sm:block"
              style={{ transform: "translateX(50%)" }}
            />
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Загрузите медиафайл
            </h3>
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Загрузите аудио/видео файл или вставьте ссылку на YouTube
            </p>
          </div>

          <div className="relative flex flex-col items-center">
            {/* Mobile step connector */}
            <div className="sm:hidden h-6 w-0.5 bg-primary/30 absolute -top-8 left-1/2 transform -translate-x-1/2"></div>

            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3 sm:mb-4 z-10">
              <span className="text-xl sm:text-2xl font-bold">2</span>
            </div>
            {/* Connector line - visible only on larger screens */}
            <div
              className="absolute top-6 sm:top-8 left-1/2 h-0.5 w-full bg-primary/30 hidden sm:block"
              style={{ transform: "translateX(50%)" }}
            />
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Настройте параметры
            </h3>
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Выберите нужные опции анализа и формат вывода результатов
            </p>
          </div>

          <div className="flex flex-col items-center relative">
            {/* Mobile step connector */}
            <div className="sm:hidden h-6 w-0.5 bg-primary/30 absolute -top-8 left-1/2 transform -translate-x-1/2"></div>

            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Получите результаты
            </h3>
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Просмотрите и скачайте готовую транскрипцию с метаданными
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
