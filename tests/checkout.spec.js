import { test, expect } from '@playwright/test';

test('Complete checkout with 3 random items', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password1"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory/);

  const buttons = await page.locator('[data-test^="add-to-cart"]').all();
  const selected = buttons.sort(() => 0.5 - Math.random()).slice(0, 3);

  for (const btn of selected) {
    await btn.click();
  }

  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.cart_item')).toHaveCount(3);

  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('.complete-header'))
    .toHaveText('Thank you for your order!');
});
