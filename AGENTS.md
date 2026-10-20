# Website and release-link maintenance

- The owner requests that app changes also keep this website's external links and
  version labels current, verified and pushed to `Bhavishyadalal/Veyra-website`.
  Treat this as ongoing authorization for relevant website source updates.
- The public website is `https://veyra-website-mauve.vercel.app/`. Keep canonical,
  Open Graph/Twitter images, sharing actions and banner links consistent when it changes.
- Centralize app/download/creator/repository links in `src/config.js`. Current
  stable source is 0.1.6 on app `main`; current preview source is 0.1.7-beta1 on
  `preview/0.1.7-beta1`. Verify the actual remote app branches/files before updating.
- Stable and preview are distinct tracks. Never silently promote preview as stable.
  Source ZIPs are Android Studio projects, not APKs. Do not claim an APK exists or
  assign an unverified version to the owner's Drive folder. Preserve its given URL
  until the owner changes it or a verified replacement is available.
- When archives are rotated, update source/checksum/change-note/catalog links and
  version labels together. Do not restore links to removed archives.
- Keep required license/provenance links. Do not replace a credited library's
  project URL with a Veyra URL or confuse the marketing website with a web player.
- Run `npm run build`, `npm run typecheck` and relevant desktop/mobile Playwright
  checks after changes. A Git push does not prove Vercel has deployed successfully;
  distinguish local checks, remote files and live deployment status.
