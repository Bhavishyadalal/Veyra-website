/** Keep stable and preview source tracks separate; APK publication is independent. */
const repository = "https://github.com/Bhavishyadalal/Veyra";
const appVersion = "0.1.7";
const previewVersion = "0.1.8-beta1";
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
  stableNotes: `${repository}/blob/main/RELEASE_NOTES_${appVersion}.md`,
  stableThemes: `${repository}/blob/main/themes/README.md`,
  stableBuildNotes: `${repository}/blob/main/verification/KEEPSAKE-STABLE-0.1.7.md`,
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
  previewWayfarerThemes: [
    { name: "Golden Afterglow", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/golden-afterglow-v1.zip` },
    { name: "Lilypond Parade", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/lilypond-parade-v1.zip` },
    { name: "Dustbyte Outpost", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/dustbyte-outpost-v1.zip` },
    { name: "Alpine Ember", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/alpine-ember-v1.zip` },
    { name: "Starfall Pals", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/starfall-pals-v1.zip` },
  ],
  previewDreamscapeThemes: [
    { name: "Chrome Vesper", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/chrome-vesper-v1.zip` },
    { name: "Window Wish", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/window-wish-v1.zip` },
    { name: "Cassette Corner", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/cassette-corner-v1.zip` },
    { name: "Azure Bloom", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/azure-bloom-v1.zip` },
    { name: "Strawberry Daydream", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/strawberry-daydream-v1.zip` },
  ],
  keepsakeThemes: [
    { name: "Patchwork Picnic", url: `${repository}/raw/refs/heads/main/themes/packs/patchwork-picnic-v1.zip` },
    { name: "Clover Requiem", url: `${repository}/raw/refs/heads/main/themes/packs/clover-requiem-v1.zip` },
    { name: "Sunroom Mixtape", url: `${repository}/raw/refs/heads/main/themes/packs/sunroom-mixtape-v1.zip` },
    { name: "Concrete Afterhours", url: `${repository}/raw/refs/heads/main/themes/packs/concrete-afterhours-v1.zip` },
    { name: "Matcha Mischief", url: `${repository}/raw/refs/heads/main/themes/packs/matcha-mischief-v1.zip` },
  ],
  previewWorldCollections: [
    { title: "Glass, lanterns & arcades", themes: [
      { name: "Stained Glass Sonata", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/stained-glass-sonata-v1.zip` },
      { name: "Firefly Railway", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/firefly-railway-v1.zip` },
      { name: "Porcelain Moon", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/porcelain-moon-v1.zip` },
      { name: "Black Honey", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/black-honey-v1.zip` },
      { name: "Sakura Arcade", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/sakura-arcade-v1.zip` },
    ] },
    { title: "Small worlds & machines", themes: [
      { name: "Cloud Post Office", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/cloud-post-office-v1.zip` },
      { name: "Copper Canyon Radio", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/copper-canyon-radio-v1.zip` },
      { name: "Midnight Aquarium", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/midnight-aquarium-v1.zip` },
      { name: "Sunday Bakery", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/sunday-bakery-v1.zip` },
      { name: "Rose Circuit", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/rose-circuit-v1.zip` },
    ] },
    { title: "Craft, winter & cinema", themes: [
      { name: "Clockwork Garden", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/clockwork-garden-v1.zip` },
      { name: "Snowglobe Village", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/snowglobe-village-v1.zip` },
      { name: "Indigo Atelier", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/indigo-atelier-v1.zip` },
      { name: "Prism Playground", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/prism-playground-v1.zip` },
      { name: "Silent Cinema", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/silent-cinema-v1.zip` },
    ] },
    { title: "Quiet Horizons \u00b7 image collection", themes: [
      { name: "Riverside Pause", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/riverside-pause-v1.zip` },
      { name: "Pixel Stargazer", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/pixel-stargazer-v1.zip` },
      { name: "Roaming Cosmos", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/roaming-cosmos-v1.zip` },
      { name: "Blue Hour Sanctuary", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/blue-hour-sanctuary-v1.zip` },
      { name: "Celestial Current", url: `${repository}/raw/refs/heads/${previewBranch}/themes/packs/celestial-current-v1.zip` },
    ] },
  ],
  previewAtelierIcons: `${repository}/blob/${previewBranch}/design/launcher/atelier/README.md`,
  previewBuildNotes: `${repository}/blob/${previewBranch}/verification/APP-STYLES-POLISH-${previewVersion}.md`,
  artworkNotes: `${repository}/blob/main/docs/ARTWORK_LOADING.md`,
  sourceCatalog: `${repository}/blob/main/downloads/README.md`,
});
