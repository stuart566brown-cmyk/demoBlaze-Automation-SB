import { test, expect, Page } from '@playwright/test';
import { testCredentials } from '../utils/testCredentials';

//Function needed to handle issue with Dialog box not dismissing with a logged in user

async function contactUsJourney(page: Page) {
  await expect(page.getByRole('link', { name: 'CATEGORIES' })).toBeVisible();
  await page.getByRole('link', { name: 'Contact' }).click();
  await expect(page.getByRole('heading', { name: 'New message' })).toBeVisible();
  await page.locator('#recipient-email').click();
  await page.locator('#recipient-email').fill('test@email.com');
  await page.locator('#recipient-email').press('Tab');
  await page.getByRole('textbox', { name: 'Contact Email: Contact Name:' }).fill('Bob');
  await page.getByRole('textbox', { name: 'Contact Email: Contact Name:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Message:' }).fill('Test Message');
  await page.waitForTimeout(5000); 
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: 'Send message' })).toBeEnabled();
  page.once('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    expect(dialog.message()).toBe('Thanks for the message!!');
    await dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Send message' }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('link', { name: 'CATEGORIES' })).toBeVisible();
}

test('Guest - Fill in Contact Form', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/index.html');
  await page.waitForTimeout(3000);
  await contactUsJourney(page);
});


test('Logged in user - Fill in Contact Form', async ({ page }) => {
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

  await contactUsJourney(page);
});