import { test, expect, Page } from '@playwright/test';
import { generatePassword, generateUsername } from '../utils/commonFunctions';
import { testCredentials } from '../utils/testCredentials';

test('Sign up, Login and Logout Functionality', async ({ page }: { page: Page }) => {
  test.setTimeout(60000); 
  const newUsername = generateUsername();
  const newPassword = generatePassword();

  //Sign up as existing user
  await page.goto('https://www.demoblaze.com/index.html');
  await page.waitForTimeout(3000); // Wait 3 seconds to see the page
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill(testCredentials.username);
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill(testCredentials.password);
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
     expect(dialog.message()).toBe('This user already exist.');
    dialog.dismiss().catch(() => {});
  });
  await page.getByLabel('Sign up').getByText('Close').click();

  //Sign up as a new user
  await page.reload();
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('');
  await expect(page.getByRole('textbox', { name: 'Username:' })).toHaveValue('');
  await page.getByRole('textbox', { name: 'Username:' }).fill(newUsername);
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('');
  await expect(page.getByRole('textbox', { name: 'Password:' })).toHaveValue('');
  await page.getByRole('textbox', { name: 'Password:' }).fill(newPassword);
  await page.getByRole('button', { name: 'Sign up' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    expect(dialog.message()).toBe('Sign up successful.');
    dialog.dismiss().catch(() => {});
  });
  await page.getByLabel('Sign up').getByText('Close').click();

  //Sign in as new user with wrong password
  await page.reload();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').click();
  await page.locator('#loginusername').fill('');
  await page.locator('#loginusername').click();
  await page.locator('#loginusername').fill(newUsername);
  await page.locator('#loginpassword').click();
  await page.locator('#loginpassword').fill('APassword');
  await page.getByRole('button', { name: 'Log in' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    expect(dialog.message()).toBe('Wrong password.');
    dialog.dismiss().catch(() => {});
  });
  await page.getByLabel('Log in').getByText('Close').click();

  //Sign in as user with correct password
  await page.reload();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').click();
  await page.locator('#loginusername').fill('');
  await page.locator('#loginusername').click();
  await page.locator('#loginusername').fill(newUsername);
  await page.locator('#loginpassword').click();
  await page.locator('#loginpassword').fill(newPassword);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('link', { name: 'Welcome ' + newUsername })).toBeVisible();
});
