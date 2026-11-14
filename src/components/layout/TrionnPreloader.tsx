"use client";

import { useEffect, useState } from "react";

export function TrionnPreloader() {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("loading");
  useEffect(() => {
    let frame = 0;
    let exitTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const duration = reduced ? 0 : 1400;
    let cancelled = false;
    const ready = () => {
      setPhase("leaving");
      hideTimer = setTimeout(() => {
        if (cancelled) return;
        setPhase("hidden");
        document.documentElement.dataset.trionnReady = "true";
        window.dispatchEvent(new Event("trionn-ready"));
      }, reduced ? 0 : 850);
    };
    const update = (now: number) => {
      const p = duration ? Math.min((now - start) / duration, 1) : 1;
      setPercent(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) frame = requestAnimationFrame(update);
      else exitTimer = setTimeout(ready, reduced ? 0 : 100);
    };
    frame = requestAnimationFrame(update);
    return () => { cancelled = true; cancelAnimationFrame(frame); clearTimeout(exitTimer); clearTimeout(hideTimer); };
  }, []);
  if (phase === "hidden") return null;
  return <div className={`reference-loader ${phase}`} aria-hidden="true">
    <div className="loader-belts">{Array.from({ length: 10 }, (_, i) => <div key={i} style={{ transitionDelay: `${i * 25}ms` }} />)}</div>
    <div className="loader-center"><div className="loader-frame"><i/><i/><i/><i/><svg viewBox="0 0 100 100"><path d="M17 24h66v13H57v46H43V37H17z"/><path d="M20 49h13v21h-13zm47 0h13v34H67z"/></svg></div><p>Learn <span>·</span> Build <span>·</span> Grow</p></div>
    <span className="loader-count">{String(percent).padStart(3, "0")}</span>
  </div>;
}
