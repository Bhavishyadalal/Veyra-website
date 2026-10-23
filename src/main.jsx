import "./cursor.js";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  lazy,
  Suspense,
} from "react";
import { createRoot } from "react-dom/client";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  MotionConfigContext,
  useScroll,
  useTransform,
  useInView,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  CodeXml as Github,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Headphones,
  ListMusic,
  Music2,
  Home,
  Search,
  LayoutGrid,
  Library,
  Download,
  Copy,
  Folder,
  Plus,
  Users,
  X,
  Menu,
  Sparkles,
  Disc3,
  Check,
  ChevronRight,
  History,
} from "lucide-react";
import SpecularButton from "./components/SpecularButton";
import ScrollStack, { ScrollStackItem } from "./components/ScrollStack";
import { siteConfig } from "./config";
import {
  FrequencyReel,
  ObsidianScene,
  GlassDock,
  ResonanceDial,
} from "./Experience";
import DecryptedText from "./components/DecryptedText";
import ShinyText from "./components/ShinyText";
import "./styles/base.css";
import "./styles/atmosphere.css";
import "./styles/refraction.css";
import DepthScene from "./DepthScene";
/** Decorative, locally rendered Google Drive mark; no external icon request. */
function GoogleDriveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#0F9D58" d="M8 2 1 14l4 7 7-12Z" />
      <path fill="#FBBC04" d="M8 2h8l7 12h-8Z" />
      <path fill="#4285F4" d="M9 14h14l-4 7H5Z" />
    </svg>
  );
}

