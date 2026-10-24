import { test, expect } from '@playwright/test';

test.describe('Subjects Management Flow', () => {
  test('lists subjects, adds a new subject, and edits an existing subject', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/join');

    // Join class
    await page.getByLabel(/email address/i).fill('sam.subjects@aced.school');
    await page.getByLabel(/your name/i).fill('Sam Subject Tester');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Navigate to Subjects screen
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await nav.getByRole('link', { name: /subjects/i }).click();

    // Verify existing seed subjects are listed
    await expect(page.getByText('AP Calculus BC')).toBeVisible();
    await expect(page.getByText('Mr. Harrison')).toBeVisible();

    // Add a new subject
    await page.getByRole('button', { name: /add subject/i }).click();
    await expect(
      page.getByRole('heading', { name: /add new subject/i })
    ).toBeVisible();

    await page.getByLabel(/subject name \*/i).fill('Music Theory');
    await page.getByLabel(/teacher name \*/i).fill('Mr. Chopin');
    await page.getByRole('dialog').getByRole('button', { name: /add subject/i }).click();

    // Verify newly added subject appears
    await expect(page.getByText('Music Theory')).toBeVisible();
    await expect(page.getByText('Mr. Chopin')).toBeVisible();

    // Edit the subject
    await page.getByRole('button', { name: /edit music theory/i }).click();
    await expect(
      page.getByRole('heading', { name: /edit subject/i })
    ).toBeVisible();

    await page.getByLabel(/teacher name \*/i).fill('Dr. Beethoven');
    await page.getByRole('button', { name: /save changes/i }).click();

    await expect(page.getByText('Dr. Beethoven')).toBeVisible();
  });

  test('records subject creation and deletion in history and allows class leader to rollback deletion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/join');

    // Join as class leader
    await page.getByLabel(/email address/i).fill('leader@aced.school');
    await page.getByLabel(/your name/i).fill('Leader Alex');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Navigate to Subjects
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await nav.getByRole('link', { name: /subjects/i }).click();

    // Add subject
    await page.getByRole('button', { name: /add subject/i }).click();
    await page.getByLabel(/subject name \*/i).fill('Astronomy');
    await page.getByLabel(/teacher name \*/i).fill('Dr. Hubble');
    await page.getByRole('dialog').getByRole('button', { name: /add subject/i }).click();

    await expect(page.getByText('Astronomy')).toBeVisible();
    await expect(page.getByText('Dr. Hubble')).toBeVisible();

    // Delete subject
    await page.getByRole('button', { name: /delete astronomy/i }).click();
    const deleteDialog = page.getByRole('dialog', { name: /delete subject\?/i });
    await expect(deleteDialog).toBeVisible();
    await deleteDialog.getByRole('button', { name: /^delete subject$/i }).click();
    await expect(page.getByText('Astronomy')).not.toBeVisible();

    // Navigate to History
    await nav.getByRole('link', { name: /history/i }).click();
    await expect(page.getByRole('heading', { name: /edit history & undo/i })).toBeVisible();

    // Check that Astronomy deletion is visible with Deleted Subject tag
    await expect(page.getByText('Astronomy').first()).toBeVisible();
    await expect(page.getByText('Deleted Subject')).toBeVisible();

    // Revert the deletion
    const revertBtn = page.getByRole('button', { name: /revert edit on astronomy/i }).first();
    await revertBtn.click();

    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole('button', { name: /yes, revert edit/i }).click();
    await expect(confirmDialog).not.toBeVisible();

    // Navigate back to Subjects and confirm Astronomy has been restored
    await nav.getByRole('link', { name: /subjects/i }).click();
    await expect(page.getByText('Astronomy')).toBeVisible();
    await expect(page.getByText('Dr. Hubble')).toBeVisible();
  });
});
