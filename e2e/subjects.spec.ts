import { test, expect } from '@playwright/test';

test.describe('Subjects Management Flow', () => {
  test('lists subjects, adds a new subject, and edits an existing subject', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Join class
    await page.getByLabel(/your name/i).fill('Sam Subject Tester');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Navigate to Subjects screen
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await nav.getByRole('link', { name: /subjects/i }).click();

    // Verify existing seed subjects are listed
    await expect(page.getByText('AP Calculus BC')).toBeVisible();
    await expect(page.getByText('Mr. Harrison')).toBeVisible();
    await expect(page.getByText('mat-401')).toBeVisible();

    // Add a new subject
    await page.getByRole('button', { name: /add subject/i }).click();
    await expect(
      page.getByRole('heading', { name: /add new subject/i })
    ).toBeVisible();

    await page.getByLabel(/subject name \*/i).fill('Music Theory');
    await page.getByLabel(/teacher name \*/i).fill('Mr. Chopin');
    await page.getByLabel(/google classroom code/i).fill('mus-101');
    await page.getByRole('dialog').getByRole('button', { name: /add subject/i }).click();

    // Verify newly added subject appears
    await expect(page.getByText('Music Theory')).toBeVisible();
    await expect(page.getByText('Mr. Chopin')).toBeVisible();
    await expect(page.getByText('mus-101')).toBeVisible();

    // Edit the subject
    await page.getByRole('button', { name: /edit music theory/i }).click();
    await expect(
      page.getByRole('heading', { name: /edit subject/i })
    ).toBeVisible();

    await page.getByLabel(/teacher name \*/i).fill('Dr. Beethoven');
    await page.getByRole('button', { name: /save changes/i }).click();

    await expect(page.getByText('Dr. Beethoven')).toBeVisible();
  });
});
