import { expect, test } from "@playwright/test";

test("the opening shows only age, lifespan, health and three actions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.clock.install();
  await page.goto("/");
  await expect(page).toHaveTitle("Samsara Cultivator");
  await expect(page.getByTestId("scene").locator("canvas")).toBeVisible();

  await expect(page.getByRole("navigation", { name: "Main menu" }).getByRole("button")).toHaveText(["Overview"]);
  for (const hidden of [/realm/i, /\bqi\b/i, /stage/i, /cultivat/i]) {
    await expect(page.getByRole("main").getByText(hidden)).toHaveCount(0);
  }
  const health = page.getByRole("progressbar", { name: "Health" });
  await expect(health).toHaveAttribute("aria-valuenow", "30");
  await expect(page.getByText("30 / 30")).toBeVisible();

  const actions = page.getByRole("region", { name: "Actions" });
  await expect(actions.getByRole("button")).toHaveCount(3);

  // training hurts; the Character tab waits for the first Barehand level (ten in-game
  // months, covered by the sim tests), so it is still hidden after the first month
  await actions.getByRole("button", { name: /^Train/ }).click();
  await page.clock.runFor(6_000);
  await expect.poll(async () => Number(await health.getAttribute("aria-valuenow"))).toBeLessThan(30);
  await expect(page.getByRole("button", { name: "Character" })).toHaveCount(0);
  expect(errors).toEqual([]);
});
