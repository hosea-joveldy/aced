import { test, expect } from '@playwright/test';

test.describe('Edit Attribution and Undo Flow', () => {
  test('lists edit history, opens confirmation dialog, and reverts an edit', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Join class
    await page.getByLabel(/your name/i).fill('Undo Tester');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Navigate to History screen
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await nav.getByRole('link', { name: /history/i }).click();

    // Check heading and attribution of seed edits
    await expect(
      page.getByRole('heading', { name: /edit history & undo/i })
    ).toBeVisible();

    await expect(page.getByText(/Alex M\./i)).toBeVisible();
    await expect(page.getByText(/Jordan K\./i)).toBeVisible();

    // Click revert on one of the edits
    const revertBtn = page
      .getByRole('button', { name: /revert edit on calculus problem set 4/i })
      .first();
    await revertBtn.click();

    // Verify confirmation dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: /confirm revert/i })
    ).toBeVisible();

    // Confirm revert
    await dialog.getByRole('button', { name: /yes, revert edit/i }).click();

    // Dialog closes
    await expect(dialog).not.toBeVisible();

    // Check Reverted badge appears
    await expect(page.getByText('Reverted').first()).toBeVisible();
  });
});
