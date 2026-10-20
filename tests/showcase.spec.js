import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("veyra-v2-intro", "1"));
});
test("production page loads local assets without runtime errors", async ({
  page,
}) => {
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.url().startsWith("http://127.0.0.1") && r.status() >= 400)
      failed.push(r.url());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("#inside").scrollIntoViewIfNeeded();
  await expect(page.getByRole("tabpanel")).toBeVisible();
  await page.locator(".signal-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".flux-lines-canvas")).toBeAttached();
  await expect(
    page.getByRole("button", { name: "Open the hidden signal", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
test("four phone screens work, including keyboard tab navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Home", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Listen Now");
  await page
    .getByRole("tab", { name: "Home", exact: true })
    .press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Player", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Cue the words");
  await page
    .getByRole("tab", { name: "Player", exact: true })
    .press("ArrowRight");
  await expect(page.getByRole("tabpanel")).toContainText(
    "Somewhere beyond the noise.",
  );
  await page.getByRole("tab", { name: "Lyrics", exact: true }).press("End");
  await expect(page.getByRole("tabpanel")).toContainText("Local Music");
});
test("demo mood, likes, timer and next track respond", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Daydream/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Bloom");
  await page
    .getByRole("button", { name: "Like demo track", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Unlike demo track", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Play visual demo", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause visual demo", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => page.locator("#demo-position").inputValue())
    .not.toBe("0");
  await page
    .getByRole("button", { name: "Pause visual demo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Next demo track", exact: true })
    .click();
  await expect(page.getByRole("tabpanel")).toContainText("Orbit");
});
test("hidden signal is modal, keyboard dismissible and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Open the hidden frequency",
    exact: true,
  });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close hidden signal", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.querySelector("dialog").contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
test("motion preference persists and disables decorative effects", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Motion on/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".story-stack")).toHaveClass(/static-stack/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.locator(".signal-section").scrollIntoViewIfNeeded();
  await expect(page.locator(".flux-lines-canvas")).toHaveCount(0);
});
test("OS reduced motion works without requiring a stored preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".opening")).toHaveCount(0);
  await expect(page.locator(".story-stack")).toHaveClass(/static-stack/);
});
test("viewport widths do not create horizontal scrolling", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      )
      .toBe(true);
  }
});
test("scroll stack retains every chapter and real navigation targets", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".scroll-stack-card")).toHaveCount(3);
  for (const card of await page.locator(".chapter").all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator("h3")).toBeVisible();
  }
  const ids = await page
    .locator("[id]")
    .evaluateAll((nodes) => nodes.map((n) => n.id));
  expect(new Set(ids).size).toBe(ids.length);
  await page
    .getByRole("link", { name: "Get the Android app", exact: true })
    .click();
  await expect(page).toHaveURL(/#download$/);
  await expect(
    page.getByRole("link", { name: "Find Android releases", exact: true }),
  ).toBeInViewport();
});
test("FAQ and external download links are honest and actionable", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator("summary")
    .filter({ hasText: "Where can I download" })
    .click();
  await expect(page.locator("details[open]")).toContainText(
    "not an installable APK",
  );
  await expect(
    page.getByRole("link", { name: "Find Android releases", exact: true }),
  ).toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/releases");
  const drive = page.getByRole("link", {
    name: "Google Drive Alternate APK download",
    exact: true,
  });
  await expect(drive).toHaveAttribute(
    "href",
    "https://drive.google.com/drive/folders/1KYJ_1LPy3W5Ax5t4R0mw76Mr8xK9SDuS?usp=sharing",
  );
  await expect(drive).toHaveAttribute("target", "_blank");
  await expect(drive).toHaveAttribute("rel", "noopener noreferrer");
  await expect(drive).not.toHaveAttribute("download");
  await expect(page.locator("#drive-download-help")).toContainText(
    "Opens the APK folder",
  );
  await expect(
    page.getByRole("link", { name: "Android Studio source ZIP", exact: true }),
  ).toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/raw/refs/heads/main/downloads/Veyra_Android_Source_0.1.6_Stable.zip");
  await expect(page.locator(".source-track").first()).toContainText("Stable 0.1.6");
  await expect(page.getByRole("link", { name: "Stable change notes", exact: true })).toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/blob/main/RELEASE_NOTES_0.1.6.md");
  await expect(page.getByRole("link", { name: "Preview 0.1.7-beta1 source ZIP", exact: true }))
    .toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/raw/refs/heads/preview/0.1.7-beta1/downloads/Veyra_Android_Source_0.1.7-beta1.zip");
  await expect(page.getByRole("link", { name: "Stable source SHA-256 checksum", exact: true }))
    .toHaveAttribute("href", /0\.1\.6_Stable\.zip\.sha256$/);
  await expect(page.getByRole("link", { name: "Preview source SHA-256 checksum", exact: true }))
    .toHaveAttribute("href", /0\.1\.7-beta1\.zip\.sha256$/);
  await expect(page.getByRole("link", { name: "Preview change notes", exact: true }))
    .toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/blob/preview/0.1.7-beta1/RELEASE_NOTES_0.1.7-beta1.md");
  await expect(page.getByRole("link", { name: "Themes, icon picker & previews", exact: true }))
    .toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/blob/preview/0.1.7-beta1/themes/README.md");
  await expect(page.locator(".source-track-preview")).toContainText("for testing");
  await expect(page.getByRole("link",{ name:"Halloween theme ZIP (latest beta)",exact:true })).toHaveAttribute("href","https://github.com/Bhavishyadalal/Veyra/raw/refs/heads/preview/0.1.7-beta1/themes/packs/halloween-nocturne-v3.zip");
  await expect(page.getByRole("link",{ name:"Web Slinger theme ZIP (latest beta)",exact:true })).toHaveAttribute("href","https://github.com/Bhavishyadalal/Veyra/raw/refs/heads/preview/0.1.7-beta1/themes/packs/web-slinger-v1.zip");
  await expect(page.getByRole("link", { name: "Preview verification notes", exact: true }))
    .toHaveAttribute("href", "https://github.com/Bhavishyadalal/Veyra/blob/preview/0.1.7-beta1/verification/THEMES-0.1.7-beta1.md");
  await expect(page.locator(".download-note")).toContainText("not installable APKs");
});
test("mobile navigation opens, closes and restores keyboard focus", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "Mobile menu is not present on desktop.",
  );
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu", exact: true });
  await toggle.click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("link", { name: "Inside Veyra", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Open menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#inside$/);
});
test("landing and every preview screen pass automated accessibility checks", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  for (const tab of ["Home", "Player", "Lyrics", "Library"]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await expect(
      page.getByRole("tab", { name: tab, exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await page
    .getByRole("button", { name: "Open the hidden signal", exact: true })
    .click();
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});
test("supporting pages build and pass accessibility checks", async ({
  page,
}) => {
  for (const name of ["privacy", "credits"]) {
    await page.goto(`/${name}.html`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});
test("no-JavaScript page has a useful fallback", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const p = await context.newPage();
  await p.goto("http://127.0.0.1:4173");
  await expect(p.locator(".noscript-notice")).toBeVisible();
  await expect(
    p.getByRole("link", { name: "Find Veyra releases" }),
  ).toHaveAttribute("href", /releases$/);
  await context.close();
});

test("optional WebGL effects fail gracefully without breaking controls", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type, ...args);
    };
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Enter the experience", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Open the hidden signal", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: "Library", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Downloads");
  expect(errors).toEqual([]);
});

test("reel selection wraps, supports keyboard and carries mood into the player", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Next reel scene", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Show reel scene 2", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".reel-selected-copy")).toContainText(
    "Let a new world bloom.",
  );
  const current = page.getByRole("button", {
    name: "Show reel scene 2",
    exact: true,
  });
  await current.focus();
  await current.press("ArrowDown");
  await expect(
    page.getByRole("button", { name: "Show reel scene 3", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Next reel scene", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Show reel scene 1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Previous reel scene", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Explore this mood", exact: true })
    .click();
  await expect(page.getByRole("tabpanel")).toContainText("Orbit");
  await expect(
    page.getByRole("button", { name: /Deep space/ }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("vertical reel changes with pointer or touch gestures", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.locator(".reel-cards").scrollIntoViewIfNeeded();
  const box = await page.locator(".reel-card.is-current").boundingBox();
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  if (testInfo.project.name.startsWith("mobile")) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 8; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: y - i * 15 }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.detach();
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y - 120, { steps: 12 });
    await page.mouse.up();
  }
  await expect(
    page.getByRole("button", { name: "Show reel scene 2", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("hidden tuning dial unlocks the archive by keyboard and relocks", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open the hidden frequency", exact: true })
    .click();
  const dial = page.getByRole("slider", {
    name: "Tune the hidden frequency to 73.0 MHz",
    exact: true,
  });
  await dial.focus();
  for (let i = 0; i < 6; i++) await dial.press("ArrowRight");
  await expect(dial).toHaveAttribute(
    "aria-valuetext",
    "73.0 megahertz, signal found",
  );
  await expect(page.locator(".archive-reveal")).toContainText(
    "A moment that belongs to you.",
  );
  await dial.press("ArrowRight");
  await expect(page.locator(".archive-reveal")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("glass dock stays out of keyboard navigation before scrolling and navigates sections", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".glass-dock")).toHaveAttribute("inert", "");
  await page.locator("#reel").scrollIntoViewIfNeeded();
  await expect(page.locator(".glass-dock")).not.toHaveAttribute("inert", "");
  const dock = page.getByRole("navigation", {
    name: "Experience shortcuts",
    exact: true,
  });
  await dock.getByRole("link", { name: "Preview", exact: true }).click();
  await expect(page).toHaveURL(/#inside$/);
  await expect(page.getByRole("tabpanel")).toBeInViewport();
});

test("SplitText loads near the reel and reduced motion retains the complete heading", async ({
  page,
}) => {
  const assets = [];
  page.on("request", (r) => {
    if (/SplitText-.*\.js/.test(r.url())) assets.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator(".split-parent")).toHaveCount(0);
  await page.locator("#reel").scrollIntoViewIfNeeded();
  await expect(page.locator(".split-parent")).toBeVisible();
  await expect(page.locator(".reel-headline")).toContainText("There is more");
  expect(assets.length).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".split-parent")).toHaveCount(0);
  await expect(page.locator(".reel-headline")).toContainText("to hear.");
});

test("new reel, glass navigation and unlocked archive pass automated accessibility checks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#reel").scrollIntoViewIfNeeded();
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page
    .getByRole("button", { name: "Follow the transmission", exact: true })
    .click();
  await page.locator("#signal-frequency").fill("73");
  await expect(page.locator(".archive-reveal")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).analyze()).violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
