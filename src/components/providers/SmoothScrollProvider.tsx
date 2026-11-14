"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      autoRaf: false,
      anchors: { offset: -80 },
    });

    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis");

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger when DOM / preloader completes
    const handleReady = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    };

    const onLock = (event: Event) => {
      if ((event as CustomEvent<boolean>).detail) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("techspace-scroll-lock", onLock);
    window.addEventListener("trionn-ready", handleReady);
    window.addEventListener("resize", handleReady);

    return () => {
      window.removeEventListener("techspace-scroll-lock", onLock);
      window.removeEventListener("trionn-ready", handleReady);
      window.removeEventListener("resize", handleReady);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}

