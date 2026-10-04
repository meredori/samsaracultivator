import { expect, test } from "@playwright/test";

test("component gallery renders and its interactive pieces work", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/components.html");
  await expect(page.getByRole("heading", { name: "Window and Panel Shells" })).toBeVisible();

  // modal opens, traps Escape, and closes
  await page.locator("#shells").getByRole("button", { name: "Open as modal" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Confirm Action" });
  await expect(dialog).toBeVisible();
  // Shift+Tab from the freshly opened dialog stays inside it
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  // hover tooltip appears on hover
  await page.getByRole("button", { name: "Hover me" }).hover();
  await expect(page.getByRole("tooltip", { name: /^Vitality/ })).toBeVisible();

  // inventory filter tabs filter the grid
  const inventory = page.locator("#inventory .sc-inventory");
  await inventory.getByRole("tab", { name: "Manuals" }).click();
  await expect(inventory.getByRole("button", { name: /Jade Slip/ })).toBeVisible();
  await expect(inventory.getByRole("button", { name: /Spirit Herb/ })).toHaveCount(0);

  expect(errors).toEqual([]);
});

test("component gallery fits a phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/components.html");
  await expect(page.getByRole("heading", { name: "Foundations" })).toBeVisible();
  const scrollWidth = await page.locator("html").evaluate((el) => el.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(390);
});

test("resource bars are named by their visible label", async ({ page }) => {
  await page.goto("/components.html");
  await expect(page.getByRole("progressbar", { name: "Vitality" })).toHaveAttribute("aria-valuenow", "72");
});

test("every progress bar has an accessible name", async ({ page }) => {
  await page.goto("/components.html");
  const bars = page.getByRole("progressbar");
  expect(await bars.count()).toBeGreaterThan(0);
  const unnamed = await bars.evaluateAll((els) =>
    els
      .filter((el) => {
        const ids = el.getAttribute("aria-labelledby")?.split(/\s+/) ?? [];
        const fromIds = ids.map((id: string) => el.ownerDocument.getElementById(id)?.textContent?.trim() ?? "").join("");
        return !el.getAttribute("aria-label")?.trim() && !fromIds;
      })
      .map((el) => el.outerHTML.slice(0, 120)),
  );
  expect(unnamed).toEqual([]);
});
