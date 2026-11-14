"use client";

import React, { useEffect, useRef } from "react";

export function FooterSmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const gl = canvas.getContext("webgl", { powerPreference: "low-power", alpha: true });
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // TRIONN exact fBM smoke/fog fragment shader
    const fsSource = `
      precision highp float;
      uniform float T;
      uniform float M;
      uniform float H;
      uniform vec2  R;

      float hash(vec2 p){
        if (R.x < 768.0) {
          p = fract(p * vec2(0.3183099, 0.3678794));
          return fract(sin(p.x * 12.9898 + p.y * 78.233) * 43.75854);
        } else {
          p = fract(p * vec2(127.34, 311.7));
          p += dot(p, p + 19.19);
          return fract(p.x * p.y);
        }
      }
      float vnoise(vec2 p){
        vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
        if (R.x < 768.0) {
          i = mod(i, 100.0);
        }
        return mix(
          mix(hash(i),           hash(i+vec2(1,0)), u.x),
          mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
      }
      float fbm(vec2 p){
        float v=0., a=.5;
        for(int i=0;i<3;i++){
          v += a * vnoise(p);
          p  = p * 2.1 + vec2(3.7, 8.3);
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = gl_FragCoord.xy / R;
        float y = uv.y;
        float aspect = R.x / R.y;

        float vMask = 1.0 - smoothstep(0.0, 1.0, y);
        vMask = pow(vMask, 0.22);
        vMask *= 1.0 - smoothstep(0.95, 1.0, y);
        if(vMask < 0.002){ gl_FragColor = vec4(0.); return; }

        float rise  = T * 0.07;
        float LOOP  = 32.0;
        float mA    = mod(M, LOOP);
        float mB    = mod(M + LOOP * 0.5, LOOP);
        float blend = abs(mod(M, LOOP) / LOOP - 0.5) * 2.0;

        vec2 q, q2;
        if (R.x < 768.0) {
          float qY = (R.y - gl_FragCoord.y) / 88.88;
          q   = vec2(gl_FragCoord.x / 133.33, qY + rise);
          q2  = vec2(gl_FragCoord.x / 153.84, qY * 0.8444 + rise * 0.6);
        } else {
          q   = vec2(uv.x * aspect * 3.0, (1.0 - y) * 4.5 + rise);
          q2  = vec2(uv.x * aspect * 2.6, (1.0 - y) * 3.8 + rise * 0.6);
        }

        vec2 w1a = vec2(fbm(q2 + vec2(0.0, mA*0.15)), fbm(q2 + vec2(4.3, 2.7+mA*0.10)));
        float fA = fbm(q + 1.4*w1a + vec2(0.0, mA*0.06));

        vec2 w1b = vec2(fbm(q2 + vec2(7.3, mB*0.15)), fbm(q2 + vec2(1.8, 5.4+mB*0.10)));
        float fB = fbm(q + 1.4*w1b + vec2(3.7, mB*0.06));

        float f = mix(fA, fB, blend);
        f = max(0.0, f - 0.36);
        f = smoothstep(0.0, 0.36, f);
        f = pow(f, 0.85);

        float hoverGlow = H * 0.42;
        f = clamp(f + H * 0.14, 0.0, 1.0);

        float baseFog = smoothstep(0.35, 0.0, y) * 0.14 + smoothstep(0.18, 0.0, y) * 0.11;
        float alpha = (f + baseFog + hoverGlow * vMask) * vMask * 0.94;
        alpha = clamp(alpha, 0.0, 0.82);

        vec3 charcoal = vec3(0.02, 0.03, 0.05);
        vec3 ashGrey  = vec3(0.12, 0.14, 0.18);
        vec3 lightGrey= vec3(0.28, 0.31, 0.36);
        vec3 hoverTint = vec3(0.35, 0.38, 0.44);

        vec3 col = mix(charcoal, ashGrey,   pow(f, 1.0));
             col = mix(col,      lightGrey, pow(f, 2.2));
             col = mix(col,      hoverTint, H * 0.55 * f);

        gl_FragColor = vec4(col * alpha, alpha);
      }
    `;

    function createShader(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const locT = gl.getUniformLocation(program, "T");
    const locM = gl.getUniformLocation(program, "M");
    const locH = gl.getUniformLocation(program, "H");
    const locR = gl.getUniformLocation(program, "R");

    let hoverVal = 0.0;
    let targetHover = 0.0;

    const onMouseEnter = () => {
      targetHover = 1.0;
    };
    const onMouseLeave = () => {
      targetHover = 0.0;
    };

    canvas.parentElement?.addEventListener("mouseenter", onMouseEnter);
    canvas.parentElement?.addEventListener("mouseleave", onMouseLeave);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let startTime = performance.now();
    let animId: number;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * Math.min(window.devicePixelRatio, 1.5);
      canvas.height = rect.height * Math.min(window.devicePixelRatio, 1.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(locR, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const elapsed = (time - startTime) * 0.001;
      hoverVal += (targetHover - hoverVal) * 0.08;

      gl.uniform1f(locT, elapsed);
      gl.uniform1f(locM, elapsed * 1.5);
      gl.uniform1f(locH, hoverVal);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      canvas.parentElement?.removeEventListener("mouseenter", onMouseEnter);
      canvas.parentElement?.removeEventListener("mouseleave", onMouseLeave);
      gl.deleteBuffer(posBuffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      style={{ filter: "contrast(115%)" }}
    />
  );
}

