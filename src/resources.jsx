import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Search,
  X,
  Layers,
  Palette,
  CodeXml,
  Boxes,
} from "lucide-react";
import { siteConfig as config } from "./config";
import "./styles/base.css";
import "./styles/collection.css";

const tabs = [
  { id: "builds", label: "Builds", icon: Boxes },
  { id: "themes", label: "Themes & overlays", icon: Palette },
  { id: "icons", label: "Icons & artwork", icon: Layers },
  { id: "project", label: "Project", icon: CodeXml },
];
const themeGroups = [
  {
    id: "signature",
    name: "Signature worlds",
    description: "Five distinct places to press play.",
    items: [
      { name: "Halloween Nocturne", url: config.previewThemePack },
      { name: "Web Slinger", url: config.previewWebThemePack },
      { name: "Midnight Express", url: config.previewMidnightThemePack },
      { name: "Astral Tide", url: config.previewAstralThemePack },
      { name: "Playtime Club", url: config.previewPlaytimeThemePack },
    ],
    notes: config.previewUiNotes,
  },
  {
    id: "punk",
    name: "Punk Worlds",
    description: "Loud color. A little beautiful disorder.",
    items: config.previewPunkThemes,
    notes: config.previewPunkNotes,
    art: config.previewPunkAssets,
  },
  {
    id: "advanced",
    name: "Advanced Worlds",
    description: "Complete palettes, icons and player controls.",
    items: config.previewAdvancedThemes,
    notes: config.previewAdvancedNotes,
    art: config.previewAdvancedAssets,
  },
  {
    id: "illustrated",
    name: "Illustrated Worlds",
    description: "A whole world in the smallest details.",
    items: [
      ...config.previewIllustratedThemes,
      { name: "Margin Notes", url: config.previewSketchTheme },
    ],
    notes: config.previewIllustratedNotes,
    art: config.previewIllustratedAssets,
  },
  {
    id: "reference",
    name: "Reference collection",
    description: "Six playful, familiar-feeling worlds.",
    items: config.previewReferenceThemes,
    notes: config.previewUiNotes,
  },
  {
    id: "wayfarer",
    name: "Wayfarer",
    description: "Take the scenic route.",
    items: config.previewWayfarerThemes,
    notes: config.previewUiNotes,
  },
  {
    id: "dreamscape",
    name: "Dreamscape",
    description: "Soft edges. Unexpected places.",
    items: config.previewDreamscapeThemes,
    notes: config.previewUiNotes,
  },
  {
    id: "keepsake",
    name: "Keepsake",
    description: "Five small worlds worth coming back to.",
    items: config.keepsakeThemes,
    notes: config.stableThemes,
    track: "Stable",
  },
  ...config.previewWorldCollections.map((group, i) => ({
    id: `world-${i}`,
    name: group.title.replace(" · image collection", ""),
    description: "Explore the collection, one world at a time.",
    items: group.themes,
    notes: config.previewUiNotes,
  })),
  {
    id: "night",
    name: "Night Vault",
    description: "Ten gothic and punk overlays.",
    items: config.stableNightVaultPacks,
    notes: config.stableNightVaultNotes,
    art: config.stableNightVaultBoard,
    track: "Stable · overlays",
  },
  {
    id: "layer",
    name: "Layer Lab",
    description: "Independent assets to layer over your theme.",
    items: config.previewAssetPacks,
    notes: config.previewAssetNotes,
    art: config.previewAssetBoard,
    track: "Preview · overlays",
  },
];
const iconGroups = [
  {
    id: "pocket",
    name: "Pocket Riot",
    description: "27 glass waveform editions with personality.",
    items: [
      { name: "View the glass icon gallery", url: config.stablePocketIcons },
      { name: "View the Pocket Riot collection", url: config.previewCollection },
    ],
  },
  {
    id: "night-icons",
    name: "Night Vault icons",
    description: "Ten dark glass editions, built into the app.",
    items: [
      {
        name: "View the ten launcher icons",
        url: config.stableNightVaultIcons,
      },
      { name: "Artwork & compatibility", url: config.stableNightVaultNotes },
    ],
  },
  {
    id: "matching",
    name: "Matching app icons",
    description: "Icons that belong with your chosen world.",
    items: [
      { name: "Explore the icon collection", url: config.previewIconGallery },
      { name: "Icon selection & compatibility", url: config.previewIconNotes },
    ],
  },
  {
    id: "atelier",
    name: "Glass Atelier",
    description: "Twelve standalone glass explorations.",
    items: [{ name: "Explore Glass Atelier", url: config.previewAtelierIcons }],
  },
  {
    id: "immersive",
    name: "Immersive worlds",
    description: "A closer look at six expanded scenes.",
    items: [
      { name: "View actual app previews", url: config.stableImmersiveGallery },
    ],
  },
  {
    id: "margin-art",
    name: "Margin Notes study",
    description: "The sketchbook, from concept to controls.",
    items: [
      { name: "See every sketch asset", url: config.previewSketchAssets },
      { name: "Art direction & compatibility", url: config.previewSketchNotes },
    ],
  },
];
const projectLinks = [
  {
    name: "Android app repository",
    description: "Code, issues and the project's history.",
    url: config.repository,
  },
  {
    name: "Website repository",
    description: "The source behind this experience.",
    url: config.websiteRepository,
  },
  {
    name: "Stable release notes",
    description: `What's changed in ${config.appVersion}.`,
    url: config.stableNotes,
  },
  {
    name: "Preview release notes",
    description: `What's being tested in ${config.previewVersion}.`,
    url: config.previewNotes,
  },
  {
    name: "Stable verification",
    description: "Checks performed and device-testing limits.",
    url: config.stableBuildNotes,
  },
  {
    name: "Preview verification",
    description: "The latest preview's checks and scope.",
    url: config.previewBuildNotes,
  },
  {
    name: "Source archive guide",
    description: "Opening, restoring and verifying a project.",
    url: config.sourceCatalog,
  },
  {
    name: "Artwork loading",
    description: "How artwork is prepared and displayed.",
    url: config.artworkNotes,
  },
  {
    name: "Asset rendering notes",
    description: "Rendering decisions and performance checks.",
    url: config.previewPerformanceNotes,
  },
  {
    name: "Media kit",
    description: "Local brand assets, artwork and provenance.",
    url: "./media.html",
  },
];
const initialSection = () =>
  tabs.some((tab) => tab.id === location.hash.slice(1))
    ? location.hash.slice(1)
    : "builds";
