"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { domainsData } from "@/data/domains";
import { teamMembers } from "@/components/sections/team/data";

export function TrionnKeyFacts() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".fact-card", { y: 80, opacity: 0, rotateX: 7, stagger: .15, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".facts-grid", start: "top 85%" } });
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach(el => {
      const value = { n: 0 };
      gsap.to(value, { n: Number(el.dataset.count), duration: 1.6, ease: "power2.out", onUpdate: () => { el.textContent = String(Math.round(value.n)); }, scrollTrigger: { trigger: el, start: "top 90%" } });
    });
  }, { scope: root });
  return <section id="facts" ref={root} className="reference-facts">
    <h2>Key facts.</h2><p className="facts-intro">A snapshot of our<br />community and its possibilities.</p>
    <div className="facts-grid">
      <article className="fact-card fact-photo"><Image src="/assets/gallery/codeblitz/IMG-20260313-WA0084.jpg" alt="TechSpace students at CodeBlitz" fill sizes="(max-width: 700px) 90vw, 32vw" /><div className="fact-card-shade"/><h3>Learn by doing</h3><div className="fact-card-bottom"><p>Workshops, experiments,<br />and shared discoveries.</p><span>2025<small>EST.</small></span></div></article>
      <article className="fact-card fact-circle-card"><h3>Technical domains</h3><div className="fact-circle"><span data-count={domainsData.length}>{domainsData.length}</span><sup>+</sup></div><p>Find your interest.<br />Build something that matters.</p></article>
      <article className="fact-card fact-team"><h3>Our team members</h3><div className="fact-portraits">{teamMembers.slice(0, 4).map(member => <div key={member.id}><Image src={member.image} alt={member.name} fill sizes="130px" /></div>)}</div><div className="fact-card-bottom"><p>Different skills.<br />One community.</p><span data-count={teamMembers.length}>{teamMembers.length}</span></div></article>
    </div>
    <div className="facts-disciplines"><p>One community. Many ways to create.</p><div><span>code.</span><span>design.</span><span>develop.</span><span>collaborate.</span><span>grow.</span></div></div>
    <div className="facts-cross">+</div>
  </section>;
}
