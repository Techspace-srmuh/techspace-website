"use client";

import React, { useState } from "react";
import Image from "next/image";
import { teamMembers } from "./data";
import { BlurTextReveal } from "@/components/motion/BlurTextReveal";
import { useSound } from "@/components/providers/SoundProvider";

export function TrionnTeam() {
  const { playHover, playClick } = useSound();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <section
      id="team"
      className="relative z-10 py-28 lg:py-40 bg-[#040508] text-white border-t border-white/5"
    >
      <div className="tr__container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-white/10 gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              / 07 — CORE ARCHITECTS
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              <BlurTextReveal text="The minds behind TechSpace." animationType="words" />
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-neutral-400 font-light leading-relaxed">
            Nine student leaders guiding technical curriculum, community engineering, creative design, and operational
            execution.
          </p>
        </div>

        {/* 3-Column Editorial Portrait Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {teamMembers.map((member, index) => {
            const isHovered = selectedMember === member.id;
            return (
              <div
                key={member.id}
                onMouseEnter={() => {
                  playHover();
                  setSelectedMember(member.id);
                }}
                onMouseLeave={() => setSelectedMember(null)}
                onClick={playClick}
                className="group flex flex-col justify-between p-6 rounded-sm border border-white/10 bg-[#08090f] hover:bg-[#0c0e16] hover:border-white/30 transition-all duration-500 cursor-pointer"
              >
                {/* Photo Frame */}
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090f] via-transparent to-transparent opacity-80" />

                  {/* Top Identifier */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                      LEAD / 0{index + 1}
                    </span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest">
                    {member.role}
                  </span>

                  <h3 className="font-sans font-bold text-2xl text-white group-hover:text-white transition-colors flex items-center justify-between">
                    <span>{member.name}</span>
                    <span className="text-base text-neutral-500 group-hover:text-white transition-colors">↗</span>
                  </h3>

                  <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed line-clamp-3 mt-1">
                    {member.intro}
                  </p>

                  {/* Skills / Stack Pills */}
                  {member.tags && member.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                      {member.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Outlets */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 font-mono text-xs text-neutral-400">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white transition-colors"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white transition-colors"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {member.portfolioUrl && (
                      <a
                        href={member.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-white transition-colors"
                      >
                        Portfolio ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

