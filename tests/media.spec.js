import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resolveSocialMetadata } from "../scripts/social-metadata.mjs";

test("sharing metadata is present in the initial HTML without JavaScript", async ({
  browser,
  request,
}) => {
  const response = await request.get("/", {
    headers: { "User-Agent": "facebookexternalhit/1.1" },
  });
  const html = await response.text();
  expect(response.ok()).toBe(true);
  expect(html).toContain('property="og:image"');
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const p = await context.newPage();
  await p.goto("http://127.0.0.1:4173/");
  await expect(p.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https:\/\/raw\.githubusercontent\.com\/.*veyra-share-card-v1\.jpg$/,
  );
  await expect(p.locator('meta[property="og:image:width"]')).toHaveAttribute(
    "content",
    "1200",
  );
  await expect(p.locator('meta[property="og:image:height"]')).toHaveAttribute(
    "content",
    "630",
  );
  await expect(p.locator("link[rel=canonical]")).toHaveCount(0);
  await expect(p.locator('meta[property="og:url"]')).toHaveCount(0);
  const image = await request.get("/media-kit/social/veyra-share-card-v1.jpg");
  expect(image.headers()["content-type"]).toContain("image/jpeg");
  expect((await image.body()).byteLength).toBeLessThan(300 * 1024);
  await context.close();
});

test("deployment URL configuration resolves canonical and hosted image URLs correctly", () => {
  const result = resolveSocialMetadata(
    "https://veyra.example.test/music/",
    "media.html",
  );
  expect(result.url).toBe("https://veyra.example.test/music/media.html");
  expect(result.image).toBe(
    "https://veyra.example.test/music/media-kit/social/veyra-share-card-v1.jpg",
  );
  expect(resolveSocialMetadata("").url).toBeNull();
  expect(() => resolveSocialMetadata("http://veyra.example.test")).toThrow();
});

test("all media exports decode at the promised dimensions and the lockup has transparency", async ({
  page,
  request,
}) => {
  const manifest = await (await request.get("/media-kit/manifest.json")).json();
  expect(manifest.items.length).toBe(12);
  await page.goto("/media.html");
  for (const item of manifest.items) {
    const actual = await page.evaluate(async (path) => {
      const image = new Image();
      image.src = "/media-kit/" + path;
      await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }, item.path);
    expect(actual).toEqual([item.width, item.height]);
  }
  const alpha = await page.evaluate(async () => {
    const image = new Image();
    image.src = "/media-kit/brand/veyra-lockup-transparent.png";
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, 1, 1).data[3];
  });
  expect(alpha).toBe(0);
});

test("gallery filters, native image modal and keyboard dismissal work", async ({
  page,
}) => {
  await page.goto("/media.html");
  await page.getByRole("button", { name: "Banners", exact: true }).click();
  await expect(page.locator(".asset:not([hidden])")).toHaveCount(3);
  const preview = page.getByRole("link", {
    name: "Preview App campaign banner",
    exact: true,
  });
  await preview.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close image preview", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(preview).toBeFocused();
  await page.getByRole("button", { name: "Brand assets", exact: true }).click();
  await expect(page.locator(".asset:not([hidden])")).toHaveCount(6);
  await page.getByRole("button", { name: "All artwork", exact: true }).click();
  await expect(page.locator(".asset:not([hidden])")).toHaveCount(12);
});

test("media gallery is responsive, accessible and useful without JavaScript", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/media.html");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
    ).toBe(true);
  }
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const p = await context.newPage();
  await p.goto("http://127.0.0.1:4173/media-kit/index.html");
  await expect(p.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    p.getByRole("link", { name: "Download image", exact: true }),
  ).toHaveCount(12);
  await context.close();
});
