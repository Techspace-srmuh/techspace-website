"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FooterSmokeCanvas } from "@/components/canvas/FooterSmokeCanvas";
import { domainsData } from "@/data/domains";
import { useJoinModal } from "@/components/join/hooks/useJoinModal";

export function TrionnDomains() {
  const root = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState(false);
  const { openJoinModal } = useJoinModal();
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".domain-title span", { yPercent: 70, opacity: 0, stagger: .09, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 65%" } });
    gsap.to(".domain-sculpture", { rotate: 140, y: 80, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 } });
  }, { scope: root });
  return <section ref={root} id="domains" className="reference-domains">
    <div className="domain-stage"><FooterSmokeCanvas /><p className="domain-eyebrow">Our domains</p><div className="domain-sculpture" aria-hidden="true"><i/><i/><i/></div><h2 className="domain-title"><span>A.I.</span><span>Design</span><span>Development</span><span>Open source</span></h2><div className="domain-bottom"><span>✦ Different disciplines. One shared curiosity.</span><button aria-expanded={expanded} aria-controls="domain-directory" className="editorial-link" onClick={() => { setExpanded(!expanded); requestAnimationFrame(() => ScrollTrigger.refresh()); }}>{expanded ? "Close domains" : "Explore domains"}<span>{expanded ? "−" : "↗"}</span></button></div></div>
    {expanded && <div id="domain-directory" className="domain-directory">{domainsData.map((domain, i) => <article key={domain.id}><span>0{i + 1}</span><div><h3>{domain.title}</h3><p>{domain.description}</p><small>{domain.technologies.join(" / ")}</small></div><button onClick={openJoinModal} aria-label={`Join ${domain.title}`}>↗</button></article>)}</div>}
  </section>;
}
