import { expect, test } from "@playwright/test";

test("UI mockup renders and switches actions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/mockup.html");
  await expect(page.getByTestId("mockup-scene").locator("canvas")).toBeVisible();
  await expect(page.locator(".current-action")).toContainText("Cultivating");

  await page.locator(".action-card", { hasText: "Explore" }).click();
  await expect(page.locator(".current-action")).toContainText("Exploring");
  expect(errors).toEqual([]);
});
