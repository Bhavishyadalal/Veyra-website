import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("veyra-v2-intro", "1"));
});
test("glass particles move in normal mode and become still with reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".glass-particles")).toBeVisible();
  const pixels = () =>
    page.locator(".glass-particles").evaluate((c) => c.toDataURL());
  const before = await pixels();
  await expect.poll(pixels).not.toBe(before);
  await page.getByRole("button", { name: /Motion on/ }).click();
  await expect(page.locator(".hero-visual")).toHaveAttribute(
    "data-depth",
    "still",
  );
  await page.waitForTimeout(450);
  const still = await pixels();
  await page.waitForTimeout(200);
  expect(await pixels()).toBe(still);
});
test("desktop pointer changes the visual camera without moving the headline", async ({
  page,
}, info) => {
  test.skip(
    info.project.name.startsWith("mobile"),
    "Touch layouts use ambient depth, not pointer tilt.",
  );
  await page.goto("/");
  await page.waitForTimeout(1700);
  const heading = await page.locator("h1").boundingBox();
  await page.mouse.move(300, 300);
  await page.waitForTimeout(400);
  const first = await page
    .locator(".depth-camera")
    .evaluate((n) => getComputedStyle(n).transform);
  await page.mouse.move(1250, 600);
  await expect
    .poll(() =>
      page
        .locator(".depth-camera")
        .evaluate((n) => getComputedStyle(n).transform),
    )
    .not.toBe(first);
  const after = await page.locator("h1").boundingBox();
  expect(Math.abs(after.x - heading.x)).toBeLessThan(1);
  expect(Math.abs(after.y - heading.y)).toBeLessThan(1);
});
test("new typefaces load and primary lines fit their masks on narrow layouts", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check("700 32px Syne"))).toBe(
    true,
  );
  expect(
    await page.evaluate(() => document.fonts.check("italic 500 32px Bodoni")),
  ).toBe(true);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const clipped = await page
      .locator(".title-mask")
      .evaluateAll((nodes) =>
        nodes.some((n) => n.scrollWidth > n.clientWidth + 2),
      );
    expect(clipped).toBe(false);
  }
});
