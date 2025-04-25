"use client";

import * as React from "react";
import Link from "next/link";
import { Waves } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 overflow-hidden">
      <div className="container px-4 md:px-6 py-6 sm:py-8 mx-auto">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 max-w-full lg:max-w-7xl mx-auto">
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm sm:text-base font-medium">Продукт</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Возможности
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Цены
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm sm:text-base font-medium">Ресурсы</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Документация
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Руководства
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Блог
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm sm:text-base font-medium">Компания</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  О нас
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Карьера
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-sm sm:text-base font-medium">
              Правовая информация
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                >
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 sm:mt-8 sm:pt-6 border-t flex flex-col md:flex-row justify-between items-center max-w-full lg:max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-base sm:text-lg font-semibold">
              Whisper UI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 md:mt-0">
            © 2025 Whisper UI. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
