# Veyra website 4.1.0 — delivery validation

18 October 2026. This report covers the standalone website. APK/release work was deferred at the owner's request.

## Build and browser evidence

- TypeScript check passed: `npm run typecheck`, validating the official SplitText TS/Tailwind source against its installed dependencies.
- Production build passed with Node 24.19.0, npm 11.9.0 and Vite 8.3.4. No oversized-chunk warning remains: GSAP/SplitText is a separate lazy-loaded chunk.
- Full Playwright suite: **54 passed, 2 skipped, 0 failed** across desktop Chromium and Pixel 7 mobile emulation. The skipped cases are the mobile-only menu on desktop and the desktop-only pointer-camera check in mobile emulation.
- After the credits text was finalized, supporting-page build/accessibility checks passed again in both projects (2 tests).
- Browser: Chromium 154.0.8037.57; desktop 1440×1000, mobile 390×844. Horizontal overflow checks passed at 320, 360, 390, 768, 1024, 1440 and 1920px.
- Verified all four phone screens, keyboard tab navigation, mood changes, seek/visual playback/likes/track controls, FAQ/download links, mobile menu, native dialog focus/Escape restoration, no-JavaScript fallback, and operation with WebGL disabled.
- New interaction checks passed: reel next/previous wrap, keyboard navigation, mouse drag and actual emulated touch events, selected-mood transfer to the phone, glass-dock navigation and inert initial state, SplitText lazy loading and live reduced-motion fallback, keyboard tuning to 73.0, archive unlock and relock.
- Automated axe scans found no violations across the four phone states, initial/unlocked modal states, reel/glass-dock state, and privacy/credits pages in both browser projects.
- A separate browser check verified that the first-visit curtain appears, disappears, and does not repeat after reload in the same tab session. The repeat-visit headline reaches its final position without the initial opening delay.
- Desktop/mobile screenshots were captured and visually reviewed. The updated capture pass reported no page runtime errors.

## Assets and animation behavior

The four generated WebP artworks total approximately 880KB. Main JavaScript is approximately 152KB gzip; the separately loaded SplitText/GSAP chunk is approximately 50KB gzip. FluxLines remains a separate effect chunk with pixel ratio capped at 1 and upstream offscreen/hidden-tab pausing. It is omitted in reduced-motion mode. SplitText loads near the reel; reduced motion uses a complete plain heading. No music, remote album artwork, analytics or font CDN is fetched by the website.

Native window scrolling is retained. The reel consumes vertical drag gestures on its own cards; native arrow controls and keyboard alternatives are also available. Reduced motion disables decorative loops, parallax, stacking transforms and glass-control transitions, while retaining the actual interactions.

## Dependencies and source provenance

All eight public React Bits component variants were installed from exact official registry source content in the permitted GitHub checkout. The shadcn attempt could not finish its metadata fetch; details and hashes are in COMPONENTS.md. The requested paid Pro vertical-reel source is not installed: FrequencyReel is independent original website code. GSAP retains its separate Standard no-charge license.

## Practical limits

Chromium emulation does not establish physical-device, Firefox or Safari certification. Automated accessibility scans are not a complete manual accessibility audit. This Linux environment cannot execute native Windows Command Prompt, so the launcher’s documented npm commands are validated here and the batch flow is reviewed, without claiming a Windows execution test. No website deployment or APK publication was performed.

## Archive

The source archive excludes node_modules, dist, build/browser reports, private environment files, development agent/MCP configuration and credentials. It includes locked dependencies, source, local assets, font/component notices, README/customization/provenance documents, screenshots, tests, Windows launcher and Vercel/CI configuration. The ZIP has a SHA-256 sidecar. Fresh extraction passed `npm ci --include=dev --no-fund --no-audit` (58 packages), `npm run typecheck`, and `npm run build`. The extracted 4.1.0 website development server passed a browser smoke test covering the main page, footer gallery, filtering and image dialog, with zero runtime errors. Existing particle, reel and mood behavior passed the full suite in the working source.

## Refraction update checks

The regenerated gateway, 42-point glass/dust canvas, spring-driven image camera and new Syne/Bodoni typography were included in the final 46-case browser run. Particle pixels change in normal motion mode and stay fixed after reduced motion is enabled. Desktop pointer input changes the visual camera while the headline stays in place. Both new fonts load, and primary headline lines fit their masks at 320, 390, 768 and 1440px. Desktop/mobile captures were visually reviewed.

