"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useSound } from "@/components/providers/SoundProvider";

export function Hero3DCanvas() {
  const host = useRef<HTMLDivElement>(null);
  const { playBlast, playSpark } = useSound();
  const sound = useRef({ playBlast, playSpark });
  useEffect(() => { sound.current = { playBlast, playSpark }; }, [playBlast, playSpark]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
    catch { container.classList.add("scene-fallback"); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .8;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .1, 100);
    camera.position.z = 12;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    const metal = new THREE.MeshStandardMaterial({ color: 0x11151b, metalness: 1, roughness: .24, envMapIntensity: 1.3 });
    const edge = new THREE.LineBasicMaterial({ color: 0x536373, transparent: true, opacity: .22 });
    const group = new THREE.Group();
    scene.add(group);
    // An original extruded TS monogram, built from polished, bevelled struts.
    const specs = [
      { p: [-.45, 1.55, 0], s: [3.25, .5, .6], r: 0 },
      { p: [-.6, -.1, 0], s: [.55, 3.1, .6], r: -.18 },
      { p: [1.02, .45, .35], s: [1.55, .5, .6], r: 0 },
      { p: [.45, -.15, .35], s: [.5, 1.45, .6], r: -.2 },
      { p: [1.03, -.8, .35], s: [1.65, .5, .6], r: 0 },
      { p: [1.65, -1.4, .35], s: [.5, 1.5, .6], r: -.2 },
      { p: [.95, -2.05, .35], s: [2.05, .5, .6], r: 0 },
    ];
    const pieces = specs.map((spec, i) => {
      const geo = new RoundedBoxGeometry(...spec.s as [number, number, number], 3, .045);
      const mesh = new THREE.Mesh(geo, metal);
      mesh.position.set(...spec.p as [number, number, number]);
      mesh.rotation.z = spec.r;
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 32), edge);
      mesh.add(edges); group.add(mesh);
      return { mesh, original: mesh.position.clone(), rotation: spec.r, target: new THREE.Vector3(Math.cos(i * 2.4) * 7, Math.sin(i * 2.4) * 5, (i % 3) * 2) };
    });
    const amber = new THREE.PointLight(0xff6828, 28, 18);
    amber.position.set(3, 2, 3); scene.add(amber);
    const cold = new THREE.DirectionalLight(0xacc5e1, 3);
    cold.position.set(-4, -2, 4); scene.add(cold);
    const particlesGeo = new THREE.BufferGeometry();
    const coords = new Float32Array(450);
    for (let i = 0; i < coords.length; i++) coords[i] = (Math.random() - .5) * 25;
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(coords, 3));
    const particlesMat = new THREE.PointsMaterial({ color: 0xc75b24, size: .013, transparent: true, opacity: .65 });
    const particles = new THREE.Points(particlesGeo, particlesMat); scene.add(particles);
    const threadMat = new THREE.LineBasicMaterial({ color: 0x31404e, transparent: true, opacity: .45 });
    const threads = Array.from({ length: 3 }, () => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(65 * 3), 3));
      const line = new THREE.Line(geo, threadMat); scene.add(line); return line;
    });
    let mx = 0, my = 0, px = 0, py = 0, charge = false, burst = 0, frame = 0, active = true, lastSpark = 0;
    let previous = performance.now(), time = 0;
    const onMove = (event: PointerEvent) => {
      mx = event.clientX / innerWidth * 2 - 1; my = 1 - event.clientY / innerHeight * 2;
      if (scrollY < innerHeight && Math.abs(my - mx * .65) < .06 && performance.now() - lastSpark > 220) { sound.current.playSpark(); lastSpark = performance.now(); }
    };
    const press = (event: PointerEvent) => { if (scrollY < innerHeight && !(event.target as HTMLElement).closest("a,button,input,[role=dialog]")) charge = true; };
    const chargeEvent = () => { charge = true; };
    const release = () => { if (charge) { charge = false; burst = 1; sound.current.playBlast(); } };
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); };
    const visibility = () => { active = !document.hidden; charge = false; };
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const dt = Math.min((now - previous) / 1000, .05); previous = now;
      const end = document.getElementById("facts")?.offsetTop || innerHeight * 3;
      const visible = scrollY < end && active;
      container.style.visibility = visible ? "visible" : "hidden";
      if (!visible) return;
      if (!reduced) time += dt;
      const scroll = Math.min(scrollY / innerHeight, 3);
      px += (mx - px) * .045; py += (my - py) * .045;
      burst *= Math.pow(.965, dt * 60);
      const explosion = reduced ? 0 : Math.sin(Math.min(scroll, 2) * Math.PI / 2) * .75 + burst * 1.25;
      group.position.set(innerWidth < 700 ? 0 : .2, innerWidth < 700 ? -.55 : -.15, 0);
      group.scale.setScalar(innerWidth < 700 ? .65 : 1.07);
      group.rotation.set(reduced ? -.1 : py * .13 + Math.sin(time * .3) * .08, reduced ? -.4 : time * .17 + px * .22 + scroll * .55, -.08);
      pieces.forEach(({ mesh, original, target, rotation }, i) => {
        mesh.position.lerpVectors(original, target, explosion);
        mesh.rotation.x = explosion * (i % 2 ? .8 : -.8);
        mesh.rotation.z = rotation + explosion * (i - 3) * .25;
        if (charge && !reduced) mesh.position.x += Math.sin(time * 65 + i) * .025;
      });
      amber.intensity = charge ? 65 : 28 + Math.sin(time) * 7;
      particles.rotation.y = time * .012;
      threads.forEach((line, index) => {
        const arr = line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j <= 64; j++) {
          const t = j / 64, x = (t - .5) * 24;
          const envelope = Math.sin(t * Math.PI);
          arr[j * 3] = x;
          arr[j * 3 + 1] = x * (.28 + index * .22) + Math.sin(t * Math.PI * 2 + index) * .7 + (reduced ? 0 : py * envelope * .5 + Math.sin(t * 22 + time * 5) * burst * envelope);
          arr[j * 3 + 2] = -1;
        }
        line.geometry.attributes.position.needsUpdate = true;
        line.visible = scroll < .9;
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", press); window.addEventListener("pointerup", release); window.addEventListener("pointercancel", release);
    window.addEventListener("techspace-charge", chargeEvent); window.addEventListener("techspace-release", release);
    window.addEventListener("blur", release); window.addEventListener("resize", resize); document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", press); window.removeEventListener("pointerup", release); window.removeEventListener("pointercancel", release);
      window.removeEventListener("techspace-charge", chargeEvent); window.removeEventListener("techspace-release", release); window.removeEventListener("blur", release); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", visibility);
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) object.geometry.dispose(); });
      metal.dispose(); edge.dispose(); threadMat.dispose(); particlesMat.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="reference-scene" aria-hidden="true" />;
}
