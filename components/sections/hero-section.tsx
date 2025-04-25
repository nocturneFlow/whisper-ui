"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserRound, Waves } from "lucide-react";
import { useFoldDetection } from "@/hooks/use-fold-detection";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function HeroSection() {
  const isFolded = useFoldDetection();
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position to rotation values with constraints
  const rotateY = useTransform(mouseX, [-300, 300], [10, -10]);
  const rotateX = useTransform(mouseY, [-300, 300], [-10, 10]);

  // Add spring physics for smoother animations
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });

  // Handle mouse move on container to update motion values
  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY, currentTarget } = event;
      const { left, top, width, height } =
        currentTarget.getBoundingClientRect();

      // Calculate mouse position relative to the center of the element
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    },
    [mouseX, mouseY]
  );

  // Reset position when mouse leaves
  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Adapt layout based on fold state and screen size
  const heroLayout = isFolded
    ? "grid-cols-1"
    : "sm:grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]";

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
        aria-hidden="true"
      />

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div
          className={`grid gap-6 lg:gap-12 grid-cols-1 ${heroLayout} w-full mx-auto`}
        >
          <div className="flex flex-col justify-center space-y-4 w-full overflow-hidden">
            <div className="inline-flex items-center rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary w-fit max-w-full overflow-hidden">
              <Waves className="min-w-[12px] h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                Специализированная модель для казахского языка
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-5xl lg:text-6xl xl:text-7xl break-words hyphens-auto">
              Whisper UI{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                для қазақша сөйлеу тану
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground md:text-xl lg:text-2xl break-words">
              Высокоточное распознавание казахской речи с возможностью
              определения говорящих, анализа эмоций и транскрибации видео с
              YouTube.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
              <Button
                size="default"
                asChild
                className="gap-2 group w-full sm:w-auto"
              >
                <Link href="/app" className="w-full sm:w-auto">
                  <span className="flex items-center justify-center">
                    Начать бесплатно
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button
                size="default"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="#demo" className="w-full sm:w-auto">
                  <span className="flex items-center justify-center">
                    Демонстрация
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          {/*Chat Window Demo with 3D Effect*/}
          <div
            className="flex items-center justify-center mt-8 sm:mt-6 lg:mt-0 w-full mx-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="relative h-[280px] sm:h-[320px] w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[400px] lg:h-[450px] lg:max-w-[450px] rounded-lg bg-secondary/10 border border-secondary/20 shadow-lg overflow-hidden"
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-card flex items-center px-3 sm:px-4 space-x-2 shadow-sm"
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 10,
                }}
              >
                <motion.div
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-destructive/70"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-accent/70"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div
                  className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-primary/70"
                  whileHover={{ scale: 1.2 }}
                />
              </motion.div>

              <motion.div
                className="mt-8 sm:mt-10 p-4 sm:p-6 space-y-3 sm:space-y-4"
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 5,
                }}
              >
                <motion.div
                  className="flex space-x-2 sm:space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserRound className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-muted">
                      <p className="text-xs sm:text-sm">
                        Сәлем, мен қазақша сөйлеймін.
                      </p>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      Говорящий 1 • Радость
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex space-x-2 sm:space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <UserRound className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-muted">
                      <p className="text-xs sm:text-sm">
                        Қайырлы күн, қалыңыз қалай?
                      </p>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      Говорящий 2 • Нейтрально
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex space-x-2 sm:space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserRound className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-muted">
                      <p className="text-xs sm:text-sm">Жақсы, рахмет!</p>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      Говорящий 1 • Радость
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center justify-between border-t border-border pt-3 sm:pt-4 mt-4 sm:mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    3 реплики • 2 диктора
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-[10px] sm:text-xs h-7 sm:h-8"
                  >
                    Экспорт
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
