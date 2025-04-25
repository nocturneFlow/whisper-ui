"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  scale: number;
  color: string;
}

export const SuccessConfetti = ({ show = false }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!show) return;

    const colors = ["#FF5B5B", "#47B4FF", "#7A5AF8", "#FFD166", "#06D6A0"];
    const newPieces = Array(50)
      .fill(0)
      .map((_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 0.5,
        scale: 0.5 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0"
          initial={{
            y: -20,
            x: piece.x,
            scale: 0,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720 - 360,
            scale: piece.scale,
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: piece.delay,
            ease: "easeIn",
          }}
        >
          <div
            className="w-4 h-4 rotate-45"
            style={{ backgroundColor: piece.color }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export const SuccessCheck = () => {
  return (
    <div className="relative">
      <motion.div
        className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};
