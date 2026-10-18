import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("veyra-v2-intro", "1"));
});
test("ticker covers its viewport throughout each loop and keeps moving on hover", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const ticker = page.locator(".ticker");
  await ticker.scrollIntoViewIfNeeded();
  for (const width of [320, 390, 1440, 1920, 3440]) {
    await page.setViewportSize({ width, height: 1000 });
    const samples = await page.locator(".ticker-track").evaluate((el) => {
      const animation = el.getAnimations()[0];
      const duration = animation.effect.getTiming().duration;
      animation.pause();
      const host = el.parentElement.getBoundingClientRect();
      const groups = [...el.children];
      const results = [0, 0.25, 0.5, 0.75, 0.9999].map((f) => {
        animation.currentTime = duration * f;
        const first = groups[0].getBoundingClientRect(),
          last = groups[1].getBoundingClientRect();
        return {
          left: first.left <= host.left + 2,
          right: last.right >= host.right - 2,
          same: Math.abs(first.width - last.width) < 1,
        };
      });
      animation.currentTime = 1000;
      animation.play();
      return results;
    });
    expect(
      samples.every((s) => s.left && s.right && s.same),
      `complete loop coverage at ${width}px`,
    ).toBe(true);
  }
  await ticker.hover();
  const position = () =>
    page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).transform);
  const before = await position();
  await expect.poll(position).not.toBe(before);
  await expect(page.locator(".ticker-track")).toHaveCSS(
    "animation-play-state",
    "running",
  );
});
test("scene artwork dissolves into the next section and motion preference freezes decoration", async ({
  page,
}) => {
  await page.goto("/");
  const image = page.locator(".obsidian-image");
  await image.scrollIntoViewIfNeeded();
  await image.evaluate((el) => el.decode());
  await expect(page.locator(".obsidian-scene")).toHaveCSS(
    "border-bottom-width",
    "0px",
  );
  await expect(page.locator(".obsidian-scene")).toHaveCSS(
    "margin-bottom",
    "0px",
  );
  expect(
    await image.evaluate((el) => getComputedStyle(el).maskImage),
  ).toContain("linear-gradient");
  await expect(page.locator(".scene-bridge")).toBeVisible();
  await page.getByRole("button", { name: /Motion on/ }).click();
  await expect(page.locator(".manifesto .scroll-reveal").first()).toHaveCSS(
    "opacity",
    "1",
  );
  for (const selector of [".ticker-track", ".ambient-bloom", ".thread-pulse"]) {
    expect(
      await page
        .locator(selector)
        .evaluateAll((nodes) =>
          nodes.every((el) => el.getAnimations().length === 0),
        ),
    ).toBe(true);
  }
});
