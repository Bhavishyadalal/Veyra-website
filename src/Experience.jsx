import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  useMotionValueEvent,
  useMotionValue,
  useMotionTemplate,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Disc3,
  Headphones,
  Sparkles,
  Crosshair,
  LockKeyhole,
  UnlockKeyhole,
} from "lucide-react";
const SplitText = lazy(() => import("./components/SplitText.tsx"));
import GlassSurface from "./components/GlassSurface";
import GlareHover from "./components/GlareHover";
import DecryptedText from "./components/DecryptedText";

const sceneCopy = [
  {
    label: "01 / THE QUIET BETWEEN",
    title: "After the world falls asleep.",
    description: "A horizon with no end. A song with somewhere to take you.",
    image: "/images/glass-horizon.webp",
    position: "65% center",
    stamp: "NOCTURNE / 00:01",
  },
  {
    label: "02 / SOMETHING UNEXPECTED",
    title: "Let a new world bloom.",
    description:
      "For the little discoveries that change the shape of your day.",
    image: "/images/glass-orchid.webp",
    position: "center",
    stamp: "BLOOM / 00:02",
  },
  {
    label: "03 / OUTSIDE THE ORDINARY",
    title: "Somewhere you haven’t been.",
    description: "Go a little further. There is always another frequency.",
    image: "/images/glass-monolith.webp",
    position: "center",
    stamp: "ORBIT / 00:03",
  },
];

export function FrequencyReel({ reduced, moods, onSelect }) {
  const reelRef = useRef(null);
  const near = useInView(reelRef, { once: true, margin: "400px" });
  const [selected, setSelected] = useState(0);
  const change = (delta) => setSelected((value) => (value + delta + 3) % 3);
  const scene = sceneCopy[selected];
  return (
    <section
      className="frequency-reel section-shell"
      ref={reelRef}
      id="reel"
      aria-label="Explore the visual listening reel"
    >
      <div className="reel-intro">
        <div className="reel-pretitle">
          <span className="eyebrow">THE LISTENING ROOM / THREE DOORS</span>
          <span className="micro-label">DRAG · EXPLORE · FEEL</span>
        </div>
        <h2 className="reel-headline">
          {!reduced && near ? (
            <Suspense
              fallback={<span className="reel-split-line">There is more</span>}
            >
              <SplitText
                text="There is more"
                tag="span"
                textAlign="left"
                effect="blur"
                splitType="words"
                delay={100}
                duration={0.9}
                rootMargin="0px"
                hoverEffect="wave"
                accentColor="#d8c5a8"
                className="reel-split-line"
              />
            </Suspense>
          ) : (
            <span className="reel-split-line">There is more</span>
          )}
          <span className="reel-serif">to hear.</span>
        </h2>
        <p className="reel-lede">
          Don’t pick a genre.
          <br />
          Pick a place to disappear into.
        </p>
        <div
          className="reel-selected-copy"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="eyebrow">{scene.label}</p>
          <h3>{scene.title}</h3>
          <p>{scene.description}</p>
        </div>
        <div className="reel-actions">
          <button className="glass-action" onClick={() => onSelect(selected)}>
            Explore this mood <ArrowUpRight size={18} />
          </button>
          <span>VISUAL WORLDS. REAL POSSIBILITIES.</span>
        </div>
      </div>
      <div
        className="reel-stage"
        role="group"
        aria-label="Reel controls"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            change(1);
          } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            change(-1);
          }
        }}
      >
        <div className="reel-orbit" aria-hidden="true" />
        <div className="reel-axis" aria-hidden="true" />
        <motion.div
          className="reel-cards"
          data-cursor={reduced ? undefined : "drag"}
          drag={reduced ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.16}
          onDragEnd={(_, info) => {
            if (info.offset.y < -35) change(1);
            else if (info.offset.y > 35) change(-1);
          }}
          aria-label="Drag vertically to change the scene"
        >
          {sceneCopy.map((item, i) => {
            const offset = ((i - selected + 4) % 3) - 1;
            return (
              <motion.button
                key={item.title}
                className={`reel-card ${i === selected ? "is-current" : ""}`}
                aria-label={`Show reel scene ${i + 1}`}
                aria-pressed={i === selected}
                tabIndex={i === selected ? 0 : -1}
                onClick={() => setSelected(i)}
                animate={{
                  y: offset * (reduced ? 20 : 90),
                  z: offset === 0 ? 30 : -160,
                  scale: 1 - Math.abs(offset) * 0.12,
                  rotateX: reduced ? 0 : offset * -13,
                  rotateZ: reduced ? 0 : offset * 3,
                  opacity: i === selected ? 1 : 0.3,
                }}
                transition={{ type: "spring", stiffness: 190, damping: 27 }}
                style={{ zIndex: 3 - Math.abs(offset) }}
              >
                <img
                  src={item.image}
                  alt=""
                  width="800"
                  height="1000"
                  loading="lazy"
                  draggable="false"
                  style={{ objectPosition: item.position }}
                />
                <span className="reel-card-grain" aria-hidden="true" />
                <span className="reel-card-top">
                  <span>VEYRA / IMAGINED WORLDS</span>
                  <Sparkles size={15} />
                </span>
                <span className="reel-card-bottom">
                  <span>{moods[i].name}</span>
                  <small>{item.stamp}</small>
                  <i>
                    <ArrowUpRight size={22} />
                  </i>
                </span>
              </motion.button>
            );
          })}
        </motion.div>
        <div className="reel-controller">
          <button
            className="icon-button"
            aria-label="Previous reel scene"
            onClick={() => change(-1)}
          >
            <ArrowUp size={18} />
          </button>
          <span className="reel-counter">
            0{selected + 1}
            <i>/ 03</i>
          </span>
          <button
            className="icon-button"
            aria-label="Next reel scene"
            onClick={() => change(1)}
          >
            <ArrowDown size={18} />
          </button>
        </div>
        <p className="reel-hint">SWIPE VERTICALLY OR USE THE ARROWS</p>
      </div>
    </section>
  );
}

