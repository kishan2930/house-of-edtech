import fs from 'node:fs';

import mongoose from 'mongoose';
import { expect, test } from '@playwright/test';

function databaseUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  try {
    const text = fs.readFileSync('.env.local', 'utf8');
    const line = text
      .split('\n')
      .find((entry) => entry.startsWith('MONGODB_URI='));

    return line
      ?.slice('MONGODB_URI='.length)
      .trim()
      .replace(/^['"]|['"]$/g, '');
  } catch {
    return undefined;
  }
}

test('signed-out home redirects to sign in', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Kudos Wall' })).toBeVisible();
  await expect(page.getByText('Developer name')).toBeVisible();
});

test('sign up, sign in, and see an empty wall', async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto('/sign-up');
  await page.getByLabel('Name').fill('E2E Tester');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('User@1234');
  await page.getByLabel('Confirm password').fill('User@1234');
  await page.getByRole('button', { name: 'Sign up' }).click();

  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('User@1234');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Kudos Wall' })).toBeVisible();

  await page.goto('/my-kudos');
  await expect(page.getByText('You have not given Kudos yet.')).toBeVisible();
  await expect(
    page.getByText('You have not received Kudos yet.'),
  ).toBeVisible();
});

test.afterAll(async () => {
  const uri = databaseUri();

  if (!uri) {
    return;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
  await mongoose.connection.collection('users').deleteMany({
    email: /^e2e-\d+@example\.com$/,
  });
  await mongoose.disconnect();
});
