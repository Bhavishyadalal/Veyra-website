import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("builds keep stable and beta archives, checksums and notes separate", async ({
  page,
}) => {
  await page.goto("/resources.html");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("yours.");
  const stable = page.locator(".build-stable"),
    beta = page.locator(".build-preview");
  await expect(stable).toContainText("0.2.1");
  await expect(beta).toContainText("0.2.2-beta1");
  await expect(
    stable.getByRole("link", { name: "Download stable source" }),
  ).toHaveAttribute(
    "href",
    /main\/downloads\/Veyra_Android_Source_0\.2\.1_Stable\.zip$/,
  );
  await expect(
    beta.getByRole("link", { name: "Download beta source" }),
  ).toHaveAttribute(
    "href",
    /preview\/0\.2\.2-beta1\/downloads\/Veyra_Android_Source_0\.2\.2-beta1\.zip$/,
  );
  await expect(
    stable.getByRole("link", { name: "Stable source SHA-256 checksum" }),
  ).toHaveAttribute("href", /0\.2\.1_Stable\.zip\.sha256$/);
  await expect(
    beta.getByRole("link", { name: "Beta source SHA-256 checksum" }),
  ).toHaveAttribute("href", /0\.2\.2-beta1\.zip\.sha256$/);
  await expect(page.getByRole("tabpanel")).toContainText(
    "not installable APKs",
  );
});
test("theme search finds packs, preserves URLs and recovers from no matches", async ({
  page,
}) => {
  await page.goto("/resources.html#themes");
  const search = page.getByRole("searchbox", { name: "Search the library" });
  await expect(page.locator(".collection-card[open]")).toHaveCount(0);
  await search.fill("Midnight Express");
  await expect(page.locator(".collection-card")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /Midnight Express/ }),
  ).toHaveAttribute(
    "href",
    /preview\/0\.2\.2-beta1\/themes\/packs\/midnight-express-v1\.zip$/,
  );
  await search.fill("nothing-matches-this");
  await expect(
    page.getByRole("heading", { name: "No matches yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear library search" }).click();
  await expect(page.locator(".collection-card")).toHaveCount(14);
  await page
    .locator(".collection-card")
    .filter({ hasText: "Night Vault" })
    .locator("summary")
    .click();
  await expect(
    page.getByRole("link", { name: /Cathedral Static/ }),
  ).toHaveAttribute(
    "href",
    /main\/asset-packs\/packs\/cathedral-static-v1\.zip$/,
  );
});
test("resource tabs support keyboard navigation and project links stay available", async ({
  page,
}) => {
  await page.goto("/resources.html");
  await page.getByRole("tab", { name: "Builds", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Themes & overlays" }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Project", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("link", { name: /Stable verification/ }),
  ).toHaveAttribute(
    "href",
    /main\/verification\/STABLE-0\.2\.1-PROMOTION\.md$/,
  );
  await expect(
    page.getByRole("link", { name: /Preview verification/ }),
  ).toHaveAttribute(
    "href",
    /preview\/0\.2\.2-beta1\/verification\/BETA-0\.2\.2-beta1\.md$/,
  );
  await page.getByRole("searchbox").fill("website");
  await expect(page.locator(".project-card")).toHaveCount(1);
});
test("library has no horizontal overflow, missing link destinations or accessibility violations", async ({
  page,
}) => {
  await page.goto("/resources.html");
  for (const tab of [
    "Builds",
    "Themes & overlays",
    "Icons & artwork",
    "Project",
  ]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const bad = await page
      .locator("a")
      .evaluateAll((nodes) =>
        nodes
          .filter((a) => !a.getAttribute("href") || /undefined/.test(a.href))
          .map((a) => a.textContent),
      );
    expect(bad).toEqual([]);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("direct library links have page-specific sharing metadata and fit narrow screens", async ({
  page,
}) => {
  await page.goto("/resources.html#icons");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Veyra — Builds & creative library",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://veyra-website-mauve.vercel.app/resources.html",
  );
  for (const width of [320, 360, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const tab of [
      "Builds",
      "Themes & overlays",
      "Icons & artwork",
      "Project",
    ]) {
      await page.getByRole("tab", { name: tab, exact: true }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
