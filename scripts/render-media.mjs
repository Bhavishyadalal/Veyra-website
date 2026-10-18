import { createServer } from "vite";
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
const items = [
  {
    id: "share-card",
    path: "social/veyra-share-card-v1.jpg",
    width: 1200,
    height: 630,
    title: "Link-sharing card",
    description: "Primary thumbnail for WhatsApp and other link previews.",
    alt: "Veyra app icon and wordmark beside a crystal sound portal; Your music. Another dimension.",
  },
  {
    id: "app-banner",
    path: "banners/veyra-app-banner.png",
    width: 2560,
    height: 1440,
    title: "App campaign banner",
    description: "Large landscape artwork for the website and app showcase.",
    alt: "Veyra Android music app campaign with silver liquid-glass artwork.",
  },
  {
    id: "github-banner",
    path: "banners/veyra-github-social.png",
    width: 1280,
    height: 640,
    title: "GitHub social banner",
    description: "Repository social-preview upload and README banner.",
    alt: "Veyra: Find your frequency. An independent Android music experience.",
  },
  {
    id: "square-post",
    path: "posts/veyra-square-post.png",
    width: 1080,
    height: 1080,
    title: "Square showcase post",
    description: "Square campaign artwork for posts and image galleries.",
    alt: "Veyra glass artwork and the words Lose the noise. Keep the feeling.",
  },
  {
    id: "story-post",
    path: "posts/veyra-portrait-story.jpg",
    width: 1080,
    height: 1920,
    title: "Portrait story",
    description:
      "Vertical promotional artwork for mobile stories and status posts.",
    alt: "Veyra brand above a tall crystal waveform; Find your frequency.",
  },
  {
    id: "feature-graphic",
    path: "banners/veyra-feature-graphic.png",
    width: 1024,
    height: 500,
    title: "Feature graphic",
    description:
      "Wide promotional format, sized for a 1024 by 500 feature slot.",
    alt: "Veyra: Discover. Feel. Repeat. Android music player.",
  },
  {
    id: "brand-lockup",
    path: "brand/veyra-lockup-transparent.png",
    width: 1600,
    height: 600,
    title: "Transparent brand lockup",
    description:
      "Real app icon with the Veyra wordmark; transparent outside the graphic.",
    alt: "Veyra app icon and white Veyra wordmark on a transparent canvas.",
  },
];
for (const [id, size, title] of [
  ["web-icon-192", 192, "Website icon · 192"],
  ["web-icon-512", 512, "Website icon · 512"],
  ["apple-touch", 180, "Apple touch icon"],
  ["favicon", 32, "Browser favicon PNG"],
])
  items.push({
    id,
    path: `brand/veyra-${id}.png`,
    width: size,
    height: size,
    title,
    description: "Website/bookmark icon derived from the original app artwork.",
    alt: "Veyra black-and-silver glass-waveform icon.",
  });
const server = await createServer({
  server: { host: "127.0.0.1", port: 5190, strictPort: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : existsSync("/usr/bin/chromium")
        ? { executablePath: "/usr/bin/chromium" }
        : {}),
  });
  const page = await browser.newPage({
    viewport: { width: 2700, height: 2000 },
    deviceScaleFactor: 1,
  });
  await page.goto("http://127.0.0.1:5190/tools/media-artboards.html");
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("img")
    .evaluateAll((images) => Promise.all(images.map((i) => i.decode())));
  for (const item of items) {
    await mkdir(`public/media-kit/${item.path.split("/")[0]}`, {
      recursive: true,
    });
    await page.locator("#" + item.id).screenshot({
      path: "public/media-kit/" + item.path,
      type: item.path.endsWith(".jpg") ? "jpeg" : "png",
      ...(item.path.endsWith(".jpg") ? { quality: 92 } : {}),
      omitBackground: item.id === "brand-lockup",
      animations: "disabled",
    });
    console.log("Rendered", item.path, `${item.width}x${item.height}`);
  }
  const { readFile, copyFile } = await import("node:fs/promises");
  await copyFile(
    "public/media-kit/brand/veyra-apple-touch.png",
    "public/apple-touch-icon.png",
  );
  const png = await readFile("public/media-kit/brand/veyra-favicon.png");
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 32;
  header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile("public/favicon.ico", Buffer.concat([header, png]));
  items.push({
    id: "app-icon",
    path: "brand/veyra-app-icon-original.png",
    width: 1254,
    height: 1254,
    title: "Original app icon",
    description: "Unchanged high-resolution glass-waveform app artwork.",
    alt: "The original black and silver Veyra glass-waveform app icon.",
  });
  await writeFile(
    "public/media-kit/manifest.json",
    JSON.stringify(
      { version: "1.0.0", generated: "2026-10-18", items },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser?.close();
  await server.close();
}
