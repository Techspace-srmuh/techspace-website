"use client";
import {useRef, useState} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useJoinModal} from "@/components/join/hooks/useJoinModal";
  const stories = [
    {
      quote:
        "TechSpace's DevOps workshop was the first time I actually containerized an application with Docker and pushed automated CI/CD pipelines to a live cloud cluster. Senior leads guided us through every terminal command.",
      author: "Aditya Sharma",
      role: "B.Tech CSE • 3rd Year",
      domain: "Cloud & DevOps",
    },
    {
      quote:
        "CodeBlitz was unforgettable. 40 students in the 5th-floor computer labs racing through algorithmic challenges with a live real-time leaderboard projected on the screen. It pushed my competitive programming speed to a new level.",
      author: "Priya Nair",
      role: "B.Tech CSE • 2nd Year",
      domain: "Competitive Programming",
    },
    {
      quote:
        "As someone obsessed with UI/UX, Artistic Aura gave me a campus platform to exhibit design systems, generative shaders, and 3D web interfaces. The community feedback and peer collaboration were invaluable.",
      author: "Rohan Verma",
      role: "B.Tech CSE • 3rd Year",
      domain: "UI/UX & Frontend",
    },
    {
      quote:
        "The 3-phase Java & DSA bootcamp transformed how I approach data structures. Covering arrays, linked lists, recursion, and trees with hands-on practice gave me the exact foundation I needed for technical interview prep.",
      author: "Sneha Patel",
      role: "B.Tech CSE • 2nd Year",
      domain: "Data Structures & Java",
    },
  ];


export function TrionnTestimonials(){
 const root=useRef<HTMLElement>(null);
 const [selected,setSelected]=useState(0);
 const {openJoinModal}=useJoinModal();
 useGSAP(()=>{
  gsap.registerPlugin(ScrollTrigger);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  gsap.from(".stories-heading",{y:55,filter:"blur(12px)",opacity:0,duration:1.1,scrollTrigger:{trigger:root.current,start:"top 70%"}});
 },{scope:root});
 const story=stories[selected];
 return <section id="testimonials" ref={root} className="reference-stories">
  <h2 className="stories-heading">Built together.<br/>Remembered together.</h2><p className="stories-intro">The people behind the projects.<br/>Stories from our community.</p>
  <div className="stories-tabs" role="tablist" aria-label="Community stories">{stories.map((s,i)=><button key={s.domain} role="tab" id={"story-tab-"+i} aria-controls="story-panel" aria-selected={selected===i} tabIndex={selected===i?0:-1} onClick={()=>setSelected(i)} onKeyDown={e=>{if(["ArrowRight","ArrowLeft","Home","End"].includes(e.key)){e.preventDefault();const next=e.key==="Home"?0:e.key==="End"?stories.length-1:(i+(e.key==="ArrowRight"?1:stories.length-1))%stories.length;setSelected(next);document.getElementById("story-tab-"+next)?.focus();}}}>{s.domain}</button>)}</div>
  <div id="story-panel" role="tabpanel" aria-labelledby={"story-tab-"+selected} tabIndex={0}><div key={selected} className="story-content"><span className="story-quote-mark" aria-hidden="true">“</span><blockquote>{story.quote}</blockquote><div className="story-person"><span>{story.author.split(" ").map(s=>s[0]).join("")}</span><div><p>{story.author}</p><small>{story.role}</small></div></div></div></div>
  <button onClick={openJoinModal} className="editorial-link">Be part of the story <span>→</span></button>
 </section>;
}
