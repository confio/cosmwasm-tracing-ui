import { expect, test } from "@playwright/test";
import txs from "../../public/txs.json";

test("navigates to a correctly rendered tx detail", async ({ page }) => {
  //Mock API
  await page.route("*/**/api/v1/txs?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(txs),
    });
  });

  //Navigate to Tx list
  await page.goto("http://localhost:3000");

  //Navigate to Tx detail
  await page.getByText("f3f101d12e4b41e05dfd3bcc2aa7e206").click();

  await expect(
    page.getByText("transaction f3f101d12e4b41e05dfd3bcc2aa7e206"),
  ).toBeVisible();

  //Check that Mermaid renders
  //TODO: use non-image snapshot testing (for svg)
  await expect(
    page.getByText("slay3r1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmvk3r3j"),
  ).toHaveCount(1);

  await expect(
    page.getByText("slay3r1fqg7raeca9peg0zkfp629m92qnjrpyggd2cfgj"),
  ).toHaveCount(1);

  await expect(page.getByText("Send")).toBeVisible();
});
