# React Bits and original artwork provenance — website 4.0.0

Official repository: https://github.com/DavidHDev/react-bits

Pinned source commit: `d965399df489c7b8da3874e07d716c0d98ab39fd`

The following files match the exact `files[].content` of the official `public/r/<variant>.json` registry definitions. They are integrated into this website and retain MIT + Commons Clause terms in `licenses/React-Bits.txt`.

| Requested/public variant | Installed file                      | SHA-256                                                            |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------ |
| `FluxLines-JS-CSS`       | `src/components/FluxLines.css`      | `fd0d908ca6c047e6bd0f8bba2e13fe037ecca0b6e894b3f0612777c75f68950d` |
| `FluxLines-JS-CSS`       | `src/components/FluxLines.jsx`      | `f29fdc61ea2a0684432a2d6ccccd2ef4cf7f10857046daab5e523568e5d9ce07` |
| `SpecularButton-JS-CSS`  | `src/components/SpecularButton.css` | `af7cad9998bd6102a21fd05da11890ca05c061f9d5e6c96f540fb744684442a9` |
| `SpecularButton-JS-CSS`  | `src/components/SpecularButton.jsx` | `943e8535a527563577d07da8f21b680bc70a1866a75d14bbbd396fb92d95cfa6` |
| `ScrollStack-JS-CSS`     | `src/components/ScrollStack.css`    | `64b2bf8c66a1958e0405ed6b885086562e635c22f0f1f79950806661d5470013` |
| `ScrollStack-JS-CSS`     | `src/components/ScrollStack.jsx`    | `e73d47bae2967bf5f4051a8600387ff460dc381a2c8c571c76d28f42aa970292` |
| `SplitText-TS-TW`        | `src/components/SplitText.tsx`      | `5ebb539767ca868732ec0aaf41fdf11f5a4573d14d878d6767df5478e4722ef0` |
| `GlassSurface-JS-CSS`    | `src/components/GlassSurface.css`   | `90cfc3ad54ad7aa92bb2b700696e2d9f2d8704162ba1b94ebf0b6f8dcecc4e61` |
| `GlassSurface-JS-CSS`    | `src/components/GlassSurface.jsx`   | `d435562be2930a98270e3ff5881402a301f84813b06f0603ed353af12a9c96b3` |
| `GlareHover-JS-CSS`      | `src/components/GlareHover.css`     | `556debf36792dd1a774b27f96c120494b7d2a1ed19c188f2b30faf5df31f2b35` |
| `GlareHover-JS-CSS`      | `src/components/GlareHover.jsx`     | `2279e8920957cea3570cec387f184a76f23281ae2e59ccc5299cb5a71bb90fc2` |
| `DecryptedText-JS-CSS`   | `src/components/DecryptedText.jsx`  | `6ea64cddaff8c725ad0939a14e0d1b57a759355f88af1bdffc05a56385a79d5c` |
| `ShinyText-JS-CSS`       | `src/components/ShinyText.css`      | `6030200a8885aba91536e2e367a0ed316989f10122f9d91a20f09caf1b5f46ab` |
| `ShinyText-JS-CSS`       | `src/components/ShinyText.jsx`      | `2f7fa6e4e929985b97bd3542383d748749c2ac32e0f498f37d87d7d9b35bb159` |

## Installation and dependency details

The direct registry `reactbits.dev` is blocked in this cloud environment. The requested shadcn installer was attempted with the official local `SplitText-TS-TW.json`; its dependency step completed but its file-update step failed fetching `ui.shadcn.com/r/colors/neutral.json`. The exact official source contents were therefore copied from the permitted GitHub checkout. No registry access, generator or account is needed to run the delivered project.

SplitText is the actual TypeScript/Tailwind variant, not a renamed JavaScript port. Its declared dependencies, `gsap` and `@gsap/react`, are installed; Tailwind compiles locally via its Vite plugin. `npm run typecheck` validates the TS component. GSAP uses its Standard no-charge license; see `licenses/GSAP-NOTICE.txt`.

## The requested vertical reel

The public `pro-manifest.json` identifies `vertical-reel` as the React Bits Pro Starter **Momentum Ring**, with documentation at https://pro.reactbits.dev/docs/components/vertical-reel. The public project does not include that paid component source. No buyer license-keyed registry was supplied. Its source was not accessed, included, or represented as installed.

The delivered **FrequencyReel** in `src/Experience.jsx` is an independently written interaction using Motion, keyboard/buttons and drag gestures. It uses the original generated scenes and shares mood state with the phone preview. A licensed owner can later integrate the official Pro component; no license keys or account configuration belong in the website ZIP.

## Motion

Motion 14.3.0 is used through `motion/react`. The project-scoped Motion AI Kit/best-practices skill guided the animation work. The MCP service is not connected in this environment; its documentation is https://motion.dev/docs/ai-kit. No Motion+ source, premium tool, API key or account is required for this build. Development-only `.agents`/`.codex` configuration is excluded from delivery.

## Original image generation

Four new images were generated with OpenAI image generation on 18 October 2026, then encoded as WebP without changing their composition:

| Website asset         | Art direction                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `glass-gateway.webp`  | Levitating liquid-glass torus/waveform, smoked chrome, amber rim light, black negative space |
| `glass-horizon.webp`  | Floating glass lens over a black sea, distant ivory sun and mountains                        |
| `glass-orchid.webp`   | Crystal orchid with a warm glowing core and orbital silver thread                            |
| `glass-monolith.webp` | Suspended polished black monolith with an ivory/amber light slit                             |

Prompts requested original artwork with no letters, logos, UI or purple/violet/bright-blue palette. Readable controls/text remain real HTML/CSS. The original image files are retained outside the website source; the source includes their optimized display assets.

The phone is an illustrative web reconstruction inspired by the user-shared app screenshots. Track names, credits and lyric copy are fictional original demo content. No commercial cover art or third-party song lyrics were copied. The actual Veyra app icon and local font subsets keep their existing provenance. Super Malibu permission is recorded in `Super-Malibu-Provenance.md`; Manrope and Anton retain their OFL notices.

## Refraction update — 4.0.0

The glass gateway was regenerated with OpenAI image generation using the previous original artwork as the reference. The edit requested sharper optical crystal and black chrome, cleaner composition, a defined toroidal silhouette, more deliberate refraction and restrained champagne lighting, retaining dark left-side space and excluding text/UI. The new original is `exec-bc4ca56a-5266-4a91-8f33-098e54f0e997.png`; a WebP encoding is served as `glass-gateway.webp`. Other generated artwork remains unchanged.

DepthScene is original website code, not a claimed React Bits component or a video. Syne (`ofl/syne/Syne[wght].ttf`) and Bodoni Moda Italic (`ofl/bodonimoda/BodoniModa-Italic[opsz,wght].ttf`) were obtained from the official google/fonts repository, with each OFL file bundled in public/fonts. Public React Bits component source remains unchanged from the recorded hashes.
