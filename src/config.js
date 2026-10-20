/** Keep stable and preview source tracks separate; APK publication is independent. */
const repository = "https://github.com/Bhavishyadalal/Veyra";
const appVersion = "0.1.6";
const previewVersion = "0.1.7-beta1";
const previewBranch = `preview/${previewVersion}`;
const sourceZip = `${repository}/raw/refs/heads/main/downloads/Veyra_Android_Source_${appVersion}_Stable.zip`;
const previewSourceZip = `${repository}/raw/refs/heads/${previewBranch}/downloads/Veyra_Android_Source_${previewVersion}.zip`;

export const siteConfig = Object.freeze({
  website: "https://veyra-website-mauve.vercel.app/",
  appVersion,
  previewVersion,
  repository,
  creator: "https://github.com/Bhavishyadalal",
  websiteRepository: "https://github.com/Bhavishyadalal/Veyra-website",
  driveFolder:
    "https://drive.google.com/drive/folders/1KYJ_1LPy3W5Ax5t4R0mw76Mr8xK9SDuS?usp=sharing",
  releases: `${repository}/releases`,
  stableNotes: `${repository}/blob/main/RELEASE_NOTES_0.1.6.md`,
  sourceZip,
  sourceChecksum: `${sourceZip}.sha256`,
  previewSourceZip,
  previewChecksum: `${previewSourceZip}.sha256`,
  previewThemePack: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/halloween-nocturne-v3.zip`,
  previewWebThemePack: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/web-slinger-v1.zip`,
  previewMidnightThemePack: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/midnight-express-v1.zip`,
  previewAstralThemePack: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/astral-tide-v1.zip`,
  previewPlaytimeThemePack: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/playtime-club-v1.zip`,
  previewNotes: `${repository}/blob/${previewBranch}/RELEASE_NOTES_${previewVersion}.md`,
  previewUiNotes: `${repository}/blob/${previewBranch}/themes/README.md`,
  previewReferenceThemes: [
    { name: "Pumpkin Purr", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/pumpkin-purr-v2.zip` },
    { name: "Sunset Crew", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/sunset-crew-v2.zip` },
    { name: "Starry Spirits", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/starry-spirits-v2.zip` },
    { name: "Analog Reverie", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/analog-reverie-v2.zip` },
    { name: "Petal Promise", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/petal-promise-v2.zip` },
    { name: "Moonlit Herbarium", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/moonlit-herbarium-v2.zip` },
  ],
  previewAtelierIcons: `${repository}/blob/${previewBranch}/design/launcher/atelier/README.md`,
  previewBuildNotes: `${repository}/blob/${previewBranch}/verification/ATELIER-ICONS-${previewVersion}.md`,
  artworkNotes: `${repository}/blob/main/docs/ARTWORK_LOADING.md`,
  sourceCatalog: `${repository}/blob/main/downloads/README.md`,
});
