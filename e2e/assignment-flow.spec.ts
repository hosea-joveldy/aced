import { test, expect } from '@playwright/test';

test.describe('Assignment Creation and Editing Flow', () => {
  test('creates new assignment, renders in correct group, and edits assignment', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Join class
    await page.getByLabel(/email address/i).fill('morgan@aced.school');
    await page.getByLabel(/your name/i).fill('Morgan Assignment Tester');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Open Add Assignment Modal
    await page.getByRole('button', { name: /add assignment/i }).click();
    await expect(
      page.getByRole('heading', { name: /add new assignment/i })
    ).toBeVisible();

    // Fill form without due date (should land in "Needs a date" group)
    await page.getByLabel(/assignment title \*/i).fill('New Group Project Draft');
    await page.getByLabel(/notes & instructions/i).fill('Divide sections into teams');
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /add assignment/i })
      .click();

    // Verify it appears in Needs a date group
    await expect(page.getByText('New Group Project Draft')).toBeVisible();

    // Edit the assignment
    await page
      .getByRole('button', { name: /edit new group project draft/i })
      .click();

    await expect(
      page.getByRole('heading', { name: /edit assignment/i })
    ).toBeVisible();

    await page
      .getByLabel(/assignment title \*/i)
      .fill('Updated Group Project Draft');

    await page
      .getByRole('dialog')
      .getByRole('button', { name: /save changes/i })
      .click();

    // Verify updated title
    await expect(page.getByText('Updated Group Project Draft')).toBeVisible();
  });
});
