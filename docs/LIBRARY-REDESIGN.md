# Library and landing-page redesign

The owner requested an updated beta plus a less crowded website, especially its lower download/link area. The chosen beta is `preview/0.2.2-beta1`, code 57, based on stable 0.2.1 code 56; prior preview branches and stable app code remain unchanged.

## Final structure

- Landing: two substantial Android download choices, a compact route to the library, and sharing. APK versions remain whatever is actually published on Releases/Drive; source version labels do not imply APK publication.
- Library (`resources.html`): separate Vite entry and JS bundle with stable/beta source cards, SHA-256 and release notes. Themes/overlays and icon/artwork collections open on demand. Search filters titles and pack names; meaningful empty states and clearing are included. Project/code/verification/provenance links have their own section.
- Footer: clear Explore, Project and legal columns, readable creator attribution and Back to top. The floating shortcut dock becomes inert and fades away when download/footer content is visible, preserving access to links and metadata.
- Main page: clearer navigation, larger supporting text, refined FAQ spacing and native single-open disclosure behavior. Existing artwork, interactive demo, hidden signal, media pages and licensing links remain.
- Accessibility: native disclosures, named navigation landmarks, keyboard roving tabs with arrows/Home/End, labeled search, visible focus, reduced-motion behavior, local fonts/images and narrow layouts. Resources sharing metadata has its own title/canonical URL.

## Validation

Production build and TypeScript checks pass. Desktop/mobile resource tests cover source tracks/checksums, theme searching, actual pack URLs, project links, keyboard tabs, accessibility, empty states, 320/360/768px overflow and sharing metadata. The full production suite passes: 77 tests passed, five device-specific skips, zero failures. The complete existing website suite is exercised, including demos, galleries, motion/clipboard preferences, navigation and fallback behavior. Old assertions naming the removed download button were updated to the new primary action; the actual destination remains GitHub Releases.

Desktop/mobile screenshots were reviewed in `/workspace/outputs/veyra-web-redesign/` outside Git. No new generated image assets are required. All 109 configured app repository links are verified against the pushed stable/beta Git trees; public beta source/checksum/note/catalog URLs return HTTP 200. The app beta compile and 56 targeted download/update/theme regressions pass. Git push and production deployment are checked separately.
