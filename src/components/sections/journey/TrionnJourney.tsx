"use client";

import React from "react";
import { journeyData } from "@/components/seo/journey/data";
import { BlurTextReveal } from "@/components/motion/BlurTextReveal";
import { useSound } from "@/components/providers/SoundProvider";

export function TrionnJourney() {
  const { playHover } = useSound();

  return (
    <section
      id="journey"
      className="relative z-10 py-28 lg:py-40 bg-[#040508] text-white border-t border-white/5"
    >
      <div className="tr__container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-white/10 gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              / 09 — TIMELINE
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              <BlurTextReveal text="Our journey so far." animationType="words" />
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-neutral-400 font-light leading-relaxed">
            Every major movement starts with a single step. Here is how TechSpace was established and where we are
            heading next.
          </p>
        </div>

        {/* Minimalist Editorial Timeline */}
        <div className="relative border-l border-white/15 ml-4 md:ml-8 pl-8 md:pl-16 flex flex-col gap-16 md:gap-20">
          {journeyData.map((event, index) => (
            <div
              key={event.id}
              onMouseEnter={playHover}
              className="group relative flex flex-col items-start"
            >
              {/* Dot on the timeline */}
              <div className="absolute -left-[37px] md:-left-[69px] top-1.5 w-3 h-3 rounded-full bg-neutral-600 border-2 border-[#040508] group-hover:bg-white group-hover:scale-125 transition-all duration-300" />

              {/* Milestone Year / Phase Badge */}
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 group-hover:text-white transition-colors mb-2">
                PHASE 0{index + 1} — {event.year}
              </span>

              {/* Title */}
              <h3 className="font-sans font-bold text-2xl md:text-3xl lg:text-4xl text-white group-hover:translate-x-2 transition-transform duration-300">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-neutral-400 font-light leading-relaxed mt-2 max-w-2xl">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