The canvas uses a cached glass-droplet sprite, caps its pixel ratio at 1.5, targets approximately 30fps, and cancels animation scheduling offscreen/when the tab is hidden. Particle visuals are decorative and do not intercept clicks. Original full-resolution regenerated artwork is supplied separately from the optimized WebP website asset.

## Media kit and sharing update

Twelve final exports decoded at their declared dimensions. The transparent lockup has an alpha-zero corner. The 1200 × 630 social JPEG stays below 300KB. Two original AI-generated campaign backgrounds have full-resolution PNG originals and optimized WebP copies; final branding uses the real app icon and local font rendering. Desktop/mobile media galleries were captured and visually reviewed, with all image sources decoded. The empty dialog image is intentionally assigned only when opened.

Hosted gallery filtering, image-dialog close/Escape/focus restoration, 320/390/768/1440px overflow checks, automated accessibility scans and no-JavaScript gallery links passed. After final artwork spacing and credits changes, six metadata/image/gallery checks and two supporting-page checks passed again.

Open Graph/Twitter tags are present in initial HTML, including with JavaScript disabled. A separate production build with an isolated test URL correctly emitted canonical, og:url and hosted image URLs for all four HTML entry points. That test URL is not saved in the website source or delivery ZIP. The production URL is deliberately unset pending deployment; the temporary sharing image points to the public GitHub media-kit image. A live WhatsApp preview remains untested until a real website is publicly deployed. Repository Social preview requires manually uploading the supplied GitHub image in repository settings.

The standalone media gallery also runs directly from a file URL without npm or a server. Media images are provided as ordinary GitHub files in media-kit/ as well as inside both ZIP deliveries.

The managed Chromium policy blocks file:// navigation, so direct double-click execution could not be tested here. The extracted standalone gallery was instead served unchanged over a local HTTP server with JavaScript disabled; all twelve relative image download links returned valid image responses. It contains no module scripts, remote fonts or runtime dependencies.

## Google Drive alternate-download update

Added the owner's supplied Drive folder as an alternate APK download, with a locally rendered three-color icon, a glass button, keyboard focus treatment and explanatory folder/new-tab text. GitHub releases and the source ZIP remain separate options. The FAQ and README describe the folder behavior accurately; no direct APK filename or version is inferred from the folder link.

TypeScript and production build passed. Six targeted browser checks passed across desktop/mobile: download URLs and semantics, responsive overflow, and accessibility across the main preview states. Additional checks at 1440, 390 and 320px verified the download section's exact Drive URL, focusability, minimum touch height, no horizontal overflow and zero axe violations. Screenshots were captured and visually reviewed at desktop/mobile sizes. These checks verify the website link and presentation, not the folder's public permissions or an APK binary download.

## Continuous flow and seamless artwork update

The ticker uses two identical groups, each at least as wide as the rotated viewport. Browser tests sample its start, quarter, half, three-quarter and end positions at 320, 390, 1440, 1920 and 3440px, confirming content covers both edges throughout the loop. Hover retains a running animation and transform changes. Reduced motion still disables decorative animation.

The monolith image, its pointer-light overlay and vertical guide lines fade at their edges; its former rectangular section border and 150px bottom margin are removed. A moving light thread joins it to the next section. Tighter manifesto/details/FAQ spacing and a new original glass-and-mist underlay add depth to the surrounding sections. The new optimized WebP is about 85KiB; its original is retained in public/media-kit/artwork/. Section headings begin their reveals before entering the viewport; reduced motion displays them immediately, including when the preference is changed at runtime.

Full browser run: **58 passed, 2 device-specific skips, zero failures**. After final reveal/overlay/credits refinements, **12 targeted desktop/mobile checks passed** covering both new continuity regressions, page runtime/assets, reduced motion, accessibility of the four phone-preview states and supporting pages. TypeScript and production build passed. Desktop/mobile screenshots were captured and visually reviewed. These are Chromium and mobile-emulation checks; no physical-device or Safari/Firefox certification is claimed.

## Live website sharing URL

