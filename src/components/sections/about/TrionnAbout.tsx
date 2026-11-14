"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const statement = "TechSpace is a student developer community turning curiosity into real experiences through code, design, and technology.";
export function TrionnAbout() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".about-word", { color: "#292929" }, { color: "#cecece", stagger: .04, ease: "none", scrollTrigger: { trigger: ".reference-about", start: "top 30%", end: "bottom 60%", scrub: 0.8 } });
      gsap.from(".about-detail", { y: 40, opacity: 0, duration: 1, stagger: .1, scrollTrigger: { trigger: ".about-details", start: "top 90%" } });
      gsap.to(".vision-track", { xPercent: -35, ease: "none", scrollTrigger: { trigger: ".reference-vision", start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.fromTo(".vision-shutter", { scaleY: 0 }, { scaleY: 1.05, stagger: .08, ease: "none", scrollTrigger: { trigger: ".reference-vision", start: "bottom bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, { scope: root });
  return <div ref={root} className="opening-story">
    <section id="about" className="reference-about">
      <span className="about-label">About</span>
      <div className="about-editorial">
        <h2 className="about-statement">{statement.split(" ").map((word, i) => <span className="about-word" key={i}>{word}{" "}</span>)}</h2>
        <div className="editorial-rule"><span>+</span></div>
        <div className="about-details">
          <p className="about-detail">Built by students.<br />Driven by curiosity.<br />Made to make a difference.</p>
          <div className="about-detail"><p>At SRM University Delhi-NCR, we learn by building. Workshops, open-source projects, and shared experiments bring curious people together.</p><a href="#team" className="editorial-link">Meet the community <span>→</span></a></div>
        </div>
      </div>
    </section>
    <section className="reference-vision" aria-label="Learn, build, grow">
      <p className="vision-caption">Curious minds.<br />Collective ambition.</p>
      <div className="vision-track" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>Learn <i>+</i> Build <i>+</i> Grow <i>+</i> </span>)}</div>
      <div className="vision-shutters" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <div className="vision-shutter" key={i} />)}</div>
    </section>
  </div>;
}