export function GlassDock() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("experience");
  const shown = useRef(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 500;
    if (next !== shown.current) {
      shown.current = next;
      setVisible(next);
    }
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    for (const id of ["experience", "reel", "inside", "download"]) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`glass-dock ${visible ? "is-visible" : ""}`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <GlassSurface
        width="auto"
        height={64}
        borderRadius={40}
        backgroundOpacity={0.13}
        blur={15}
        distortionScale={-90}
        redOffset={0}
        greenOffset={0}
        blueOffset={0}
        saturation={0.2}
        renderer="svg"
        className="dock-surface"
      >
        <nav aria-label="Experience shortcuts">
          <a className="dock-mark" href="#top" aria-label="Return to top">
            <img src="/brand/favicon.png" width="30" height="30" alt="" />
          </a>
          {[
            ["experience", "Discover"],
            ["reel", "The reel"],
            ["inside", "Preview"],
            ["download", "Get app"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : ""}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </GlassSurface>
    </div>
  );
}

export function ObsidianScene({ reduced, openPortal }) {
  const x = useMotionValue(50),
    y = useMotionValue(50);
  const light = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(224,210,185,.18), transparent 45%)`;
  function move(e) {
    if (reduced || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width) * 100);
    y.set(((e.clientY - rect.top) / rect.height) * 100);
  }
  return (
    <section
      className="obsidian-scene"
      onPointerMove={move}
      aria-labelledby="obsidian-title"
    >
      <img
        className="obsidian-image"
        src="/images/glass-monolith.webp"
        alt=""
        width="1254"
        height="1254"
        loading="lazy"
      />
      <motion.div
        className="obsidian-light"
        style={{ background: light }}
        aria-hidden="true"
      />
      <div className="obsidian-lines" aria-hidden="true" />
      <div className="obsidian-top">
        <span>TRANSMISSION / 073</span>
        <Crosshair size={18} />
        <span>UNKNOWN COORDINATES</span>
      </div>
      <div className="obsidian-copy">
        <p className="eyebrow">
          {reduced ? (
            "SOMETHING IS WAITING."
          ) : (
            <DecryptedText
              text="SOMETHING IS WAITING."
              animateOn="inViewHover"
              speed={35}
              maxIterations={4}
              sequential
              scrambleColor="#d8c5a8"
            />
          )}
        </p>
        <h2 id="obsidian-title">
          Between the noise.
          <br />
          <em>Beyond the expected.</em>
        </h2>
        <p>
          There’s a little more to this world
          <br />
          than meets the eye.
        </p>
        <GlareHover
          width="fit-content"
          height="auto"
          borderRadius="40px"
          glareOpacity={reduced ? 0 : 0.23}
          glareColor="#e2d4b9"
          transitionDuration={750}
          className="artifact-glare"
        >
          <button className="glass-action" onClick={openPortal}>
            <Disc3 size={18} /> Follow the transmission{" "}
            <ArrowUpRight size={17} />
          </button>
        </GlareHover>
      </div>
      <div className="obsidian-bottom">
        <span>A SHORT DETOUR FROM EVERYTHING.</span>
        <span>YOUR FREQUENCY IS OUT THERE.</span>
      </div>
    </section>
  );
}

export function ResonanceDial({ reduced }) {
  const [frequency, setFrequency] = useState(67);
  const unlocked = frequency === 73;
  const proximity = 1 - Math.min(Math.abs(frequency - 73) / 12, 1);
  return (
    <div className={`resonance ${unlocked ? "is-tuned" : ""}`}>
      <div className="resonance-label">
        <span>
          {unlocked ? <UnlockKeyhole size={12} /> : <LockKeyhole size={12} />}{" "}
          {unlocked ? "THE QUIET ARCHIVE" : "A SIGNAL WITHIN THE SIGNAL"}
        </span>
        <span>VISUAL ONLY</span>
      </div>
      <div className="resonance-readout">
        <span>
          {frequency.toFixed(1)}
          <small> MHz</small>
        </span>
        <div className="signal-bars" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <i
              key={i}
              style={{
                height: 7 + proximity * (12 + Math.sin(i) * 9),
                opacity: i / 7 < proximity ? 1 : 0.2,
              }}
            />
          ))}
        </div>
      </div>
      <label htmlFor="signal-frequency">
        Tune the hidden frequency to 73.0 MHz
      </label>
      <input
        id="signal-frequency"
        type="range"
        min="60"
        max="90"
        step="1"
        value={frequency}
        aria-valuetext={`${frequency.toFixed(1)} megahertz${unlocked ? ", signal found" : ""}`}
        onChange={(e) => setFrequency(Number(e.target.value))}
      />
      <div className="frequency-ticks" aria-hidden="true">
        <span>60</span>
        <span>70</span>
        <span>80</span>
        <span>90</span>
      </div>
      <div className="resonance-result" role="status" aria-live="polite">
        {unlocked
          ? "Signal found. The world can wait."
          : "Somewhere in the quiet, there is a place for you."}
      </div>
      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="archive-reveal"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <img
              src="/images/glass-orchid.webp"
              width="80"
              height="80"
              alt="A translucent crystal orchid with a warm glowing core"
            />
            <div>
              <span>YOU FOUND SOMETHING RARE.</span>
              <strong>A moment that belongs to you.</strong>
              <p>Keep a little wonder in your world.</p>
            </div>
            <Headphones size={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
