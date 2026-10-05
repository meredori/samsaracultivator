import { expect, test } from "@playwright/test";

test("cultivating gathers qi and passes time", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page).toHaveTitle("Samsara Cultivator");
  await expect(page.getByTestId("scene").locator("canvas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("age")).toHaveText("16 / 70");

  const qi = page.getByRole("progressbar", { name: /Qi toward/ });
  await expect(qi).toHaveAttribute("aria-valuenow", "0");

  await page.getByRole("button", { name: /Cultivate/ }).click();
  await expect.poll(async () => Number(await qi.getAttribute("aria-valuenow"))).toBeGreaterThan(0);

  await page.getByRole("button", { name: /Cultivating/ }).click();
  const stopped = await qi.getAttribute("aria-valuenow");
  await page.waitForTimeout(500);
  await expect(qi).toHaveAttribute("aria-valuenow", stopped!);
  expect(errors).toEqual([]);
});
