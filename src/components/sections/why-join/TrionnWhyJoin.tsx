"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { benefitsData } from "./data";
import { BlurTextReveal } from "@/components/motion/BlurTextReveal";
import { useSound } from "@/components/providers/SoundProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TrionnWhyJoin() {
  const { playHover, playClick } = useSound();
  const sectionRef = useRef<HTMLElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rowsContainerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rows = rowsContainerRef.current.querySelectorAll(".benefit-row");
      if (!rows.length) return;

      gsap.fromTo(
        rows,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowsContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="why-join"
      className="relative z-10 py-28 lg:py-40 bg-[#040508] text-white border-t border-white/5"
    >
      <div className="tr__container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-white/10 gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              / 05 — VALUE PROPOSITION
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              <BlurTextReveal text="Why join TechSpace." animationType="words" />
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-neutral-400 font-light leading-relaxed">
            Five core pillars that make TechSpace the premier student developer incubator at SRM University Sonipat.
          </p>
        </div>

        {/* 5 Editorial Numbered Rows */}
        <div
          ref={rowsContainerRef}
          className="flex flex-col divide-y divide-white/10 border-b border-white/10"
        >
          {benefitsData.map((benefit) => {
            return (
              <div
                key={benefit.id}
                onMouseEnter={playHover}
                onClick={playClick}
                className="benefit-row group py-8 md:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer transition-colors duration-300 hover:bg-white/[0.02] px-4 md:px-8 rounded-sm"
              >
                {/* Number & Title */}
                <div className="flex items-baseline gap-6 md:gap-10 lg:w-1/2">
                  <span className="font-mono text-2xl md:text-4xl text-neutral-600 group-hover:text-white transition-colors duration-300">
                    {benefit.step}
                  </span>
                  <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white group-hover:translate-x-2 transition-transform duration-300">
                    {benefit.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="lg:w-1/2 flex items-center justify-between gap-6 pl-12 lg:pl-0">
                  <p className="text-sm md:text-base text-neutral-400 group-hover:text-neutral-200 transition-colors font-light leading-relaxed max-w-xl">
                    {benefit.description}
                  </p>
                  <span className="text-neutral-600 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 text-xl hidden sm:inline">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
