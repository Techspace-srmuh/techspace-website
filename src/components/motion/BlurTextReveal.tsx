"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlurTextRevealProps {
  text?: string;
  html?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  animationType?: "chars" | "words";
  stagger?: number;
  delay?: number;
  duration?: number;
  scrollTrigger?: boolean;
  start?: string;
}

export function BlurTextReveal({
  text,
  html,
  as: Component = "span",
  className = "",
  animationType = "words",
  stagger = 0.03,
  delay = 0,
  duration = 0.8,
  scrollTrigger = true,
  start = "top 85%",
}: BlurTextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const elements = containerRef.current.querySelectorAll(".char-item, .word-item");
      if (!elements.length) return;

      gsap.fromTo(
        elements,
        {
          opacity: 0.15,
          filter: "blur(12px)",
          y: 16,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: "power2.out",
          scrollTrigger: scrollTrigger
            ? {
                trigger: containerRef.current,
                start: start,
                toggleActions: "play none none none",
              }
            : undefined,
        }
      );
    },
    { scope: containerRef, dependencies: [text, html, delay, stagger] }
  );

  const rawText = text || (html ? html.replace(/<[^>]+>/g, " ") : "");

  if (animationType === "words") {
    const words = rawText.split(/\s+/);
    return React.createElement(
      Component,
      { ref: containerRef as React.Ref<any>, className: `inline-block ${className}` },
      words.map((word, i) => (
        <span key={i} className="word-item inline-block will-change-[transform,opacity,filter] mr-[0.28em]">
          {word}
        </span>
      ))
    );
  }

  // Chars split
  const chars = rawText.split("");
  return React.createElement(
    Component,
    { ref: containerRef as React.Ref<any>, className: `inline-block ${className}` },
    chars.map((char, i) => (
      <span
        key={i}
        className="char-item inline-block will-change-[transform,opacity,filter]"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  );
}
