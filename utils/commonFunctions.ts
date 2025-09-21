import { Page, expect } from '@playwright/test';
export function generatePassword() {
  const letters = Array.from({ length: 8 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Array.from({ length: 2 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const special = specialChars[Math.floor(Math.random() * specialChars.length)];
  // Shuffle the result for randomness
  const password = (letters + numbers + special)
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
  return password;
}

export function generateUsername() {
  const letters = Array.from({ length: 8 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join('');
  const numbers = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
  return `Automation${letters}${numbers}`;
}


export async function clearDialogBox(page: Page, triggerLocator: string, expectedMessage: string = 'Product added') {
  const [dialog] = await Promise.all([
    page.waitForEvent('dialog', { timeout: 5000 }), // ensure we capture the dialog
    page.getByRole('link', { name: triggerLocator }).click(), // trigger
  ]);

  console.log(`Dialog message: ${dialog.message()}`);
  console.log(`Expected message: ${expectedMessage}`);

  expect(dialog.message()).toContain(expectedMessage);
  await dialog.dismiss();
}
