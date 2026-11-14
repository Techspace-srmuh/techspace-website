"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/providers/SoundProvider";
import { useJoinModal } from "@/components/join/hooks/useJoinModal";

const links = [{ label: "Work", href: "#work" }, { label: "Domains", href: "#domains" }, { label: "About", href: "#about" }, { label: "Community", href: "#team" }];
export function TrionnNavbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const { isMuted, toggleMute, playClick, playHover } = useSound();
  const { openJoinModal } = useJoinModal();
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("techspace-scroll-lock", { detail: true }));
    const frame = requestAnimationFrame(() => menu.current?.querySelector<HTMLAnchorElement>("a")?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const controls = [...(menu.current?.querySelectorAll<HTMLElement>("a,button") || [])];
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = old; document.removeEventListener("keydown", onKey); window.dispatchEvent(new CustomEvent("techspace-scroll-lock", { detail: false })); };
  }, [open]);
  return <>
    <header className={`reference-nav ${open ? "menu-active" : ""}`}>
      <a href="#hero" aria-label="TechSpace home" className="reference-brand" onClick={() => setOpen(false)}><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M4 8h28v5H20v20h-5V13H4zm0 11h5v14H4zm22 0h6v14h-6z"/></svg><span>TECHSPACE<sup>®</sup></span></a>
      <div className="nav-controls">
        <button className="sound-control" onClick={toggleMute} aria-label={isMuted ? "Enable sound" : "Mute sound"} aria-pressed={!isMuted}>{isMuted ? <span>♪<i/></span> : <span className="sound-bars"><i/><i/><i/><i/></span>}</button>
        <button className="nav-join" onMouseEnter={playHover} onClick={() => { setOpen(false); openJoinModal(); }}>Let&apos;s build</button>
        <button ref={toggle} className="nav-menu" aria-expanded={open} aria-controls="site-menu" onMouseEnter={playHover} onClick={() => { playClick(); setOpen(value => !value); }}>{open ? "Close" : "Menu"}<span>{open ? "×" : "═"}</span></button>
      </div>
    </header>
    <div ref={menu} id="site-menu" className={`reference-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal={open || undefined} aria-label="Navigation" inert={!open} data-lenis-prevent>
      <nav>{links.map((link, i) => <a href={link.href} key={link.href} style={{ transitionDelay: `${open ? i * 65 + 120 : 0}ms` }} onMouseEnter={playHover} onClick={() => { setOpen(false); playClick(); }}><small>0{i + 1}</small><span>{link.label}</span><span className="menu-arrow">↗</span></a>)}</nav>
      <div className="menu-aside"><p>Learn. Build. Grow.</p><span>SRM University Delhi-NCR<br />Sonipat, Haryana</span><a href="#gallery" onClick={() => setOpen(false)} className="editorial-link">Life at TechSpace <span>↗</span></a><div className="menu-social"><a href="https://github.com/Techspace-srmuh" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.instagram.com/techspace_srmuh" target="_blank" rel="noreferrer">Instagram ↗</a></div><button onClick={() => { setOpen(false); toggle.current?.focus(); }} className="editorial-link">Close navigation <span>×</span></button></div>
    </div>
  </>;
}
