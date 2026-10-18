# Customizing Veyra 4.0

- **Links:** `src/config.js` holds the actual Android version, repository, releases and source ZIP. Release availability is determined by GitHub, so add an APK-specific link only after publishing a real artifact.
- **Typography:** Anton is used for oversized headings, Manrope for UI/body, and Super Malibu only for the wordmark. All files are local; retain their notices.
- **Art direction:** `public/images/` contains four generated WebP artworks: gateway, horizon, orchid and monolith. Keep filenames or update references in `src/main.jsx`. Both are decorative and have empty alt text. New informational images need meaningful alternatives.
- **Moods:** the `moods` array in `src/main.jsx` controls accent, artwork, demo track and original lyric text. Preview audio is intentionally absent.
- **Screens:** the phone preview is a web illustration inspired by the supplied app screenshots. To use real app captures instead, add owned images and label them as actual captures only when accurate.
- **ScrollStack:** native window scrolling is enabled; smooth-wheel interception and snap are disabled. Manual/system reduced motion flattens the chapters into normal flow. Mobile cards fit the narrow layout without rotating or blurring content.
- **Motion:** the switch saves `veyra-site-motion`; `veyra-v2-intro` is a per-tab session flag. The system reduced-motion preference always takes priority. Do not force motion back on against that preference.
- **Hidden scene:** `Portal` uses native dialog focus trapping, Escape dismissal and focus restoration. Preserve those behaviors when changing its layout.
- **Colors/layout:** `src/styles/base.css` and `src/styles/atmosphere.css` holds responsive rules, with mobile layouts at 760px and small-phone adjustments below 360px.
- **Deployment:** keep `privacy.html` and `credits.html` as build inputs and update notices if you add analytics, embedded services, forms or remote fonts.
- **Component updates:** retain upstream React Bits notices and record the updated source commit and hashes in `COMPONENTS.md`.

Do not ship node_modules, dist, credentials, editor/MCP account configuration or build reports in a source archive.

## New interactions

- **FrequencyReel** in `src/Experience.jsx` owns reel selection and original scene copy. It uses Motion depth/spring transitions and native buttons/arrow-key controls, with vertical pointer/touch gestures. Its selected mood is passed to the phone preview via `onSelect`. It is independent code, not the paid React Bits Pro Momentum Ring source.
- **SplitText** is the exact TS/Tailwind component. Its GSAP chunk loads near the reel. Reduced motion renders the complete plain heading; it never gates readable content on an animation.
- **GlassDock** uses one official GlassSurface instance with a smoke tint. It becomes visible after scrolling, observes current sections, and stays inert/hidden from keyboard navigation before appearing.
- **ObsidianScene** uses a MotionValue-driven light position over the monolith artwork, a DecryptedText label and a GlareHover frame around the actual button.
- **ResonanceDial** is a visual interaction, not a radio/audio stream. Its native range slider unlocks the archive at 73.0 and relocks when moved away. Native dialog focus/Escape/return behavior is retained.
- **Palette:** smoked graphite and warm ivory replace the old violet theme. Mood accents are warm metal, parchment and cool silver; the dark background stays consistent across modes.

## Refraction edition

`src/DepthScene.jsx` owns the hero camera and decorative canvas. Pointer input updates MotionValues; springs smooth the image transform without moving the headline or controls. A cached glass-droplet sprite is drawn at different sizes/depths along with dust points. IntersectionObserver, visibilitychange and reduced-motion cleanup stop frame scheduling when it is unnecessary. The particle field stays static when reduced motion is requested. The generated artwork is `public/images/glass-gateway.webp`.

`src/styles/refraction.css` adds Syne/Bodoni Moda typography, optical rings, foreground lenses, refined glass rims, and responsive layout adjustments. Keep all font notices when redistributing the source. The hero visual is decorative (`aria-hidden`) and never captures pointer events, so underlying controls remain usable.
