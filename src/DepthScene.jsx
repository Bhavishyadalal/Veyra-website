import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

function dropletSprite() {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 96;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const body = ctx.createRadialGradient(32, 27, 3, 48, 48, 39);
  body.addColorStop(0, "rgba(255,248,225,.5)");
  body.addColorStop(0.15, "rgba(222,231,236,.1)");
  body.addColorStop(0.6, "rgba(12,17,21,.06)");
  body.addColorStop(0.88, "rgba(178,191,198,.25)");
  body.addColorStop(1, "rgba(255,242,209,.68)");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(48, 48, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(249,242,221,.62)";
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(35, 28, 9, 4, -0.65, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,253,241,.8)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(61, 70, 8, 0.15, 1.6);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(234,218,186,.6)";
  ctx.stroke();
  return sprite;
}

export default function DepthScene({ reduced, scrollY }) {
  const root = useRef(null),
    canvas = useRef(null),
    pointer = useRef({ x: 0, y: 0 });
  const targetX = useMotionValue(0),
    targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 65, damping: 23 }),
    y = useSpring(targetY, { stiffness: 65, damping: 23 });
  const rotateX = useTransform(y, [-15, 15], [1.2, -1.2]),
    rotateY = useTransform(x, [-22, 22], [-1.5, 1.5]);
  useEffect(() => {
    const host = root.current?.closest(".hero");
    if (!host) return;
    const move = (e) => {
      if (reduced || e.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5,
        py = (e.clientY - rect.top) / rect.height - 0.5;
      pointer.current.x = px;
      pointer.current.y = py;
      targetX.set(px * 36);
      targetY.set(py * 24);
    };
    const leave = () => {
      pointer.current.x = pointer.current.y = 0;
      targetX.set(0);
      targetY.set(0);
    };
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    if (reduced) leave();
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [reduced, targetX, targetY]);
  useEffect(() => {
    const node = canvas.current,
      host = root.current;
    if (!node || !host) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;
    const sprite = dropletSprite();
    let width = 1,
      height = 1,
      ratio = 1,
      raf = 0,
      last = 0,
      time = 0,
      visible = false;
    let seed = 7301;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const particles = Array.from({ length: 42 }, (_, i) => ({
      x: 0.36 + random() * 0.66,
      y: 0.05 + random() * 0.88,
      size: i < 11 ? 4 + random() * 10 : 1 + random() * 1.8,
      phase: random() * Math.PI * 2,
      depth: 0.2 + random() * 0.8,
      drift: 8 + random() * 18,
      glass: i < 11,
    }));
    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i],
          r = p.size * (width < 600 ? 0.65 : 1),
          px =
            p.x * width +
            Math.sin(time * 0.18 + p.phase) * p.drift +
            pointer.current.x * p.depth * 27,
          py =
            p.y * height +
            Math.cos(time * 0.13 + p.phase) * p.drift +
            pointer.current.y * p.depth * 18;
        ctx.globalAlpha = p.glass
          ? 0.35 + p.depth * 0.35
          : 0.18 + p.depth * 0.28;
        if (p.glass) ctx.drawImage(sprite, px - r, py - r, r * 2, r * 2);
        else {
          ctx.fillStyle = "#f1e8d0";
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function tick(now) {
      raf = 0;
      if (reduced || !visible || document.hidden) return;
      if (!last || now - last >= 33) {
        time += last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        draw();
      }
      raf = requestAnimationFrame(tick);
    }
    function wake() {
      if (!raf && !reduced && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    }
    function size() {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      node.width = Math.round(width * ratio);
      node.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
      wake();
    }
    const resize = new ResizeObserver(size);
    resize.observe(host);
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    });
    observer.observe(host);
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      } else wake();
    };
    document.addEventListener("visibilitychange", visibility);
    size();
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);
  return (
    <div
      ref={root}
      className="hero-visual"
      aria-hidden="true"
      data-depth={reduced ? "still" : "live"}
    >
      <motion.div
        className="depth-camera"
        style={reduced ? {} : { x, y, rotateX, rotateY }}
      >
        <motion.img
          className="hero-sculpture"
          src="/images/glass-gateway.webp"
          width="1672"
          height="941"
          alt=""
          style={{ y: reduced ? 0 : scrollY }}
          fetchPriority="high"
        />
        <div className="depth-halo" />
        <div className="optical-ring ring-one" />
        <div className="optical-ring ring-two" />
      </motion.div>
      <canvas ref={canvas} className="glass-particles" />
      <div className="glass-lens lens-one" />
      <div className="glass-lens lens-two" />
      <div className="depth-vignette" />
    </div>
  );
}
