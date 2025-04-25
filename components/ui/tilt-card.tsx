"use client";

import React, { useRef, useState } from "react";
import { Card } from "./card";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareAmount?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
  tiltAmount = 5,
  glareAmount = 0.35,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    setRotation({
      x: -mouseY * tiltAmount,
      y: mouseX * tiltAmount,
    });

    setGlarePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      <Card
        className={`${className} transition-transform ease-out`}
        style={{
          transform: isHovering
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            : "none",
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
        {isHovering && glareAmount > 0 && (
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
            style={{ opacity: glareAmount }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                transform: `translate(${glarePosition.x}%, ${glarePosition.y}%) rotate(30deg) scale(2)`,
                opacity: "0.15",
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