The owner supplied https://veyra-website-mauve.vercel.app/ as the public website. social.config.mjs now uses it for the banner, canonical URLs, Open Graph and Twitter large-image metadata. The media-gallery preview shows the real domain, and the README banner links to the website. Production build and four targeted desktop/mobile metadata checks passed, including initial HTML with JavaScript disabled. All four built HTML entry points were checked for the correct canonical address, og:url, og:image and twitter:image. Live chat-app cache refresh and Vercel deployment completion are outside these local build checks.

## Glass cursor and interaction polish

A local SVG arrow and a pointer-events:none decorative ring now work across the main site, privacy/credits documents and hosted media gallery. The ring changes for buttons/links, drag surfaces, editable text, sliders and disabled controls. Native text/range/disabled cursors retain their expected affordances. The ring moves into native dialogs to remain in the top layer and is restored after a dialog closes or React removes it. Touch layouts create no custom cursor; forced colors restores the system cursor. Reduced motion removes following lag and transitions. Keyboard navigation, pointer exit/cancellation and hidden/blurred windows hide the decoration and stop its scheduled work. Pointer coordinates are neither persisted nor transmitted. No new dependency was introduced.

The download area now offers Copy website link, using the actual public URL. Success feedback appears only after clipboard writing succeeds. Denied or unavailable clipboard access instead displays a focused, selected read-only field for manual copying. Privacy text documents both behaviors. The reel has tighter vertical spacing and a soft artwork bloom; the monolith image now meets its fully transparent mask at the section boundary.

TypeScript and production build passed. Full Playwright run: **67 passed, 5 device-specific skips, zero failures** across desktop Chromium and Pixel 7 emulation. The additional skips are mouse-only cursor scenarios on touch emulation; mobile no-cursor behavior is explicitly tested. Cursor coverage includes content/control hover, actual control clicks, reduced-motion positioning, keyboard hiding, reel drag affordance, native hidden-scene and media-gallery dialogs, dialog teardown, three supporting pages, touch exclusion and forced colors. Clipboard success and denial/fallback are tested on both projects. Existing ticker, sharing metadata, overflow, accessibility, phone preview, hidden dial and gesture regressions also pass. Desktop reel/dialog/download and mobile download captures were visually reviewed; the capture pass reported no runtime errors. Physical-device, Firefox and Safari verification remains unrun.

## Cursor redesign — 19 October 2026

Replaced the warm kite-shaped pointer and trailing circular ring with a defined obsidian-and-platinum arrow, a beveled edge, small contextual corner brackets and a compact SVG directional badge over draggable content. Default pointing has no follower circle. Direct pointer positioning replaces smoothing/settling, so the decoration schedules only an event-driven frame. Existing input/slider/disabled affordances, native-dialog support, keyboard hiding, touch exclusion, forced-color fallback and reduced-motion transitions remain.

Production build passed. Thirteen targeted desktop/mobile browser checks passed, with three mouse-only scenarios skipped in touch emulation. Checks cover cursor content/control hover, actual clicks, drag affordance, reduced motion, keyboard hiding, hidden-scene/gallery dialog layering and removal, supporting pages, forced colors, clipboard success/fallback and page runtime/assets. The supporting-page accessibility checks also pass. A design study rendered the actual SVG and CSS states at 3× magnification for visual inspection: docs/cursor-redesign-study.png. These are Chromium checks; physical-device and Safari/Firefox validation remains unrun.


## Glass cursor redesign — 18 October 2026

Replaced the arrow and corner brackets with a centered pearl point and translucent glass lens. The lens expands on controls, becomes a vertical capsule on draggable surfaces, and compresses on press. Removed the unused arrow asset. Native text, resize and disabled cursors remain available; forced colors uses the system cursor, and touch devices create no overlay.

Production build passed. Targeted Playwright checks completed with **13 passed, 3 mouse-only cases skipped on mobile, 0 failed**. Coverage includes precise movement, click-through, reduced motion, keyboard dismissal, dialog reparenting, supporting pages, forced colors, clipboard fallback, asset loading and supporting-page accessibility. This is a targeted recheck, not a fresh full-suite run.

Rendered and inspected `cursor-lens-study.png` using the actual SVG and stylesheet at 3× magnification. Native cursors are not captured in browser screenshots, so the study composites the native SVG above the decorative layer at the matching hotspot.
