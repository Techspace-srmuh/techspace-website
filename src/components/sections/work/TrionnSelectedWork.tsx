"use client";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSound } from "@/components/providers/SoundProvider";
interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  metrics: string;
  image: string;
  description: string;
}

const projects: Project[] = [
  {
    id: "codeblitz",
    title: "CodeBlitz",
    subtitle: "High-octane competitive programming sprint and speed contest.",
    category: "COMPETITIVE PROGRAMMING",
    date: "13 March 2026",
    metrics: "40 PARTICIPANTS · 90 MINS",
    image: "/assets/gallery/codeblitz/IMG-20260313-WA0084.jpg",
    description: "Rapid problem solving, algorithmic speed, and real-time live projected leaderboard.",
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    subtitle: "Hands-on containerization and automated cloud pipeline deployment.",
    category: "INFRASTRUCTURE WORKSHOP",
    date: "18 November 2025",
    metrics: "50 ATTENDEES · LIVE CLUSTER",
    image: "/assets/gallery/devops_workshop/20251118_154526.jpg",
    description: "Docker containers, zero-downtime CI/CD workflows, and production cluster orchestration.",
  },
  {
    id: "artistic-aura",
    title: "Artistic Aura",
    subtitle: "Digital design and creative technology exhibition.",
    category: "UI/UX & DESIGN SYSTEMS",
    date: "14 March 2026",
    metrics: "30 DESIGNERS · 3 HOURS",
    image: "/assets/gallery/artistic_aura/IMG-20260313-WA0088.jpg",
    description: "Interactive web interfaces, vector artwork, generative visuals, and design system tokens.",
  },
  {
    id: "java-gui",
    title: "Java Desktop Systems",
    subtitle: "Standalone event-driven application architecture.",
    category: "SOFTWARE ENGINEERING",
    date: "19 November 2025",
    metrics: "45 ATTENDEES · 2 DAYS",
    image: "/assets/gallery/Java_gui_workshop/DSC_8732.JPG",
    description: "Crafting standalone desktop software applications, event layouts, and modular UI.",
  },
  {
    id: "dsa-java",
    title: "DSA Bootcamp",
    subtitle: "Comprehensive foundational data structures & algorithmic mastery.",
    category: "ALGORITHMS & DATA STRUCTURES",
    date: "25 Sep – 31 Oct 2025",
    metrics: "50+ ATTENDEES · 3 PHASES",
    image: "/assets/gallery/java_dsa/IMG_20251119_125029.jpg",
    description: "Recursive trees, sorting mechanics, memory optimization, and interview readiness.",
  },
  {
    id: "memocracy",
    title: "Memocracy Challenge",
    subtitle: "Fast-paced digital media and technical communication showcase.",
    category: "CREATIVE MEDIA",
    date: "13 March 2026",
    metrics: "CAMPUS-WIDE SHOWCASE",
    image: "/assets/gallery/memocracy/Copy%20of%20IMG20260313150508.jpg",
    description: "Creative visual storytelling and tech culture design based on live assigned themes.",
  },
];


export function TrionnSelectedWork() {
 const root = useRef<HTMLElement>(null);
 const track = useRef<HTMLDivElement>(null);
 const {playHover} = useSound();
 useGSAP(() => {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)",()=>{
   const distance = () => Math.max(0,(track.current?.scrollWidth || 0) - innerWidth);
   gsap.to(track.current, {x:()=>-distance(), ease:"none",scrollTrigger:{trigger:root.current,start:"top top",end:()=>"+="+distance(),pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1}});
  });
  return ()=>mm.revert();
 },{scope:root});
 return <section ref={root} id="work" className="reference-work"><div className="work-track" ref={track}>
  <div className="work-intro"><span>Selected work</span><h2>Built with<br/>curiosity.</h2><p>Ideas become experiences.<br/>This is where we put them to work.</p><a href="#gallery" className="editorial-link">View all moments <span>→</span></a><small>Scroll to discover ↘</small></div>
  {projects.map((project,i)=><article className="work-project" key={project.id}>
   <a href="#gallery" onMouseEnter={playHover} className="work-image" aria-label={"Explore " + project.title}><Image src={project.image} alt={project.title} fill sizes="(max-width: 899px) 90vw, 45vw" className="object-cover"/><span className="work-image-cursor">Explore ↗</span></a>
   <div className="work-project-copy"><h3>{project.title}</h3><div><p>{project.subtitle}</p><a href="#gallery" className="editorial-link">Explore event <span>→</span></a></div><small>0{i+1} / {project.category}</small></div>
  </article>)}
  <div className="work-end"><h3>Every experiment.<br/>Every collaboration.<br/>A little further forward.</h3><a href="#gallery" className="editorial-link">View the gallery <span>→</span></a></div>
 </div></section>;
}
