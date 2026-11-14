import { Hero3DCanvas } from "@/components/canvas/Hero3DCanvas";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { TrionnPreloader } from "@/components/layout/TrionnPreloader";
import { TrionnNavbar } from "@/components/layout/TrionnNavbar";
import { TrionnHero } from "@/components/sections/hero/TrionnHero";
import { TrionnAbout } from "@/components/sections/about/TrionnAbout";
import { TrionnKeyFacts } from "@/components/sections/facts/TrionnKeyFacts";
import { TrionnSelectedWork } from "@/components/sections/work/TrionnSelectedWork";
import { TrionnDomains } from "@/components/sections/domains/TrionnDomains";
import { TrionnWhyJoin } from "@/components/sections/why-join/TrionnWhyJoin";
import { TrionnTestimonials } from "@/components/sections/testimonials/TrionnTestimonials";
import { TrionnOrbit } from "@/components/sections/orbit/TrionnOrbit";
import { TrionnTeam } from "@/components/sections/team/TrionnTeam";
import { TrionnGallery } from "@/components/sections/gallery/TrionnGallery";
import { TrionnJourney } from "@/components/sections/journey/TrionnJourney";
import { TrionnFooter } from "@/components/layout/TrionnFooter";

export default function Home() {
  return (
    <>
      {/* 10-Belt Choreographed Preloader */}
      <TrionnPreloader />

      {/* Fixed Mix-Blend Difference Header */}
      <TrionnNavbar />
      <Hero3DCanvas />
      <ScrollMotion />

      {/* Hero with 3D WebGL Scene & Rotating Headline */}
      <div className="hero-scroll-stage"><TrionnHero /></div>

      {/* Editorial Statement About Section */}
      <TrionnAbout />

      {/* Key Facts & Community Metrics */}
      <TrionnKeyFacts />

      {/* High-Contrast Editorial Light Shift: Selected Work & Events */}
      <TrionnSelectedWork />

      {/* Deep Void 3D Perspective Technical Domains */}
      <TrionnDomains />

      {/* Numbered Why Join Value Proposition */}
      <TrionnWhyJoin />

      {/* High-Fashion Gradient Light Shift: Student Stories */}
      <TrionnTestimonials />

      {/* Design/Code in Motion: 3D Helical Orbit Carousel & Scrubbed Marquee */}
      <TrionnOrbit />

      {/* Core Team Gallery with Real Members & Photography */}
      <TrionnTeam />

      {/* Comprehensive Event Photo Archive with Category Filtering */}
      <TrionnGallery />

      {/* Milestone Journey Timeline */}
      <TrionnJourney />

      {/* Pinned Veil Reveal Footer with Procedural GLSL Mist */}
      <TrionnFooter />
    </>
  );
}
