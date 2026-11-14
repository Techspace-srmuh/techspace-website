"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJoinModal } from "@/components/join/hooks/useJoinModal";
import { useSound } from "@/components/providers/SoundProvider";

const words = ["creation.", "possibility.", "impact."];

export function TrionnHero() {
  const root = useRef<HTMLElement>(null);
  const [word, setWord] = useState(0);
  const { openJoinModal } = useJoinModal();
  const { playHover, playClick } = useSound();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let interval: ReturnType<typeof setInterval> | undefined;
    let ctx: gsap.Context | undefined;
    let started = false;
    const start = () => {
      if (started || reduced) return;
      started = true;
      ctx = gsap.context(() => {
        gsap.from(".hero-line", { yPercent: 110, stagger: .12, duration: 1.25, ease: "power4.out" });
        gsap.from(".hero-actions, .hero-note, .hero-blast", { opacity: 0, y: 15, duration: 1, stagger: .1, delay: .4 });
        gsap.to(".hero-copy", { y: -90, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "65% top", scrub: true } });
        gsap.to(".hero-note, .hero-blast, .hero-scroll", { y: -60, opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "75% top", scrub: true } });
      }, root);
      interval = setInterval(() => setWord(value => (value + 1) % words.length), 3800);
    };
    if (document.documentElement.dataset.trionnReady === "true") start();
    window.addEventListener("trionn-ready", start);
    return () => { window.removeEventListener("trionn-ready", start); clearInterval(interval); ctx?.revert(); };
  }, []);
  return <section ref={root} id="hero" className="reference-hero">
    <div className="hero-copy">
      <h1 aria-label="Where curiosity meets creation.">
        <span className="hero-mask"><span className="hero-line">Where curiosity</span></span>
        <span className="hero-mask"><span className="hero-line">meets <span key={word} className="hero-changing-word">{words[word]}</span></span></span>
      </h1>
      <div className="hero-actions">
        <button className="editorial-link" onMouseEnter={playHover} onClick={() => { playClick(); openJoinModal(); }}>Join the community <span>↗</span></button>
        <a className="editorial-link" href="#work" onMouseEnter={playHover}>Explore our work <span>→</span></a>
      </div>
    </div>
    <a href="#about" className="hero-scroll" aria-label="Scroll to about"><span />Scroll to explore</a>
    <button className="hero-blast" onPointerDown={() => window.dispatchEvent(new Event("techspace-charge"))} onPointerUp={() => window.dispatchEvent(new Event("techspace-release"))} onPointerCancel={() => window.dispatchEvent(new Event("techspace-release"))} onKeyDown={e => { if (!e.repeat && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); window.dispatchEvent(new Event("techspace-charge")); } }} onKeyUp={e => { if (e.key === "Enter" || e.key === " ") window.dispatchEvent(new Event("techspace-release")); }}>
      Hold to <span className="blast-star">✺</span> blast<br />Dare <span className="blast-bolt">ϟ</span> to touch the lines.
    </button>
    <aside className="hero-note">
      <div className="hero-stamp"><span><svg viewBox="0 0 40 26" aria-hidden="true"><ellipse cx="20" cy="13" rx="17" ry="10"/><ellipse cx="20" cy="13" rx="7" ry="10"/><path d="M3 13h34"/></svg>Est. 2025</span><span>Curious minds.<br />Limitless possibilities.</span></div>
      <p>A student community building with code, design, and a shared curiosity for what comes next.</p>
    </aside>
  </section>;
}
