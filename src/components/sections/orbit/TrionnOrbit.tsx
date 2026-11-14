"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSound } from "@/components/providers/SoundProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TrionnOrbit() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const { playHover } = useSound();

  // GSAP Scrubbing for Top Word and Bottom Word
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      tl.to(".orbit-top-word", { x: "25vw", ease: "none" }, 0).to(
        ".orbit-bottom-word",
        { x: "-25vw", ease: "none" },
        0
      );
    },
    { scope: containerRef }
  );

  // Three.js Helical Orbit Setup
  useEffect(() => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const width = canvasContainer.clientWidth || window.innerWidth;
    const height = canvasContainer.clientHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    canvasContainer.appendChild(renderer.domElement);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Event showcase image paths from public/assets/gallery
    const imagePaths = [
      "/assets/gallery/codeblitz/IMG-20260313-WA0084.jpg",
      "/assets/gallery/devops_workshop/20251118_154526.jpg",
      "/assets/gallery/artistic_aura/IMG-20260313-WA0088.jpg",
      "/assets/gallery/Java_gui_workshop/DSC_8732.JPG",
      "/assets/gallery/java_dsa/IMG_20251119_125029.jpg",
      "/assets/gallery/memocracy/Copy%20of%20IMG20260313150508.jpg",
      "/assets/gallery/codeblitz/IMG-20260313-WA0091.jpg",
      "/assets/gallery/devops_workshop/20251118_150610.jpg",
    ];

    const textureLoader = new THREE.TextureLoader();
    const cardMeshes: THREE.Mesh[] = [];
    const cardGeometries: THREE.PlaneGeometry[] = [];
    const cardMaterials: THREE.Material[] = [];

    const totalCards = imagePaths.length;
    const spiralStep = (Math.PI * 2) / 4.2;

    imagePaths.forEach((path, i) => {
      // 12x8 segmented plane for vertex displacement
      const geometry = new THREE.PlaneGeometry(2.6, 1.6, 12, 8);
      cardGeometries.push(geometry);

      const texture = textureLoader.load(path);
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      cardMaterials.push(material);

      const mesh = new THREE.Mesh(geometry, material);

      // Trajectory angle
      const angle = i * spiralStep;
      const radius = 5.2;
      const x = radius * Math.cos(angle);
      const y = (i - totalCards / 2) * 0.95 - 0.8 * Math.exp(-Math.pow((angle - Math.PI * 2) / 2, 2));
      const z = radius * Math.sin(angle);

      mesh.position.set(x, y, z);
      mesh.lookAt(0, y, 0);
      mesh.rotation.y += Math.PI; // Face outwards

      // Store initial positions for wave deformation
      const posArray = geometry.attributes.position.array as Float32Array;
      const restX = new Float32Array(posArray.length / 3);
      const restY = new Float32Array(posArray.length / 3);
      for (let j = 0; j < restX.length; j++) {
        restX[j] = posArray[3 * j];
        restY[j] = posArray[3 * j + 1];
      }

      mesh.userData = { restX, restY, angle };
      orbitGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    // Observer to pause rendering when scrolled out of view
    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) isVisible = entry.isIntersecting;
        },
        { threshold: 0.01 }
      );
      observer.observe(canvasContainer);
    }

    // Scroll-linked rotation scrub
    let scrollRotation = 0;
    const st = ScrollTrigger.create({
      trigger: canvasContainer,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollRotation = self.progress * Math.PI * 2.5;
      },
    });

    let animFrame: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animFrame = requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Continuous orbital rotation + scroll-linked spin
      orbitGroup.rotation.y = time * 0.08 + scrollRotation;

      // Apply dynamic vertex wave displacement math (TRIONN signature fluttering)
      cardMeshes.forEach((mesh, cardIdx) => {
        const geom = mesh.geometry as THREE.PlaneGeometry;
        const pos = geom.attributes.position;
        const { restX, restY } = mesh.userData;

        for (let j = 0; j < pos.count; j++) {
          const rx = restX[j];
          const ry = restY[j];
          const ny = 1.0 - (ry / 1.6 + 0.5);

          // Sine wave fluttering
          const zWave = 0.08 * Math.sin(ny * Math.PI * 1.5 - time * 2.5 + cardIdx) * (1 - Math.abs(rx / 1.3));
          pos.setXYZ(j, rx, ry, zWave);
        }
        pos.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    renderLoop();

    const handleResize = () => {
      if (!canvasContainer) return;
      const newW = canvasContainer.clientWidth;
      const newH = canvasContainer.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      st.kill();
      observer?.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      cardGeometries.forEach((g) => g.dispose());
      cardMaterials.forEach((m) => {
        if ("map" in m && (m as THREE.MeshBasicMaterial).map) {
          (m as THREE.MeshBasicMaterial).map?.dispose();
        }
        m.dispose();
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 py-24 lg:py-36 bg-[#040508] text-white overflow-hidden border-t border-white/5"
    >
      <div className="tr__container relative z-20 flex flex-col items-center">
        {/* Opposing Horizontal Scrub Typography */}
        <div className="w-full flex flex-col items-center select-none pointer-events-none mb-4">
          <h2 className="orbit-top-word font-sans font-bold text-5xl sm:text-7xl md:text-9xl tracking-tighter text-[#d8d8d8]/15 uppercase self-start whitespace-nowrap">
            Code in
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 my-4 text-center">
            ✦ Exploring ideas through daily technical practice.
          </span>
          <h2 className="orbit-bottom-word font-serif italic font-normal text-6xl sm:text-8xl md:text-[11rem] tracking-tight text-[#d8d8d8]/20 uppercase self-end whitespace-nowrap">
            motion
          </h2>
        </div>
      </div>

      {/* 3D Helical Orbit Canvas */}
      <div
        ref={canvasRef}
        onMouseEnter={playHover}
        className="relative w-full h-[500px] sm:h-[620px] md:h-[720px] -mt-16 sm:-mt-24 pointer-events-auto cursor-grab active:cursor-grabbing"
      />
    </section>
  );
}
