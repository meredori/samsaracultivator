import { expect, test } from "@playwright/test";

test("the opening shows only age, lifespan, health and three actions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
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

  // training hurts and, at the first proficiency point, reveals the Character tab
  await actions.getByRole("button", { name: /^Train/ }).click();
  await expect(page.getByRole("button", { name: "Character" })).toBeVisible();
  expect(Number(await health.getAttribute("aria-valuenow"))).toBeLessThan(30);

  await actions.getByRole("button", { name: /^Training/ }).click();
  await page.getByRole("button", { name: "Character" }).click();
  await expect(page.getByRole("region", { name: "Proficiencies" })).toContainText("Barehand");
  expect(errors).toEqual([]);
});
