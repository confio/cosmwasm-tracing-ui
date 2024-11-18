import { expect, test } from "@playwright/test";
import txs from "../mocks/data/txs.json";

test("navigates to a correctly rendered tx detail", async ({ page }) => {
  //Mock API
  await page.route("*/**/api/v1/txs*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(txs),
    });
  });

  //Navigate to Tx list
  await page.goto("http://localhost:3000");

  //Navigate to Tx detail
  await page.getByText("d9ac77568024c6fe607b957b92dab853").click();

  await expect(
    page.getByText("transaction d9ac77568024c6fe607b957b92dab853"),
  ).toBeVisible();

  //Check that Mermaid renders
  //TODO: use non-image snapshot testing (for svg)
  await expect(
    page.getByText("layer1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmt53rug"),
  ).toHaveCount(1);

  await expect(
    page.getByText("layer1y6v4dtfpu5zatqgv8u7cnfwrg9cvr3chvqkv0a"),
  ).toHaveCount(1);

  await expect(page.getByText("Send").first()).toBeVisible();
});
