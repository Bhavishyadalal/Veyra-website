import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("veyra-v2-intro", "1"));
});
function mouseOnly(info) {
  test.skip(
    info.project.name.startsWith("mobile"),
    "Touch devices retain native behavior and do not render the decorative cursor.",
  );
}
test("custom cursor follows content and controls without intercepting input", async ({
  page,
}, info) => {
  mouseOnly(info);
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/veyra-cursor/);
  const ring = page.locator(".veyra-cursor-ring");
  await expect(ring).toHaveCount(1);
  await expect(ring).toHaveCSS("pointer-events", "none");
  await page.mouse.move(300, 300);
  await expect(ring).toHaveCSS("opacity", "1");
  const motion = page.getByRole("button", { name: /Motion on/ });
  await motion.hover();
  await expect(ring).toHaveAttribute("data-state", "link");
  expect(await motion.evaluate((el) => getComputedStyle(el).cursor)).toContain(
    "veyra-arrow.svg",
  );
  await motion.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.mouse.move(310, 315);
  await expect
    .poll(() => ring.evaluate((el) => el.style.transform))
    .toBe("translate3d(310px, 315px, 0px)");
  await page.keyboard.press("Tab");
  await expect(ring).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: /Motion off/ }).click();
  await page.locator("#reel").scrollIntoViewIfNeeded();
  await page.locator(".reel-card.is-current").hover();
  await expect(ring).toHaveAttribute("data-state", "drag");
});
test("cursor remains above native dialogs and survives their removal", async ({
  page,
}, info) => {
  mouseOnly(info);
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open the hidden frequency", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: /Close/ }).hover();
  expect(
    await page
      .locator(".veyra-cursor-ring")
      .evaluate((el) => el.parentElement.tagName),
  ).toBe("DIALOG");
  await dialog.getByRole("button", { name: /Close/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".veyra-cursor-ring")).toHaveCount(1);
  expect(
    await page
      .locator(".veyra-cursor-ring")
      .evaluate((el) => el.parentElement.tagName),
  ).toBe("BODY");
  await page.goto("/media.html");
  await page
    .getByRole("link", { name: "Preview Link-sharing card", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Close image preview", exact: true })
    .hover();
  expect(
    await page
      .locator(".veyra-cursor-ring")
      .evaluate((el) => el.parentElement.tagName),
  ).toBe("DIALOG");
  await page.keyboard.press("Escape");
  await expect(page.locator(".veyra-cursor-ring")).toHaveCSS("opacity", "0");
  expect(
    await page
      .locator(".veyra-cursor-ring")
      .evaluate((el) => el.parentElement.tagName),
  ).toBe("BODY");
});
test("supporting pages share the same cursor and touch layouts do not create it", async ({
  page,
}, info) => {
  for (const url of ["/privacy.html", "/credits.html", "/media.html"]) {
    await page.goto(url);
    if (info.project.name.startsWith("mobile"))
      await expect(page.locator(".veyra-cursor-ring")).toHaveCount(0);
    else {
      await expect(page.locator("html")).toHaveClass(/veyra-cursor/);
      await page.mouse.move(200, 200);
      await expect(page.locator(".veyra-cursor-ring")).toHaveCSS(
        "opacity",
        "1",
      );
    }
  }
});
test("forced colors restores the system cursor", async ({ page }, info) => {
  mouseOnly(info);
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/veyra-cursor/);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator("html")).not.toHaveClass(/veyra-cursor/);
  await expect(page.locator(".veyra-cursor-ring")).toHaveCount(0);
});
test("copy website link confirms only a successful clipboard write", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedVeyra = text;
        },
      },
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Copy website link", exact: true })
    .click();
  await expect(page.getByRole("status")).toHaveText("Website link copied.");
  expect(await page.evaluate(() => window.__copiedVeyra)).toBe(
    "https://veyra-website-mauve.vercel.app/",
  );
  await expect(
    page.getByRole("textbox", { name: "Website link to copy" }),
  ).toHaveCount(0);
});
test("clipboard denial offers a focused, selected manual copy field", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Permission denied");
        },
      },
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Copy website link", exact: true })
    .click();
  const input = page.getByRole("textbox", {
    name: "Website link to copy",
    exact: true,
  });
  await expect(input).toHaveValue("https://veyra-website-mauve.vercel.app/");
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((el) => el.selectionEnd - el.selectionStart),
  ).toBe(39);
  await expect(
    page.getByText("Website link copied.", { exact: true }),
  ).toHaveCount(0);
  if (!page.viewportSize() || page.viewportSize().width > 760) {
    await input.hover();
    await expect(page.locator(".veyra-cursor-ring")).toHaveAttribute(
      "data-state",
      "text",
    );
  }
});
