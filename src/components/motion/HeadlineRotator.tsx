"use client";

import React, { useState, useEffect } from "react";

interface HeadlineRotatorProps {
  prefix?: string;
  texts: string[];
  className?: string;
  intervalMs?: number;
}

export function HeadlineRotator({
  prefix = "meets",
  texts,
  className = "",
  intervalMs = 3200,
}: HeadlineRotatorProps) {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setFadeState("in");
      }, 400);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [texts.length, intervalMs]);

  const currentWord = texts[index];

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-3 md:gap-x-5 ${className}`}>
      {prefix && <span className="text-[#f5f5f7] tracking-tight">{prefix}</span>}
      <span
        className="font-serif italic font-normal text-white inline-block tracking-normal transition-all duration-500 ease-out will-change-[transform,opacity,filter]"
        style={{
          opacity: fadeState === "in" ? 1 : 0,
          transform: fadeState === "in" ? "translateY(0)" : "translateY(-16px)",
          filter: fadeState === "in" ? "blur(0px)" : "blur(12px)",
        }}
      >
        {currentWord}
      </span>
    </span>
  );
}
