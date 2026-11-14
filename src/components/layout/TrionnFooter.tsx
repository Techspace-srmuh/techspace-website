"use client";

import React, { useEffect, useState } from "react";
import { FooterSmokeCanvas } from "@/components/canvas/FooterSmokeCanvas";
import { useSound } from "@/components/providers/SoundProvider";
import { useJoinModal } from "@/components/join/hooks/useJoinModal";

export function TrionnFooter() {
  const { playHover, playClick } = useSound();
  const { openJoinModal } = useJoinModal();
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      id="join"
      className="site-footer reference-footer relative z-20 min-h-dvh flex flex-col justify-between overflow-hidden bg-[#040508] text-white pt-28 sm:pt-32 pb-8 border-t border-white/10"
    >
      {/* Procedural Smoke Mist Canvas */}
      <FooterSmokeCanvas />

      {/* Main Container */}
      <div className="tr__container relative z-10 flex flex-col justify-between flex-1 gap-12 sm:gap-16">
        {/* Top Row: Motto & Live IST Clock */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
            LET&apos;S BUILD WORK THAT INSPIRES.
          </span>
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 tracking-wider">
            <span>IST →</span>
            <span className="text-white font-medium">{istTime || "--:--"}</span>
          </div>
        </div>

        {/* Middle Block: Giant Headline on Left, Action CTAs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start my-auto">
          {/* Left Column: Headline */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.06em] text-white leading-[0.95]">
              Ready to build <br />
              something bold?
            </h2>

            <div className="flex flex-col gap-1.5 font-mono text-xs text-neutral-500 uppercase tracking-wider mt-2">
              <span>©TECHSPACE 2026</span>
              <span className="text-neutral-400">SOUND ON 🎵 HOVER THE LINES.</span>
            </div>
          </div>

          {/* Right Column: CTA Links & Directory */}
          <div className="lg:col-span-5 flex flex-col gap-10 lg:pl-8">
            {/* Top Underline CTAs */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  playClick();
                  openJoinModal();
                }}
                onMouseEnter={playHover}
                className="tr-link-underline text-white font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center justify-between cursor-pointer py-2.5 border-b border-white/15"
              >
                <span>JOIN WHATSAPP COMMUNITY</span>
                <span>→</span>
              </button>

              <button
                onClick={() => {
                  playClick();
                  openJoinModal();
                }}
                onMouseEnter={playHover}
                className="tr-link-underline text-neutral-400 hover:text-white font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center justify-between cursor-pointer py-2.5 border-b border-white/15 transition-colors"
              >
                <span>FOLLOW INSTAGRAM</span>
                <span>→</span>
              </button>
            </div>

            {/* Campus & Social Directory */}
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="flex flex-col gap-2 font-mono text-xs">
                <span className="text-neutral-500 uppercase tracking-wider">CAMPUS DESK</span>
                <span className="text-neutral-300">SRM University Sonipat</span>
                <span className="text-neutral-400">Sonipat, Haryana</span>
              </div>

              <div className="flex flex-col gap-2 font-mono text-xs">
                <span className="text-neutral-500 uppercase tracking-wider">SOCIAL</span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://github.com/Techspace-srmuh"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHover}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.instagram.com/techspace_srmuh"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHover}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://chat.whatsapp.com/B6VOoPe6MEZ69aj554H9W4"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHover}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://www.linkedin.com/company/techspace-srmuh/"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHover}
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Scan Lines Brand Watermark (matches TRIONN footer screenshot) */}
        <div
          className="relative w-full py-4 overflow-hidden select-none"
          onMouseEnter={playHover}
        >
          <div
            className="w-full flex justify-center items-center text-center font-sans font-black text-[12vw] sm:text-[13vw] tracking-tighter uppercase leading-none text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(255, 255, 255, 0.12)",
              backgroundImage: "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 4px)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            TECHSPACE
          </div>
        </div>

        {/* Copyright & Disclaimer Bar */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
          <span>© 2026 TECHSPACE. SRM UNIVERSITY SONIPAT.</span>
          <div className="flex items-center gap-6">
            <span>WHERE CURIOSITY MEETS CREATION.</span>
            <span>ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
