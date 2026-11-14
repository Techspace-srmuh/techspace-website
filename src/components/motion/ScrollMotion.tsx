"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Motion for the sections that otherwise respond only to hover or a one-time reveal. */
export function ScrollMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const animations: gsap.core.Tween[] = [];
      const reveal = (selector: string, distance: number, stagger = 0.09) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector);
        if (!elements.length) return;
        animations.push(gsap.fromTo(elements,
          { y: distance, autoAlpha: 0, filter: "blur(10px)" },
          { y: 0, autoAlpha: 1, filter: "blur(0px)", stagger, duration: 0.95,
            ease: "power3.out", scrollTrigger: { trigger: elements[0], start: "top 85%", once: true } }
        ));
      };

      reveal("#team .grid > div", 65, 0.11);
      reveal("#gallery .grid > div", 55, 0.075);
      reveal("#journey .group", 45, 0.12);

      const sections = ["#why-join", "#testimonials", "#team", "#gallery", "#journey"];
      sections.forEach((selector) => {
        const section = document.querySelector<HTMLElement>(selector);
        const heading = section?.querySelector<HTMLElement>("h2");
        if (!section || !heading) return;
        animations.push(gsap.fromTo(heading,
          { y: 35, opacity: 0.35 },
          { y: 0, opacity: 1, ease: "none", scrollTrigger: {
            trigger: section, start: "top bottom", end: "top 45%", scrub: 0.7,
          } }
        ));
      });

      // Keep the main compositions moving while they occupy the viewport.
      const scrub = (target: string, trigger: string, from: gsap.TweenVars, to: gsap.TweenVars) => {
        const element = document.querySelector<HTMLElement>(target);
        const section = document.querySelector<HTMLElement>(trigger);
        if (!element || !section) return;
        animations.push(gsap.fromTo(element, from, {
          ...to, ease: "none", scrollTrigger: {
            trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8,
          },
        }));
      };
      scrub(".fact-photo img", "#facts", { yPercent: -14, scale: 1.18 }, { yPercent: 14, scale: 1.18 });
      scrub(".fact-portraits", "#facts", { y: 55 }, { y: -55 });
      scrub(".work-intro h2", "#work", { x: -90, opacity: 0.45 }, { x: 0, opacity: 1 });
      scrub(".domain-sculpture", "#domains", { scale: 0.7 }, { scale: 1.22 });
      scrub(".story-content", "#testimonials", { y: 65 }, { y: -65 });
      scrub(".site-footer h2", ".site-footer", { y: 90, opacity: 0.25 }, { y: -30, opacity: 1 });

      gsap.utils.toArray<HTMLElement>("#gallery .grid img").forEach((image) => {
        animations.push(gsap.fromTo(image, { yPercent: -9, scale: 1.18 }, {
          yPercent: 9, scale: 1.18, ease: "none", scrollTrigger: {
            trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7,
          },
        }));
      });

      return () => animations.forEach(animation => animation.kill());
    });

    mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("#work .work-project");
      const animations = cards.map((card) => {
        const image = card.querySelector<HTMLElement>(".work-image img");
        const text = card.querySelector<HTMLElement>(".work-project-copy");
        const timeline = gsap.timeline({ scrollTrigger: {
          trigger: card, start: "top 90%", end: "top 38%", scrub: 0.65,
        } });
        timeline.fromTo(card, { y: 85, opacity: 0.4 }, { y: 0, opacity: 1, ease: "none" }, 0);
        if (image) timeline.fromTo(image, { scale: 1.16, yPercent: -7 }, { scale: 1, yPercent: 0, ease: "none" }, 0);
        if (text) timeline.fromTo(text, { y: 25, opacity: 0.3 }, { y: 0, opacity: 1, ease: "none" }, 0.1);
        return timeline;
      });
      return () => animations.forEach(animation => animation.kill());
    });

    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    document.fonts.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    window.addEventListener("trionn-ready", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      mm.revert();
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refresh);
      window.removeEventListener("trionn-ready", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);
  return null;
}
