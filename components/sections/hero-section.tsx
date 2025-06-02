"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Grid3X3, Zap } from "lucide-react";
import { useFoldDetection } from "@/hooks/use-fold-detection";
import { motion, useInView, useAnimation } from "framer-motion";

// Swiss-style speech recognition data visualization
function SpeechDataVisualization() {
  const [activeModel, setActiveModel] = React.useState<number>(0);
  const [realTimeData, setRealTimeData] = React.useState({
    frequency: Array.from({ length: 8 }, () => Math.random() * 100),
    processing: 0.23,
    totalSamples: 0,
  });

  // Real model data from your Hugging Face models - Actual research data
  const models = [
    {
      name: "WHISPER-MEDIUM",
      repo: "openai/whisper-medium",
      accuracy: 65.3, // Calculated from WER: 34.70%
      wer: 34.7, // Baseline performance from Common Voice 11.0
      datasets: ["Common Voice 11.0"],
      samples: 30000, // Estimated
      trainingHours: 0, // No fine-tuning
      status: "BASELINE",
      improvement: "Baseline model",
      baseModel: "openai/whisper-medium",
    },
    {
      name: "WHISPER-KZ-FT",
      repo: "nocturneFlow/whisper-kazakh-ft",
      accuracy: 78.8, // Calculated from WER: 21.2101%
      wer: 21.21, // Actual WER from model card
      datasets: ["Common Voice", "FLEURS"],
      samples: 45000, // Estimated
      trainingHours: 120,
      status: "ACTIVE",
      loss: 0.391, // Actual loss from model card
      trainingSteps: 5000,
      baseModel: "openai/whisper-medium",
    },
    {
      name: "WHISPER-ISSAI",
      repo: "nocturneFlow/whisper-medium-ft-issai",
      accuracy: 89.7, // Calculated from WER: 10.2803
      wer: 10.28, // Actual WER from model card
      datasets: ["Common Voice 17.0", "FLEURS", "ISSAI KSC"],
      samples: 78000, // Estimated from datasets
      trainingHours: 340,
      status: "PRODUCTION",
      loss: 0.0778,
      parameters: "764M",
      baseModel: "nocturneFlow/whisper-medium-ft",
    },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        frequency: prev.frequency.map(() => Math.random() * 100),
        processing: 0.15 + Math.random() * 0.2,
        totalSamples: prev.totalSamples + Math.floor(Math.random() * 5),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentModel = models[activeModel];

  return (
    <div className="w-full h-full bg-white border-2 border-black p-4 font-mono relative">
      {/* Header with Model Selector */}
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold tracking-wider text-black mb-1 truncate">
            {currentModel.name}
          </div>
          <div className="text-[8px] text-black/60 tracking-wider truncate">
            {currentModel.repo}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <motion.div
            className={`w-1.5 h-1.5 ${
              currentModel.status === "PRODUCTION" ? "bg-black" : "bg-black/60"
            }`}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="text-[8px] font-bold text-black">
            {currentModel.status}
          </div>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-black/20 p-2">
          <div className="text-[8px] font-bold text-black/60 mb-1 tracking-wider">
            WER
          </div>
          <div className="text-lg font-bold text-black">
            {currentModel.wer}%
          </div>
        </div>
        <div className="border border-black/20 p-2">
          <div className="text-[8px] font-bold text-black/60 mb-1 tracking-wider">
            {activeModel === 2 || activeModel === 1 ? "LOSS" : "STATUS"}
          </div>
          <div className="text-sm font-bold text-black">
            {activeModel === 2
              ? currentModel.loss
              : activeModel === 1
              ? currentModel.loss
              : "BASE"}
          </div>
        </div>
      </div>

      {/* Training Data Visualization */}
      <div className="mb-4">
        <div className="text-[8px] font-bold text-black mb-2 tracking-wider">
          DATASETS
        </div>
        <div className="space-y-1">
          {currentModel.datasets.map((dataset, index) => (
            <motion.div
              key={dataset}
              className="flex items-center justify-between border border-black/20 p-1.5"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-[8px] font-bold text-black truncate">
                {dataset}
              </div>
              <div className="w-12 h-1.5 bg-black/10 relative overflow-hidden ml-2">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${60 + index * 20}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Processing */}
      <div className="mb-4">
        <div className="text-[8px] font-bold text-black mb-2 tracking-wider">
          PROCESSING
        </div>
        <div className="grid grid-cols-8 gap-1 h-8">
          {realTimeData.frequency.map((value, index) => (
            <motion.div
              key={index}
              className="bg-black/10 border border-black/20 relative overflow-hidden"
              whileHover={{ backgroundColor: "#000", borderColor: "#000" }}
            >
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-black"
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Model Statistics */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center border border-black/20 p-1.5">
          <div className="text-sm font-bold text-black">
            {activeModel === 2 ? "764M" : "774M"}
          </div>
          <div className="text-[7px] font-bold text-black/60 tracking-wider">
            PARAMS
          </div>
        </div>
        <div className="text-center border border-black/20 p-1.5">
          <div className="text-sm font-bold text-black">
            {activeModel === 1
              ? "5K"
              : Math.floor(currentModel.samples / 1000) + "K"}
          </div>
          <div className="text-[7px] font-bold text-black/60 tracking-wider">
            {activeModel === 1 ? "STEPS" : "SAMPLES"}
          </div>
        </div>
        <div className="text-center border border-black/20 p-1.5">
          <div className="text-sm font-bold text-black">
            {activeModel === 0 ? "N/A" : `${currentModel.trainingHours}h`}
          </div>
          <div className="text-[7px] font-bold text-black/60 tracking-wider">
            TRAINING
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="flex gap-1 border-t border-black/20 pt-3">
        {models.map((model, index) => (
          <motion.button
            key={model.name}
            className={`flex-1 p-1.5 text-[7px] font-bold tracking-wider border transition-colors ${
              activeModel === index
                ? "border-black bg-black text-white"
                : "border-black/20 bg-white text-black hover:border-black"
            }`}
            onClick={() => setActiveModel(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {index === 0 ? "BASE" : `M${index}`}
          </motion.button>
        ))}
      </div>

      {/* Hugging Face Link Button - moved to bottom right */}
      <motion.a
        href={`https://huggingface.co/${currentModel.repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 w-8 h-5 border border-black bg-white text-black text-[7px] font-bold tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        HF
      </motion.a>
    </div>
  );
}

export function HeroSection() {
  const isFolded = useFoldDetection();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const heroLayout = isFolded
    ? "grid-cols-1"
    : "sm:grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px]";

  // Animation variants for text
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.2,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.175, 0.885, 0.32, 1.275], // back.out equivalent
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.6,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white"
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
        <div
          className={`grid gap-12 lg:gap-16 ${heroLayout} items-center min-h-[80vh]`}
        >
          {/* Content Section */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Swiss-style badge */}
            <motion.div
              className="inline-flex items-center border border-black bg-black text-white px-4 py-2 text-xs font-mono uppercase tracking-wider w-fit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Grid3X3 className="h-3 w-3 mr-2" />
              <span>KZ-SPEECH-001</span>
            </motion.div>

            {/* Main heading with Swiss typography */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight text-black font-mono"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                {"WHISPER".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={charVariants}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
                <br />
                <span className="font-light">
                  {"UI".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={charVariants}
                      className="inline-block"
                      style={{ transitionDelay: `${(index + 7) * 0.02}s` }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              <motion.div
                className="h-1 w-16 bg-black"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />

              <motion.p
                className="text-lg md:text-xl lg:text-2xl font-mono text-black/80 leading-relaxed max-w-2xl"
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  "HIGH-PRECISION",
                  "KAZAKH",
                  "SPEECH",
                  "RECOGNITION",
                  "WITH",
                  "SPEAKER",
                  "IDENTIFICATION",
                  "AND",
                  "EMOTION",
                  "ANALYSIS",
                ].map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordVariants}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.p>
            </div>

            {/* Metrics in Swiss grid format */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-8 border-t border-black/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {[
                { value: "10.28%", label: "WER" }, // Actual WER from production model
                { value: "0.3s", label: "LATENCY" },
                { value: "764M", label: "PARAMETERS" }, // Actual parameter count
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <div className="text-2xl font-bold font-mono text-black">
                    {metric.value}
                  </div>
                  <div className="text-xs font-mono uppercase text-black/60 tracking-wider">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Swiss-style buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <Button
                size="lg"
                asChild
                className="bg-black text-white hover:bg-black/90 border-0 font-mono uppercase tracking-wider text-sm h-12 px-8"
              >
                <Link href="/app">
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    START
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-black text-black hover:bg-black hover:text-white font-mono uppercase tracking-wider text-sm h-12 px-8"
              >
                <Link href="#demo">
                  <span className="flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    DEMO
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Speech Data Visualization */}
          <motion.div
            className="h-[400px] lg:h-[500px] relative"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SpeechDataVisualization />

            {/* Swiss-style minimal labels */}
            <motion.div
              className="absolute bottom-3 left-3 bg-white border-2 border-black px-3 py-1"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-[8px] font-bold text-black uppercase tracking-wider">
                DATA ANALYSIS
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
