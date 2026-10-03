import { expect, test } from "@playwright/test";

test("time passes when an action runs", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Samsara Cultivator");
  await expect(page.getByTestId("scene").locator("canvas")).toBeVisible();
  await expect(page.getByTestId("age")).toHaveText("Age 16 / 70");

  await page.getByRole("button", { name: "Pass 1 year" }).click();
  await expect(page.getByTestId("age")).toHaveText("Age 17 / 70");
});
