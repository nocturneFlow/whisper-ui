"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const FloatingElements = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0.2 + Math.random() * 0.3,
          }}
          animate={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: Math.random() * 0.5 + 0.7,
            opacity: 0.2 + Math.random() * 0.3,
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            width: `${30 + Math.random() * 70}px`,
            height: `${30 + Math.random() * 70}px`,
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
            filter: "blur(8px)",
          }}
        />
      ))}
    </>
  );
};

export const InteractiveBg = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || !ref.current) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ref.current.style.setProperty("--mouse-x", `${x}px`);
      ref.current.style.setProperty("--mouse-y", `${y}px`);
    };

    ref.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      ref.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600"
      style={{
        background:
          "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 60%)",
      }}
    />
  );
};