function ResourceLink({ href, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
function BuildCard({ preview = false }) {
  const version = preview ? config.previewVersion : config.appVersion;
  return (
    <article
      className={`build-card ${preview ? "build-preview" : "build-stable"}`}
    >
      <div className="build-card-top">
        <span className="build-status">
          {preview ? "FOR TESTING" : "RECOMMENDED SOURCE"}
        </span>
        <span className="build-mark">
          {preview ? "β" : <Check size={20} />}
        </span>
      </div>
      <h2>{preview ? "The next chapter." : "A solid place to start."}</h2>
      <p className="build-version">
        {preview ? "Beta" : "Stable"} <strong>{version}</strong>
      </p>
      <p>
        {preview
          ? "Beta build 60 adds a saved reduced-effects profile, opaque surfaces and a post-welcome choice, based on stable 0.2.2."
          : "Stable build 59 brings tap-to-type Search, appearance preparation and lighter navigation rendering, with startup recovery and gallery layout fixes."}
      </p>
      <a
        className="build-download"
        href={preview ? config.previewSourceZip : config.sourceZip}
      >
        <Download size={19} />
        {preview ? "Download beta source" : "Download stable source"}
        <ArrowUpRight size={18} />
      </a>
      <div className="build-meta">
        <a
          href={preview ? config.previewChecksum : config.sourceChecksum}
          aria-label={`${preview ? "Beta" : "Stable"} source SHA-256 checksum`}
        >
          SHA-256 checksum
        </a>
        <a href={preview ? config.previewNotes : config.stableNotes}>
          What's new <ArrowUpRight size={13} />
        </a>
      </div>
    </article>
  );
}
function Collections({ groups, query, kind }) {
  const needle = query.trim().toLocaleLowerCase();
  const matching = groups
    .map((group) => ({
      ...group,
      items: group.name.toLocaleLowerCase().includes(needle)
        ? group.items
        : group.items.filter((item) =>
            item.name.toLocaleLowerCase().includes(needle),
          ),
    }))
    .filter((group) => group.items.length);
  if (!matching.length)
    return (
      <div className="resource-empty">
        <Search size={28} />
        <h3>No matches yet.</h3>
        <p>Try a collection name, like “Night Vault” or “Wayfarer”.</p>
      </div>
    );
  return (
    <div className="collection-grid">
      {matching.map((group, index) => (
        <details
          className="collection-card"
          key={`${group.id}-${needle}`}
          name={needle ? undefined : "veyra-collections"}
          open={needle ? true : undefined}
        >
          <summary>
            <span className={`collection-emblem emblem-${index % 4}`}>
              {kind === "themes" ? <Palette size={25} /> : <Layers size={25} />}
            </span>
            <span className="collection-heading">
              <span className="collection-track">
                {group.track ||
                  (kind === "themes" ? "Preview catalogue" : "ARTWORK & ICONS")}
              </span>
              <strong>{group.name}</strong>
              <span>{group.description}</span>
            </span>
            <ChevronDown size={19} />
          </summary>
          <div className="collection-items">
            {group.items.map((item) => (
              <ResourceLink href={item.url} key={item.url}>
                {item.name}
                {kind === "themes" && <span className="file-label">ZIP</span>}
              </ResourceLink>
            ))}
            {group.notes && (
              <div className="collection-notes">
                <a href={group.notes}>
                  Collection notes <ArrowUpRight size={13} />
                </a>
                {group.art && (
                  <a href={group.art}>
                    Art direction <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
function Resources() {
  const [section, setSection] = useState(initialSection),
    [query, setQuery] = useState("");
  const tabRefs = useRef([]);
  useEffect(() => {
    const update = () => {
      setSection(initialSection());
      setQuery("");
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const select = (id) => {
    setSection(id);
    setQuery("");
    history.replaceState(null, "", `#${id}`);
  };
  const keyboard = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    select(tabs[next].id);
    tabRefs.current[next]?.focus();
  };
  return (
    <>
      <a className="skip-link" href="#library-main">
        Skip to content
      </a>
      <header className="library-header">
        <a
          className="library-brand"
          href="./index.html"
          aria-label="Veyra home"
        >
          <img src="/brand/favicon.png" width="44" height="44" alt="" />
          <span>Veyra</span>
        </a>
        <a href="./index.html">
          <ArrowLeft size={16} /> Back to the experience
        </a>
      </header>
      <main id="library-main" className="resource-library">
        <div className="library-hero">
          <div>
            <p className="eyebrow">THE VEYRA LIBRARY</p>
            <h1>
              A little more
              <br />
              <em>yours.</em>
            </h1>
          </div>
          <p>
            Find a build. Pick a world.
            <br />
            Explore the details that make Veyra your own.
          </p>
        </div>
        <div className="library-controls">
          <div
            className="library-tabs"
            role="tablist"
            aria-label="Resource categories"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                ref={(node) => (tabRefs.current[index] = node)}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={section === tab.id}
                aria-controls="resource-panel"
                tabIndex={section === tab.id ? 0 : -1}
                onClick={() => select(tab.id)}
                onKeyDown={(event) => keyboard(event, index)}
              >
                <tab.icon size={17} />
                {tab.label}
              </button>
            ))}
          </div>
          {section !== "builds" && (
            <label className="library-search">
              <Search size={18} />
              <span className="sr-only">Search the library</span>
              <input
                type="search"
                placeholder="Find something you love…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear library search"
                  onClick={() => setQuery("")}
                >
                  <X size={17} />
                </button>
              )}
            </label>
          )}
        </div>
        <section
          id="resource-panel"
          className="resource-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`tab-${section}`}
        >
          {section === "builds" ? (
            <>
              <div className="library-section-heading">
                <h2>Two tracks. Your choice.</h2>
                <p>
                  Source projects for Android Studio. These ZIPs are not
                  installable APKs.
                </p>
              </div>
              <div className="build-grid">
                <BuildCard />
                <BuildCard preview />
              </div>
              <div className="library-callout">
                <span>
                  <strong>Looking for the app?</strong>
                  <p>
                    Choose a published APK from Releases, or open the alternate
                    Drive folder. Check the APK filename for its version.
                  </p>
                </span>
                <a href={config.releases}>
                  Android releases <ArrowRight size={18} />
                </a>
              </div>
            </>
          ) : section === "themes" ? (
            <>
              <div className="library-section-heading">
                <h2>A world for every mood.</h2>
                <p>
                  Themes and independent overlays. Open a collection to explore
                  its packs. Check the collection notes for compatibility.
                </p>
                <ResourceLink href={config.stableThemes}>
                  Browse the full stable catalogue
                </ResourceLink>
              </div>
              <Collections groups={themeGroups} query={query} kind="themes" />
            </>
          ) : section === "icons" ? (
            <>
              <div className="library-section-heading">
                <h2>The finishing touches.</h2>
                <p>
                  Real app icons, artwork studies and immersive scene previews.
                </p>
              </div>
              <Collections groups={iconGroups} query={query} kind="icons" />
            </>
          ) : (
            <>
              <div className="library-section-heading">
                <h2>Behind the experience.</h2>
                <p>
                  Source code, release notes and the decisions behind Veyra.
                </p>
              </div>
              <div className="project-grid">
                {projectLinks
                  .filter((link) =>
                    (link.name + link.description)
                      .toLocaleLowerCase()
                      .includes(query.toLocaleLowerCase()),
                  )
                  .map((link) => (
                    <a className="project-card" href={link.url} key={link.name}>
                      <CodeXml size={22} />
                      <span>
                        <strong>{link.name}</strong>
                        <span>{link.description}</span>
                      </span>
                      <ArrowUpRight size={18} />
                    </a>
                  ))}
              </div>
              {!projectLinks.some((link) =>
                (link.name + link.description)
                  .toLocaleLowerCase()
                  .includes(query.toLocaleLowerCase()),
              ) && (
                <p className="resource-empty">
                  No project links match your search.
                </p>
              )}
            </>
          )}
        </section>
      </main>
      <footer className="library-footer">
        <span>Veyra. Listen a little different.</span>
        <nav aria-label="Library footer">
          <a href="./index.html#download">Get the app</a>
          <a href="./privacy.html">Privacy</a>
          <a href="./credits.html">Credits & licenses</a>
          <a href={config.creator}>
            By Bhavishya Dalal <ArrowUpRight size={13} />
          </a>
        </nav>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")).render(<Resources />);
