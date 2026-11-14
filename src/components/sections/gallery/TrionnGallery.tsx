"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BlurTextReveal } from "@/components/motion/BlurTextReveal";
import { useSound } from "@/components/providers/SoundProvider";

interface GalleryPhoto {
  src: string;
  alt: string;
  category: string;
  caption: string;
  aspect: "landscape" | "portrait" | "square";
}

export function TrionnGallery() {
  const { playHover, playClick } = useSound();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const photos: GalleryPhoto[] = [
    {
      src: "/assets/gallery/codeblitz/IMG-20260313-WA0084.jpg",
      alt: "CodeBlitz Coding Sprint",
      category: "CodeBlitz",
      caption: "Students solving algorithmic problems under pressure in the 5th-floor computer labs.",
      aspect: "landscape",
    },
    {
      src: "/assets/gallery/devops_workshop/20251118_154526.jpg",
      alt: "DevOps Workshop Live Deployment",
      category: "DevOps",
      caption: "Interactive terminal session explaining Docker containerization and cloud CI/CD.",
      aspect: "portrait",
    },
    {
      src: "/assets/gallery/artistic_aura/IMG-20260313-WA0088.jpg",
      alt: "Artistic Aura UI Exhibition",
      category: "Artistic Aura",
      caption: "Creative digital design exhibition featuring student UI/UX projects and vector art.",
      aspect: "portrait",
    },
    {
      src: "/assets/gallery/Java_gui_workshop/DSC_8732.JPG",
      alt: "Java GUI Workshop",
      category: "Java GUI",
      caption: "Hands-on desktop GUI development with JavaFX event listeners and custom layouts.",
      aspect: "landscape",
    },
    {
      src: "/assets/gallery/java_dsa/IMG_20251119_125029.jpg",
      alt: "DSA using Java Bootcamp",
      category: "DSA Java",
      caption: "Multi-phase data structures and algorithms workshop solving live coding problems.",
      aspect: "square",
    },
    {
      src: "/assets/gallery/memocracy/Copy%20of%20IMG20260313150508.jpg",
      alt: "Memocracy Creative Challenge",
      category: "Memocracy",
      caption: "Students collaborating on digital visual humor and creative storytelling.",
      aspect: "landscape",
    },
    {
      src: "/assets/gallery/codeblitz/IMG-20260313-WA0091.jpg",
      alt: "CodeBlitz Lab Session",
      category: "CodeBlitz",
      caption: "Final countdown of the competitive programming sprint with real-time leaderboard.",
      aspect: "square",
    },
    {
      src: "/assets/gallery/devops_workshop/20251118_150610.jpg",
      alt: "DevOps Workshop Discussion",
      category: "DevOps",
      caption: "Technical deep-dive on container orchestration and GitHub Actions pipelines.",
      aspect: "portrait",
    },
  ];

  const categories = ["all", "CodeBlitz", "DevOps", "Artistic Aura", "Java GUI", "DSA Java", "Memocracy"];

  const filteredPhotos =
    activeFilter === "all" ? photos : photos.filter((p) => p.category === activeFilter);

  return (
    <section
      id="gallery"
      className="relative z-10 py-28 lg:py-40 bg-[#040508] text-white border-t border-white/5"
    >
      <div className="tr__container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 pb-8 border-b border-white/10 gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              / 08 — ARCHIVE & MOMENTS
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              <BlurTextReveal text="Captured campus moments." animationType="words" />
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setActiveFilter(cat);
                }}
                onMouseEnter={playHover}
                className={`font-mono text-xs uppercase px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeFilter === cat
                    ? "bg-white text-black font-semibold"
                    : "bg-white/5 text-neutral-400 hover:bg-white/15 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Photo Masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.src}
              onClick={() => {
                playClick();
                setActivePhoto(photo);
              }}
              onMouseEnter={playHover}
              className={`group relative overflow-hidden rounded-sm bg-neutral-900 border border-white/5 hover:border-white/20 transition-all duration-500 cursor-pointer ${
                photo.aspect === "landscape"
                  ? "sm:col-span-2 aspect-[16/10]"
                  : photo.aspect === "portrait"
                  ? "aspect-[3/4]"
                  : "aspect-square"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover object-center grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  {photo.category}
                </span>
                <p className="text-xs sm:text-sm text-white font-light leading-snug line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center bg-[#08090f] border border-white/10 rounded-sm overflow-hidden p-4"
          >
            <div className="relative w-full h-[60vh]">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="w-full pt-4 flex items-center justify-between font-mono text-xs text-neutral-400">
              <span>{activePhoto.caption}</span>
              <button
                onClick={() => setActivePhoto(null)}
                className="text-white hover:text-neutral-400 uppercase tracking-widest font-semibold"
              >
                Close [✕]
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