const FluxLines = lazy(() => import("./components/FluxLines"));
const curve = [0.22, 1, 0.36, 1];
const moods = [
  {
    name: "After hours",
    title: "Nocturne",
    artist: "Veyra Studio",
    color: "#d8c5a8",
    art: "/images/glass-horizon.webp",
    line: "Somewhere beyond the noise.",
  },
  {
    name: "Daydream",
    title: "Bloom",
    artist: "Veyra Studio",
    color: "#ddd4bf",
    art: "/images/glass-orchid.webp",
    line: "Let the ordinary fade away.",
  },
  {
    name: "Deep space",
    title: "Orbit",
    artist: "Veyra Studio",
    color: "#c1cbd0",
    art: "/images/glass-monolith.webp",
    line: "A little closer to infinity.",
  },
];
const safeRead = (key, store = "localStorage") => {
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
};
const safeWrite = (key, value, store = "localStorage") => {
  try {
    window[store].setItem(key, value);
  } catch {}
};
function Logo({ large = false }) {
  return (
    <a
      className={`brand ${large ? "brand-large" : ""}`}
      href="#top"
      aria-label="Veyra home"
    >
      <img src="/brand/icon.png" width="56" height="56" alt="" />
      <span>Veyra</span>
    </a>
  );
}
function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useContext(MotionConfigContext).reducedMotion === "always";
  return (
    <motion.div
      className={`scroll-reveal ${className}`}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px 80px 0px" }}
      transition={{
        duration: reduced ? 0 : 0.45,
        delay: reduced ? 0 : delay,
        ease: curve,
      }}
    >
      {children}
    </motion.div>
  );
}
function useSystemReducedMotion() {
  const [value, setValue] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setValue(media.matches);
    media.addEventListener("change", change);
    change();
    return () => media.removeEventListener("change", change);
  }, []);
  return value;
}
function SignalField({ reduced }) {
  const ref = useRef(null);
  const visible = useInView(ref, { margin: "200px" });
  return (
    <div ref={ref} className="flux-background" aria-hidden="true">
      {!reduced && visible && (
        <Suspense fallback={null}>
          <FluxLines
            colors={["#a5967d", "#d5c9b3", "#e4e6e5"]}
            dpr={1}
            speed={0.25}
            scale={1.5}
            turbulence={0.7}
            glow={1.1}
            opacity={0.6}
            mouseStrength={0.5}
            intro={false}
          />
        </Suspense>
      )}
    </div>
  );
}
function App() {
  const systemReduced = useSystemReducedMotion();
  const [quiet, setQuiet] = useState(
    () => safeRead("veyra-site-motion") === "reduced",
  );
  const reduced = systemReduced || quiet;
  const [menu, setMenu] = useState(false);
  const [mood, setMood] = useState(0);
  const [intro, setIntro] = useState(
    () => !safeRead("veyra-v2-intro", "sessionStorage"),
  );
  const openingDelay = useRef(intro ? 1.65 : 0).current;
  const [portal, setPortal] = useState(false);
  const [tab, setTab] = useState("Player");
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [elapsed, setElapsed] = useState(17);
  const [toast, setToast] = useState("");
  const [manualShare, setManualShare] = useState(false);
  const shareInput = useRef(null);
  const menuButton = useRef(null);
  useEffect(() => {
    if (manualShare) {
      shareInput.current?.focus();
      shareInput.current?.select();
    }
  }, [manualShare]);
  async function copyWebsiteLink() {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(siteConfig.website);
      setManualShare(false);
      setToast("Website link copied.");
    } catch {
      setManualShare(true);
      shareInput.current?.focus();
      shareInput.current?.select();
    }
  }
  const { scrollYProgress } = useScroll();
  const artworkY = useTransform(scrollYProgress, [0, 0.2], [0, 170]);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    safeWrite("veyra-site-motion", quiet ? "reduced" : "full");
  }, [reduced, quiet]);
  useEffect(() => {
    if (reduced) {
      setIntro(false);
      safeWrite("veyra-v2-intro", "1", "sessionStorage");
      return;
    }
    const timer = setTimeout(() => {
      setIntro(false);
      safeWrite("veyra-v2-intro", "1", "sessionStorage");
    }, 1650);
    return () => clearTimeout(timer);
  }, [reduced]);
  useEffect(() => {
    if (!playing || document.hidden) return;
    const id = setInterval(
      () => setElapsed((t) => (t >= 201 ? 0 : t + 1)),
      1000,
    );
    const hide = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [playing]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!menu) return;
    const esc = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [menu]);
  function changeMood(i) {
    setMood(i);
    setElapsed(0);
  }
  function next() {
    changeMood((mood + 1) % moods.length);
  }
  const current = moods[mood];
  return (
    <MotionConfig
      reducedMotion={reduced ? "always" : "never"}
      transition={{ type: "spring", bounce: 0.12, visualDuration: 0.4 }}
    >
      <div className="universe" style={{ "--accent": current.color }}>
        <div className="continuity-field" aria-hidden="true">
          <img
            src="/images/continuity-mist.webp"
            alt=""
            decoding="async"
            loading="lazy"
          />
          <span className="ambient-bloom bloom-one" />
          <span className="ambient-bloom bloom-two" />
        </div>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <motion.div
          className="reading-progress"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
        <AnimatePresence>
          {intro && !reduced && (
            <motion.div
              className="opening"
              aria-hidden="true"
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.75, ease: curve }}
            >
              <div className="opening-label">TRANSMISSION 073 / CONNECTING</div>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                Veyra
              </motion.span>
              <div className="opening-meter">
                <motion.i
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.1 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <header className="site-header">
          <Logo />
          <nav
            className={menu ? "nav is-open" : "nav"}
            aria-label="Main navigation"
          >
            <a href="#experience" onClick={() => setMenu(false)}>
              The experience
            </a>
            <a href="#inside" onClick={() => setMenu(false)}>
              Inside Veyra
            </a>
            <a href={siteConfig.repository} target="_blank" rel="noreferrer">
              Open source <ArrowUpRight size={14} />
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="motion-toggle"
              aria-pressed={quiet}
              onClick={() => setQuiet((q) => !q)}
              title="Reduce decorative motion"
            >
              <span className="motion-dot" />
              Motion {reduced ? "off" : "on"}
            </button>
            <a className="nav-download" href="#download">
              Get Veyra <ArrowUpRight size={16} />
            </a>
            <button
              ref={menuButton}
              className="menu-button icon-button"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={menu ? "Close menu" : "Open menu"}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <GlassDock />
        <main id="main">
          <section className="hero" id="top">
            <DepthScene reduced={reduced} scrollY={artworkY} />
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-topline">
              <span>
                <i /> AN INDEPENDENT MUSIC EXPERIENCE
              </span>
              <span>ANDROID / STABLE SOURCE {siteConfig.appVersion}</span>
            </div>
            <div className="hero-copy">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : openingDelay + 0.15 }}
              >
                {reduced ? (
                  "TUNE OUT THE ORDINARY."
                ) : (
                  <DecryptedText
                    text="TUNE OUT THE ORDINARY."
                    animateOn="view"
                    speed={40}
                    sequential
                    maxIterations={4}
                    scrambleColor="#d8c5a8"
                  />
                )}
              </motion.p>
              <h1 aria-label="Your music. Another dimension.">
                <span className="title-mask">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: reduced ? 0 : openingDelay + 0.2,
                      ease: curve,
                    }}
                  >
                    YOUR MUSIC.
                  </motion.span>
                </span>
                <span className="title-mask">
                  <motion.span
                    className="outline-title"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1,
                      delay: reduced ? 0 : openingDelay + 0.35,
                      ease: curve,
                    }}
                  >
                    ANOTHER
                  </motion.span>
                </span>
                <span className="title-mask">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1,
                      delay: reduced ? 0 : openingDelay + 0.5,
                      ease: curve,
                    }}
                  >
                    DIMENSION<span className="title-dot">.</span>
                  </motion.span>
                </span>
              </h1>
              <Reveal className="hero-bottom">
                <p>
                  A place for the songs that find you.
                  <br />
                  And the ones you never saw coming.
                </p>
                <div className="hero-ctas">
                  <SpecularButton
                    followMouse={!reduced}
                    radius={40}
                    className="primary-button"
                    lineColor={current.color}
                    onClick={() =>
                      document.querySelector("#experience")?.scrollIntoView({
                        behavior: reduced ? "instant" : "smooth",
                      })
                    }
                  >
                    Enter the experience <ArrowDown size={18} />
                  </SpecularButton>
                  <a className="plain-link" href="#download">
                    Get the Android app <ArrowUpRight size={17} />
                  </a>
                </div>
              </Reveal>
            </div>
            <button
              className="artifact-trigger"
              onClick={() => setPortal(true)}
              aria-label="Open the hidden frequency"
            >
              <Disc3 size={22} />
              <span>
                FOUND A FREQUENCY?<small>OPEN THE SIGNAL ↗</small>
              </span>
            </button>
            <div className="hero-footer">
              <span>BUILT FOR LISTENING. DESIGNED FOR FEELING.</span>
              <a href="#experience">
                SCROLL TO DISCOVER <ArrowDown size={15} />
              </a>
            </div>
          </section>
          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[0, 1].map((group) => (
                <div className="ticker-group" key={group}>
                  {[0, 1, 2, 3].map((copy) => (
                    <span key={copy}>
                      STAY CURIOUS <Sparkles /> GO DEEPER <Sparkles /> FEEL
                      EVERYTHING <Sparkles />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <section className="manifesto section-shell" id="experience">
            <Reveal>
              <p className="eyebrow">01 / BREAK THE LOOP</p>
              <h2>
                Not background music.
                <br />
                <span className="serif-word">Your whole world.</span>
              </h2>
            </Reveal>
            <Reveal className="manifesto-note">
              <span className="crosshair" aria-hidden="true">
                <Sparkles size={34} />
              </span>
              <p>
                The late-night discovery. The lyric that stays.
                <br />
                The playlist that feels like home.
                <br />
                <strong>Make room for all of it.</strong>
              </p>
            </Reveal>
          </section>
          <ScrollStack
            className={`story-stack ${reduced ? "static-stack" : ""}`}
            useWindowScroll
            smoothScroll={false}
            stackPosition="12%"
            itemDistance={95}
            itemStackDistance={20}
            itemScale={reduced ? 0 : 0.045}
            dimAmount={reduced ? 0 : 0.16}
            tiltAmount={0}
            holdDistance={60}
          >
            <ScrollStackItem itemClassName="chapter chapter-discover">
              <div className="chapter-meta">
                <span>01 — DISCOVER</span>
                <span>
                  FOLLOW THE FEELING <ArrowUpRight size={18} />
                </span>
              </div>
              <img
                className="chapter-art"
                src="/images/glass-horizon.webp"
                alt=""
                width="1672"
                height="941"
                loading="lazy"
              />
              <div className="chapter-text">
                <p className="eyebrow">THE NEXT SONG IS OUT THERE.</p>
                <h3>
                  Fall into
                  <br />
                  <em>something new.</em>
                </h3>
                <p>
                  Quick picks, familiar favorites, and a whole
                  <br className="desktop-break" /> new direction. Let curiosity
                  take the lead.
                </p>
                <a
                  href="#inside"
                  className="circle-link"
                  aria-label="Explore the Veyra preview"
                >
                  <ArrowUpRight />
                </a>
              </div>
              <div className="chapter-number" aria-hidden="true">
                01
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="chapter chapter-lyrics">
              <div className="chapter-meta">
                <span>02 — FEEL EVERY WORD</span>
                <span>
                  RIGHT HERE. RIGHT NOW. <Music2 size={18} />
                </span>
              </div>
              <div className="lyric-art" aria-hidden="true">
                <span>Stay a little</span>
                <span className="lit">closer to the music.</span>
                <span>Let everything</span>
                <span>else disappear.</span>
              </div>
              <div className="chapter-text">
                <p className="eyebrow">MORE THAN A MELODY.</p>
                <h3>
                  Some words
                  <br />
                  <em>hit different.</em>
                </h3>
                <p>
                  A focused player. Lyrics in the moment.
                  <br />
                  An experience that follows the music.
                </p>
                <button
                  className="circle-link"
                  aria-label="Preview the lyrics screen"
                  onClick={() => {
                    setTab("Lyrics");
                    document.querySelector("#inside")?.scrollIntoView({
                      behavior: reduced ? "instant" : "smooth",
                    });
                  }}
                >
                  <ArrowUpRight />
                </button>
              </div>
              <div className="chapter-number" aria-hidden="true">
                02
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="chapter chapter-library">
              <div className="chapter-meta">
                <span>03 — MAKE IT YOURS</span>
                <span>
                  YOUR WORLD, ON REPEAT <Heart size={18} />
                </span>
              </div>
              <div className="record-art" aria-hidden="true">
                <div className="record-grooves">
                  <div className="record-label">
                    <span>Veyra</span>
                    <small>SIDE A / YOUR WORLD</small>
                    <i />
                  </div>
                </div>
              </div>
              <div className="chapter-text">
                <p className="eyebrow">KEEP THE GOOD ONES CLOSE.</p>
                <h3>
                  Your music.
                  <br />
                  <em>Your universe.</em>
                </h3>
                <p>
                  Local music, downloads, playlists.
                  <br />A collection with your fingerprints all over it.
                </p>
                <a
                  className="circle-link"
                  href="#inside"
                  aria-label="See inside Veyra"
                >
                  <ArrowUpRight />
                </a>
              </div>
              <div className="chapter-number" aria-hidden="true">
                03
              </div>
            </ScrollStackItem>
          </ScrollStack>
          <FrequencyReel
            reduced={reduced}
            moods={moods}
            onSelect={(i) => {
              changeMood(i);
              setTab("Player");
              document
                .querySelector("#inside")
                ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
            }}
          />
          <section className="lab section-shell" id="inside">
            <div className="lab-copy">
              <Reveal>
                <p className="eyebrow">02 / GO HANDS ON</p>
                <h2>
                  A little less
                  <br />
                  ordinary.
                  <br />
                  <em>A lot more you.</em>
                </h2>
                <p className="section-description">
                  Step inside the feeling. Change the mood,
                  <br className="desktop-break" /> switch screens, and make
                  yourself at home.
                </p>
              </Reveal>
              <div className="mood-picker">
                <p className="micro-label">CHOOSE YOUR FREQUENCY</p>
                {moods.map((m, i) => (
                  <button
                    className={
                      i === mood ? "mood-option selected" : "mood-option"
                    }
                    key={m.name}
                    onClick={() => changeMood(i)}
                    aria-pressed={i === mood}
                  >
                    <span
                      className="mood-swatch"
                      style={{ background: m.color }}
                    />
                    <span>{m.name}</span>
                    <span className="mood-index">0{i + 1}</span>
                    {i === mood && <Check size={16} />}
                  </button>
                ))}
              </div>
              <p className="demo-note">
                Interactive visual preview inspired by Veyra.
                <br />
                Original demo artwork and text. No audio playback.
              </p>
            </div>
            <div className="phone-stage">
              <div className="phone-orbit" aria-hidden="true" />
              <motion.div
                className="floating-chip chip-top"
                animate={reduced ? {} : { y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Headphones size={18} />
                <span>Find your frequency.</span>
              </motion.div>
              <div className="phone">
                <div className="phone-camera" />
                <div className="phone-status">
                  <span>9:41</span>
                  <span>● ııı ▰</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    id="preview-panel"
                    role="tabpanel"
                    aria-labelledby={`tab-${tab}`}
                    className="phone-screen"
                    initial={{ opacity: 0, x: reduced ? 0 : 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: reduced ? 0 : -18 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab === "Home" && (
                      <>
                        <div className="app-brand">
                          <img
                            src="/brand/favicon.png"
                            width="38"
                            height="38"
                            alt=""
                          />
                          <span>Veyra</span>
                        </div>
                        <h3>Listen Now</h3>
                        <p className="phone-muted">Find your next favorite.</p>
                        <div className="app-divider" />
                        <div className="app-section-title">
                          <h4>Quick picks</h4>
                          <LayoutGrid size={17} />
                        </div>
                        <button
                          className="quick-pick"
                          onClick={() => {
                            setTab("Player");
                            setPlaying(true);
                          }}
                          aria-label={`Preview ${current.title}`}
                        >
                          <img
                            src={current.art}
                            width="280"
                            height="220"
                            alt=""
                          />
                          <span className="quick-content">
                            <span className="mini-play">
                              <Play size={16} fill="currentColor" />
                            </span>
                            <strong>{current.title}</strong>
                            <small>{current.artist}</small>
                          </span>
                        </button>
                        <p className="phone-muted small">
                          0{mood + 1} / 03{" "}
                          <span className="float-right">← &nbsp; →</span>
                        </p>
                        <h4>Made for the moment</h4>
                        <div className="mini-albums">
                          {moods
                            .filter((_, i) => i !== mood)
                            .map((m) => (
                              <div key={m.title}>
                                <img
                                  src={m.art}
                                  alt=""
                                  width="120"
                                  height="120"
                                />
                                <span>{m.title}</span>
                              </div>
                            ))}
                        </div>
                        <div className="app-bottom">
                          <Home fill="currentColor" />
                          <Search />
                          <LayoutGrid />
                          <Library />
                        </div>
                      </>
                    )}
                    {(tab === "Player" || tab === "Lyrics") && (
                      <>
                        <div className="player-top">
                          <span className="drag-handle" />
                          <p>
                            {tab === "Lyrics"
                              ? "IN THE WORDS"
                              : "PLAYING FROM YOUR WORLD"}
                          </p>
                        </div>
                        {tab === "Player" ? (
                          <div className="cover-wrap">
                            <motion.img
                              key={mood}
                              src={current.art}
                              alt={`${current.title} original demo artwork`}
                              width="280"
                              height="280"
                              initial={{ scale: 0.93, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.4 }}
                            />
                            <span className="cover-corner">
                              V / {String(mood + 1).padStart(2, "0")}
                            </span>
                          </div>
                        ) : (
                          <div className="demo-lyrics">
                            <span>Take a breath.</span>
                            <strong>{current.line}</strong>
                            <span>Stay in this moment.</span>
                            <span>The world can wait.</span>
                          </div>
                        )}
                        <div className="track-heading">
                          <div>
                            <h3>{current.title}</h3>
                            <p>{current.artist}</p>
                          </div>
                          <button
                            className={`icon-button like-button ${liked ? "liked" : ""}`}
                            aria-label={
                              liked ? "Unlike demo track" : "Like demo track"
                            }
                            aria-pressed={liked}
                            onClick={() => setLiked(!liked)}
                          >
                            <Heart
                              size={20}
                              fill={liked ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                        <button
                          className="lyric-link"
                          onClick={() =>
                            setTab(tab === "Lyrics" ? "Player" : "Lyrics")
                          }
                        >
                          <Music2 size={15} />
                          {tab === "Lyrics"
                            ? "Back to the artwork"
                            : "Cue the words"}
                          <ChevronRight size={15} />
                        </button>
                        <div className="seek">
                          <label className="sr-only" htmlFor="demo-position">
                            Demo track position
                          </label>
                          <input
                            id="demo-position"
                            type="range"
                            min="0"
                            max="201"
                            value={elapsed}
                            onChange={(e) => setElapsed(Number(e.target.value))}
                            style={{
                              "--progress": `${(elapsed / 201) * 100}%`,
                            }}
                          />
                          <div>
                            <span>
                              {Math.floor(elapsed / 60)}:
                              {String(elapsed % 60).padStart(2, "0")}
                            </span>
                            <span>
                              <Headphones size={11} /> VISUAL DEMO
                            </span>
                            <span>3:21</span>
                          </div>
                        </div>
                        <div className="player-controls">
                          <button
                            className="icon-button"
                            aria-label="Previous demo track"
                            onClick={() => changeMood((mood + 2) % 3)}
                          >
                            <SkipBack size={26} fill="currentColor" />
                          </button>
                          <button
                            className="play-button"
                            aria-label={
                              playing ? "Pause visual demo" : "Play visual demo"
                            }
                            onClick={() => setPlaying(!playing)}
                          >
                            {playing ? (
                              <Pause size={42} fill="currentColor" />
                            ) : (
                              <Play size={42} fill="currentColor" />
                            )}
                          </button>
                          <button
                            className="icon-button"
                            aria-label="Next demo track"
                            onClick={next}
                          >
                            <SkipForward size={26} fill="currentColor" />
                          </button>
                        </div>
                        <div className="phone-tools">
                          <button
                            className="icon-button"
                            aria-label="Show demo lyrics"
                            onClick={() => setTab("Lyrics")}
                          >
                            <Music2 size={20} />
                          </button>
                          <span>
                            <Headphones size={20} />
                            <Users size={20} />
                          </span>
                          <button
                            className="icon-button"
                            aria-label="Show demo library"
                            onClick={() => setTab("Library")}
                          >
                            <ListMusic size={21} />
                          </button>
                        </div>
                        <p className="device-label">This moment is yours</p>
                      </>
                    )}
                    {tab === "Library" && (
                      <>
                        <div className="library-heading">
                          <h3>Library</h3>
                          <History size={20} />
                        </div>
                        <div className="listening-card">
                          <span>YOUR LISTENING EXPERIENCE</span>
                          <strong>∞</strong>
                          <span>MORE TO DISCOVER</span>
                          <b>VEYRA LISTENER</b>
                          <small>Your world, on repeat.</small>
                        </div>
                        <div className="library-row">
                          <Download size={20} />
                          <span>Downloads</span>
                          <ChevronRight size={16} />
                        </div>
                        <div className="library-row">
                          <Folder size={20} />
                          <span>Local Music</span>
                          <ChevronRight size={16} />
                        </div>
                        <h4 className="playlist-title">Playlists</h4>
                        <div className="mini-albums">
                          <div>
                            <button
                              className="playlist-create"
                              onClick={() =>
                                setToast(
                                  "Your next playlist starts in the Veyra Android app.",
                                )
                              }
                              aria-label="About creating a playlist"
                            >
                              <Plus size={35} />
                            </button>
                            <span>New playlist</span>
                            <small>Make it yours.</small>
                          </div>
                          <div>
                            <img
                              src={current.art}
                              alt=""
                              width="120"
                              height="120"
                            />
                            <span>After hours</span>
                            <small>Your quiet corner.</small>
                          </div>
                        </div>
                        <div className="app-bottom">
                          <Home />
                          <Search />
                          <LayoutGrid />
                          <Library fill="currentColor" />
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="phone-home-bar" />
              </div>
              <div
                className="screen-tabs"
                role="tablist"
                aria-label="Preview screen"
              >
                {["Home", "Player", "Lyrics", "Library"].map((name, i) => (
                  <button
                    key={name}
                    id={`tab-${name}`}
                    role="tab"
                    aria-selected={tab === name}
                    aria-controls="preview-panel"
                    tabIndex={tab === name ? 0 : -1}
                    onClick={() => setTab(name)}
                    onKeyDown={(e) => {
                      const names = ["Home", "Player", "Lyrics", "Library"];
                      const j =
                        e.key === "ArrowRight"
                          ? (i + 1) % 4
                          : e.key === "ArrowLeft"
                            ? (i + 3) % 4
                            : e.key === "Home"
                              ? 0
                              : e.key === "End"
                                ? 3
                                : null;
                      if (j !== null) {
                        e.preventDefault();
                        setTab(names[j]);
                        document.getElementById(`tab-${names[j]}`)?.focus();
                      }
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <span className="phone-caption">
                A SMALL WINDOW INTO YOUR NEXT OBSESSION.
              </span>
            </div>
          </section>
          <ObsidianScene reduced={reduced} openPortal={() => setPortal(true)} />
          <div className="scene-bridge" aria-hidden="true">
            <svg viewBox="0 0 1600 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="continuity-thread">
                  <stop offset="0" stopColor="#d8c5a8" stopOpacity="0" />
                  <stop offset=".5" stopColor="#eadcc5" stopOpacity=".65" />
                  <stop offset="1" stopColor="#d8c5a8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="thread-base"
                d="M0 95 C420 -30 1030 160 1600 18"
              />
              <path
                className="thread-pulse"
                pathLength="1"
                d="M0 95 C420 -30 1030 160 1600 18"
              />
              <path
                className="thread-echo"
                d="M0 108 C500 -10 1020 176 1600 30"
              />
            </svg>
          </div>
          <section className="details section-shell">
            <Reveal className="details-title">
              <p className="eyebrow">03 / GOOD MUSIC. LESS FRICTION.</p>
              <h2>
                All the feeling.
                <br />
                <em>None of the noise.</em>
              </h2>
            </Reveal>
            <div className="feature-rows">
              {[
                {
                  icon: Search,
                  title: "Follow your curiosity",
                  text: "Find artists, albums, tracks and the next song you’ll want to save.",
                },
                {
                  icon: Music2,
                  title: "Stay with the song",
                  text: "Artwork, lyrics and clear playback controls keep the moment in focus.",
                },
                {
                  icon: Folder,
                  title: "Bring your own world",
                  text: "Your local music and downloaded favorites have a place here, too.",
                },
                {
                  icon: Github,
                  title: "Open by design",
                  text: "Explore the Android source, follow development, and make it your own.",
                },
              ].map((f, i) => (
                <Reveal key={f.title} className="feature-row">
                  <span className="feature-index">0{i + 1}</span>
                  <f.icon size={24} />
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  <ArrowUpRight size={22} />
                </Reveal>
              ))}
            </div>
          </section>
          <section className="signal-section" aria-label="A hidden frequency">
            <SignalField reduced={reduced} />
            <Reveal className="signal-copy">
              <p className="eyebrow">
                <ShinyText
                  text="SOME THINGS ARE BETTER FELT."
                  color="#c6bcae"
                  shineColor="#ffffff"
                  trigger="view"
                  disabled={reduced}
                />
              </p>
              <h2>
                Lose yourself.
                <br />
                <em>Find your frequency.</em>
              </h2>
              <SpecularButton
                followMouse={!reduced}
                radius={40}
                lineColor={current.color}
                onClick={() => setPortal(true)}
              >
                Open the hidden signal <Sparkles size={18} />
              </SpecularButton>
              <p className="signal-hint">
                A small detour from the ordinary. No sound required.
              </p>
            </Reveal>
          </section>
          <section className="faq section-shell">
            <Reveal>
              <p className="eyebrow">BEFORE YOU PRESS PLAY</p>
              <h2>A few good questions.</h2>
            </Reveal>
            <div className="faq-items">
              {[
                {
                  q: "What is Veyra?",
                  a: "Veyra is a native Android music player built around music discovery, a focused player, lyrics, playlists and local music. This website is its interactive showcase.",
                },
                {
                  q: "Is this website playing music?",
                  a: "No. The phone is an illustrative, interactive preview with original artwork and demo text. The play button runs a visual timer; it does not stream a real song.",
                },
                {
                  q: "Where can I download the Android app?",
                  a: "You can check GitHub releases or use the alternate Google Drive folder below. In Drive, open the folder and choose the APK to download. The source ZIP is an Android Studio project, not an installable APK.",
                },
                {
                  q: "Can I explore the source?",
                  a: "Yes. The Android repository and source archive are linked below. Check the repository licensing and provider requirements before modifying or redistributing the app.",
                },
              ].map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    <Plus size={20} />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
          <section className="download-section section-shell" id="download">
            <div className="download-top">
              <p className="eyebrow">THIS IS YOUR CUE.</p>
              <span>
                MADE FOR ANDROID <ArrowUpRight size={18} />
              </span>
            </div>
            <Reveal>
              <h2>
                Your next
                <br />
                <em>favorite feeling.</em>
              </h2>
            </Reveal>
            <div className="download-bottom">
              <div>
                <p>
                  Take Veyra with you.
                  <br />A whole world is waiting in your headphones.
                </p>
                <div className="download-actions">
                  <a
                    className="download-main"
                    href={siteConfig.releases}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Find Android releases <ArrowUpRight size={20} />
                  </a>
                  <a
                    className="download-drive"
                    href={siteConfig.driveFolder}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-describedby="drive-download-help"
                  >
                    <span className="drive-icon">
                      <GoogleDriveIcon />
                    </span>
                    <span className="drive-copy">
                      <strong>Google Drive</strong>
                      <span>Alternate APK download</span>
                    </span>
                    <ArrowUpRight
                      className="drive-arrow"
                      size={20}
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <p className="drive-help" id="drive-download-help">
                  Opens the APK folder in a new tab. Choose the APK to download.
                  {" "}Check its filename for the version.
                </p>
                <div className="download-source-row">
                  <div className="source-track">
                    <span className="source-track-label">Stable {siteConfig.appVersion}</span>
                    <div className="source-track-links">
                      <a className="source-link" href={siteConfig.sourceZip}>
                        <Download size={17} aria-hidden="true" /> Android Studio source ZIP
                      </a>
                      <a href={siteConfig.sourceChecksum} aria-label="Stable source SHA-256 checksum">SHA-256</a>
                      <a href={siteConfig.stableNotes}>Stable change notes <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.stableThemes}>Stable themes &amp; icons <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.stableBuildNotes}>Stable verification notes <ArrowUpRight size={12} aria-hidden="true" /></a>
                    </div>
                  </div>
                  <div className="source-track source-track-preview">
                    <span className="source-track-label">Beta preview · for testing</span>
                    <div className="source-track-links">
                      <a className="source-link" href={siteConfig.previewSourceZip}>
                        <Download size={17} aria-hidden="true" /> Preview {siteConfig.previewVersion} source ZIP
                      </a>
                      <a href={siteConfig.previewChecksum} aria-label="Preview source SHA-256 checksum">SHA-256</a>
                      <a href={siteConfig.previewSketchTheme}>Margin Notes sketch theme · beta build 30 <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewSketchAssets}>Preview every sketch asset <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewSketchNotes}>Sketch motion & compatibility <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewNotes}>Preview change notes <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewUiNotes}>Themes, icon picker & previews <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewThemePack}>Halloween theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewWebThemePack}>Web Slinger theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewMidnightThemePack}>Midnight Express theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewAstralThemePack}>Astral Tide theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewPlaytimeThemePack}>Playtime Club theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                      <details className="theme-collection-links">
                        <summary>Layer Lab · five independent asset packs · build 33</summary>
                        <div className="source-track-links">
                          <a href={siteConfig.previewIconNotes}>Build 35 · 21 matching icons and live Home selection <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewIconGallery}>View all 21 real app icons <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewPerformanceNotes}>Build 34 · asset rendering and verification notes <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewAssetNotes}>Layer over any theme · real assets and compatibility <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewAssetBoard}>View AI art direction · actual specimens in pack notes <ArrowUpRight size={12} aria-hidden="true" /></a>
                          {siteConfig.previewAssetPacks.map(pack => (
                            <a key={pack.name} href={pack.url}>{pack.name} asset ZIP · build 33 <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links">
                        <summary>Punk Worlds · five full-color themes · build 32</summary>
                        <div className="source-track-links">
                          <a href={siteConfig.previewPunkAssets}>Compare the five punk themes <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewPunkNotes}>Real fonts, 123 asset roles & build-32 compatibility <ArrowUpRight size={12} aria-hidden="true" /></a>
                          {siteConfig.previewPunkThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP · build 32 <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links">
                        <summary>Advanced Worlds · five complete control themes · build 31</summary>
                        <div className="source-track-links">
                          <a href={siteConfig.previewAdvancedAssets}>Compare the five new worlds <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewAdvancedNotes}>119 asset roles, progress styles & build-31 compatibility <ArrowUpRight size={12} aria-hidden="true" /></a>
                          {siteConfig.previewAdvancedThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP · build 31 <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links">
                        <summary>Illustrated Worlds · five special beta themes</summary>
                        <div className="source-track-links">
                          <a href={siteConfig.previewIllustratedAssets}>Compare all five illustrated worlds <ArrowUpRight size={12} aria-hidden="true" /></a>
                          <a href={siteConfig.previewIllustratedNotes}>Assets, native presets & build-30 compatibility <ArrowUpRight size={12} aria-hidden="true" /></a>
                          {siteConfig.previewIllustratedThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP · build 30 <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links">
                        <summary>Six reference-inspired themes</summary>
                        <div className="source-track-links">
                          {siteConfig.previewReferenceThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links wayfarer-links">
                        <summary>Five Wayfarer themes</summary>
                        <div className="source-track-links">
                          {siteConfig.previewWayfarerThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links dreamscape-links">
                        <summary>Five Dreamscape themes</summary>
                        <div className="source-track-links">
                          {siteConfig.previewDreamscapeThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      <details className="theme-collection-links keepsake-links">
                        <summary>Five Keepsake themes · stable 0.1.7 compatible</summary>
                        <div className="source-track-links">
                          {siteConfig.keepsakeThemes.map(theme => (
                            <a key={theme.name} href={theme.url}>{theme.name} theme ZIP <Download size={12} aria-hidden="true" /></a>
                          ))}
                        </div>
                      </details>
                      {siteConfig.previewWorldCollections.map(collection => (
                        <details key={collection.title} className="theme-collection-links worlds-links">
                          <summary>{collection.title}</summary>
                          <div className="source-track-links">
                            {collection.themes.map(theme => (
                              <a key={theme.name} href={theme.url}>{theme.name} theme ZIP (latest beta) <Download size={12} aria-hidden="true" /></a>
                            ))}
                          </div>
                        </details>
                      ))}
                      <a href={siteConfig.previewAtelierIcons}>12 standalone Glass Atelier icons <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <a href={siteConfig.previewBuildNotes}>Preview verification notes <ArrowUpRight size={12} aria-hidden="true" /></a>
                    </div>
                  </div>
                </div>
                <p className="download-note">
                  Source ZIPs open in Android Studio; they are not installable APKs. Stable 0.1.9 (build 37) adds a direct Immersive player button, a six-mode picker, a seekable playback dock and Artwork Cinema, Theme World, Lyrics Focus, Minimal Night and Landscape Stage alongside Classic. Wide windows gain a two-column stage. It includes the completed 0.1.9 beta: 62 themes, five independent Layer Lab asset packs, 95 launcher choices, live Home icon updates, lighter rendering and safer installs. It also retains three optional app styles alongside Original, immersive playback with theme artwork, five additional widgets, Home/navigation customization, independent fonts, simpler Settings sections and lighter transitions. Original Home now has an optional pinned header, a separate Pin Home header setting and continuous artwork, with theme-matched listening cards and fewer showcase banners. Scroll-player folding animations have their own switch and work with Liquid Glass off. Beta 0.1.9 build 35 adds 21 connected-wave launcher editions, bringing the picker to 95 choices. All 62 themes and five asset packs have matching icons, and Home follows your actual selection. Build 34 reduces asset rendering costs with cached fonts, bounded glyph warmup, simpler container clipping and lighter transitions; device frame-rate validation is pending. Build 33 adds five independent Layer Lab asset packs with separate layer switches. Apply their icons, fonts, controls and page motion over any theme or custom app style while retaining its artwork and palette. All 62 themes are preserved. Build 32 adds five Punk Worlds themes with original-color icons, pressed player-button skins, licensed display fonts, colored headings and matching native controls/motion. Each has 123 asset roles; its AI concept board is separate from the actual runtime asset sheets. Rebuild the stable 0.1.9 APK for these features. It also supports the five Advanced Worlds packs with expanded Home, player and Settings glyphs, custom control geometry, progress tracks and native page motion. Each has 119 asset roles and requires app build 31 or newer, including stable 0.1.9. It also supports the five Illustrated Worlds packs alongside the Margin Notes sketch theme with hand-drawn assets and native sketch motion, plus safer playback recovery, adjustable theme artwork, clearer queue actions, compact Home choices and search retry handling. Earlier theme packs also work on stable 0.1.7; Illustrated Worlds and Margin Notes require app build 30 or newer, including stable 0.1.9; Advanced Worlds requires build 31; Punk Worlds requires build 32. The earlier collections are full themes; Layer Lab supplies separate overlays requiring build 33. Verification notes describe device-testing limits. Rebuild and install the stable APK to receive app-code changes.
                  {" "}<a href={siteConfig.sourceCatalog}>All source downloads <ArrowUpRight size={12} aria-hidden="true" /></a>
                  {" "}<a href={siteConfig.artworkNotes}>Artwork loading update <ArrowUpRight size={12} aria-hidden="true" /></a>
                </p>
                <div className="share-frequency">
                  <button
                    type="button"
                    className="share-veyra"
                    onClick={copyWebsiteLink}
                  >
                    <Copy size={16} aria-hidden="true" /> Copy website link
                  </button>
                  <span>A good find deserves company.</span>
                </div>
                {manualShare && (
                  <label className="manual-share">
                    Select and copy the website link
                    <input
                      ref={shareInput}
                      readOnly
                      value={siteConfig.website}
                      aria-label="Website link to copy"
                      onClick={(event) => event.currentTarget.select()}
                    />
                  </label>
                )}
              </div>
              <a
                className="source-badge"
                href={siteConfig.repository}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={25} />
                <span>
                  OPEN SOURCE.
                  <br />
                  <strong>OPEN POSSIBILITIES.</strong>
                </span>
                <ArrowUpRight size={20} />
              </a>
            </div>
          </section>
        </main>
        <footer className="footer section-shell">
          <div className="footer-main">
            <Logo large />
            <a href="#top">
              Back to the surface <ArrowUpRight size={19} />
            </a>
          </div>
          <p className="footer-credit">
            Made by{" "}
            <a href={siteConfig.creator}>
              Bhavishya Dalal <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </p>
          <div className="footer-bottom">
            <div>
              <a href="./privacy.html">Website privacy</a>
              <a href="./credits.html">Credits</a>
              <a href="./media.html">Media kit</a>
              <a href={siteConfig.repository}>
                GitHub <ArrowUpRight size={13} />
              </a>
              <a href={siteConfig.websiteRepository}>
                Website source <ArrowUpRight size={13} />
              </a>
            </div>
            <span>LISTEN A LITTLE DIFFERENT.</span>
          </div>
        </footer>
        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              className="toast"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
        {portal && (
          <Portal
            reduced={reduced}
            mood={current}
            close={() => setPortal(false)}
          />
        )}
      </div>
    </MotionConfig>
  );
}
function Portal({ reduced, mood, close }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.showModal();
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="portal-title"
      className="portal-dialog"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className="portal-interior">
        <button
          className="portal-close icon-button"
          aria-label="Close hidden signal"
          onClick={close}
          autoFocus
        >
          <X size={26} />
        </button>
        <span className="portal-coordinate">
          UNKNOWN COORDINATES / YOUR FREQUENCY
        </span>
        <motion.div
          className="portal-disc"
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <div />
        </motion.div>
        <div className="portal-message">
          <p className="eyebrow">YOU FOUND THE HIDDEN SIGNAL.</p>
          <h2 id="portal-title">
            Stay a little
            <br />
            <em>longer.</em>
          </h2>
          <p>{mood.line}</p>
          <ResonanceDial reduced={reduced} />
          <button className="plain-link" onClick={close}>
            Return to your world <ArrowRight size={18} />
          </button>
        </div>
        <span className="portal-bottom">
          NO NOTIFICATIONS. NO RUSH. JUST THIS MOMENT.
        </span>
      </div>
    </dialog>
  );
}
createRoot(document.getElementById("root")).render(<App />);
