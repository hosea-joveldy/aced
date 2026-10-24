import { test, expect } from '@playwright/test';

test.describe('Edit Attribution and Undo Flow', () => {
  test('lists edit history, verifies student cannot revert, and class leader reverts an edit', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/join');

    // 1. Join as regular student
    await page.getByLabel(/email address/i).fill('regular.student@aced.school');
    await page.getByLabel(/your name/i).fill('Student Viewer');
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

    // Verify regular student cannot see revert button
    await expect(
      page.getByText(/only the designated class leader can revert edits/i)
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /revert edit on calculus problem set 4/i })
    ).toHaveCount(0);

    // 2. Leave class and join as Class Leader
    await page.getByRole('button', { name: /leave class/i }).click();

    await page.getByLabel(/email address/i).fill('leader@aced.school');
    await page.getByLabel(/your name/i).fill('Leader Alex');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Verify leader badge in header
    await expect(page.getByRole('banner').getByText('Class of 2026 — Period 3')).toBeVisible();

    // Navigate to History screen
    await nav.getByRole('link', { name: /history/i }).click();

    // Verify Class Leader privileges banner
    await expect(page.getByText(/class leader privileges/i)).toBeVisible();

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

    // 3. Test multi-timestamp selection and batch revert as Class Leader
    const selectCheckboxes = page.getByRole('checkbox', { name: /select edit at/i });
    const count = await selectCheckboxes.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Select two remaining edits
    await selectCheckboxes.nth(0).check({ force: true });
    await selectCheckboxes.nth(1).check({ force: true });

    // Verify batch revert button shows count 2
    const batchRevertBtn = page.getByRole('button', { name: /revert selected \(2\)/i });
    await expect(batchRevertBtn).toBeVisible();
    await batchRevertBtn.click();

    // Verify batch confirmation dialog
    const batchDialog = page.getByRole('dialog');
    await expect(batchDialog).toBeVisible();
    await expect(batchDialog.getByRole('heading', { name: /confirm revert \(2 edits\)/i })).toBeVisible();

    // Confirm batch revert
    await batchDialog.getByRole('button', { name: /yes, revert 2 edits/i }).click();

    // Dialog closes and all edits are now reverted
    await expect(batchDialog).not.toBeVisible();
    await expect(page.getByText('Reverted', { exact: true })).toHaveCount(3);
  });
});
