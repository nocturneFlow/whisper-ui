"use client";

import * as React from "react";
import Link from "next/link";
import { Waves, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t-2 border-black bg-white overflow-hidden">
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

      <div className="container px-6 py-12 md:py-16 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-12">
            <div className="inline-flex items-center border-2 border-black bg-black text-white px-4 py-2 font-mono uppercase tracking-wider">
              <Grid3X3 className="h-3 w-3 mr-2" />
              <span className="text-xs">WHISPER UI</span>
            </div>
            <div className="h-0.5 bg-black flex-1 ml-6"></div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="font-mono uppercase text-sm font-bold tracking-wider text-black">
                Продукт
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="font-mono text-xs text-black/70 hover:text-black transition-colors"
                  >
                    Возможности
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="font-mono text-xs text-black/70 hover:text-black transition-colors"
                  >
                    Цены
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="font-mono text-xs text-black/70 hover:text-black transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-mono uppercase text-sm font-bold tracking-wider text-black">
                Ресурсы
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="font-mono text-xs text-black/70 hover:text-black transition-colors"
                  >
                    Документация
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorials"
                    className="font-mono text-xs text-black/70 hover:text-black transition-colors"
                  >
                    Руководства
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="font-mono text-xs text-black/70 hover:text-black transition-colors"
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
      </div>
    </footer>
  );
}
