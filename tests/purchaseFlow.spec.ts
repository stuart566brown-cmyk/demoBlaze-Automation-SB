import { test, expect, Page } from '@playwright/test';
import { testCredentials } from '../utils/testCredentials';
import { clearDialogBox } from '../utils/commonFunctions';

//Function needed to handle issue with Dialog box not dismissing with a logged in user

async function cartAndPurchaseJourney(page: Page) {
  test.setTimeout(60000); 
  //Sign up as existing user
  await expect(page.getByRole('link', { name: 'CATEGORIES' })).toBeVisible();
  await page.getByRole('link', { name: 'Monitors' }).click();
  await page.getByRole('link', { name: 'Apple monitor' }).click();
  await expect(page.getByRole('heading', { name: 'Apple monitor' })).toBeVisible();
  await clearDialogBox(page, 'Add to cart', 'Product added');
  //Delete item from cart
  await page.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Apple monitor' })).toBeVisible();
  await page.getByRole('link', { name: 'Delete' }).click();
  await expect(page.getByRole('cell', { name: 'Apple monitor' })).not.toBeVisible();
  await page.getByRole('link', { name: 'Home' }).click();

  //Re-add item to cart
  await page.reload();
  await expect(page.getByRole('link', { name: 'CATEGORIES' })).toBeVisible();
  await page.getByRole('link', { name: 'Monitors' }).click();
  await page.getByRole('link', { name: 'Apple monitor' }).click();
  await expect(page.getByRole('heading', { name: 'Apple monitor' })).toBeVisible();
  await clearDialogBox(page, 'Add to cart', 'Product added');

  //Place order
  await expect (page.getByRole('link', { name: 'Cart', exact: true })).toBeVisible({timeout: 10000});
  await page.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Apple monitor' })).toBeVisible();

  //Purchase without entering name and credit card
  await page.getByRole('button', { name: 'Place Order' }).click();
  await expect(page.getByRole('heading', { name: 'Place order' })).toBeVisible();
   page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Purchase' }).click();
  await page.getByLabel('Place order').getByText('Close').click();

  //Purchase with name and credit card
  await expect(page.getByRole('cell', { name: 'Apple monitor' })).toBeVisible();
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('textbox', { name: 'Total: 400 Name:' }).click();
  await page.getByRole('textbox', { name: 'Total: 400 Name:' }).fill('username');
  await page.getByRole('textbox', { name: 'Credit card:' }).click();
  await page.getByRole('textbox', { name: 'Credit card:' }).fill('134');
  await page.getByRole('button', { name: 'Purchase' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();


}

test('Guest - Add items to cart and place order', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('https://www.demoblaze.com/index.html');
  await page.waitForTimeout(3000);
  await cartAndPurchaseJourney(page);
});


test('Logged in user - Add items to cart and place order', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('https://www.demoblaze.com/index.html');
  await page.waitForTimeout(3000);
  // Log in
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  await expect(page.locator('#loginusername')).toBeVisible({ timeout: 10000 });
  await page.locator('#loginusername').click();
  await page.locator('#loginusername').fill(testCredentials.username);
  await expect(page.locator('#loginpassword')).toBeVisible({ timeout: 10000 });
  await page.locator('#loginpassword').click();
  await page.locator('#loginpassword').fill(testCredentials.password );
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('link', { name: 'Welcome ' + testCredentials.username })).toBeVisible();

  await cartAndPurchaseJourney(page);
});