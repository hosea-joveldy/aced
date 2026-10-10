import { test, expect } from '@playwright/test';

test.describe('Full-App QA Comprehensive Walkthrough (375px mobile)', () => {
  test('completes full student journey: join, board, add, edit, complete, subjects, history, revert, and leave', async ({
    page,
  }) => {
    // 1. Mobile viewport 375px
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 2. Join flow as Class Leader
    await expect(page.getByRole('heading', { name: /join your class board/i })).toBeVisible();
    await page.getByLabel(/email address/i).fill('leader@aced.school');
    await page.getByLabel(/your name/i).fill('Sam QA Walkthrough');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // 3. Board view & metrics
    await expect(page.getByRole('banner').getByText('Class of 2026 — Period 3')).toBeVisible();
    await expect(page.getByRole('heading', { name: /assignments & deadlines/i })).toBeVisible();

    const metricsStrip = page.getByLabel(/deadline summary metrics/i);
    await expect(metricsStrip.getByText('Overdue')).toBeVisible();
    await expect(metricsStrip.getByText('Due Today')).toBeVisible();
    await expect(metricsStrip.getByText('Needs Date')).toBeVisible();

    // 4. Create an assignment
    await page.getByRole('button', { name: /add assignment/i }).click();
    await expect(page.getByRole('heading', { name: /add new assignment/i })).toBeVisible();
    await page.getByLabel(/assignment title \*/i).fill('Comprehensive Chemistry Homework');
    await page.getByLabel(/due date/i).fill('2026-10-15');
    await page.getByLabel(/notes & instructions/i).fill('Covers stoichiometry problems');
    await page.getByRole('dialog').getByRole('button', { name: /add assignment/i }).click();

    await expect(page.getByText('Comprehensive Chemistry Homework')).toBeVisible();

    // 5. Toggle completion
    const asgCheckbox = page.getByRole('checkbox', {
      name: /mark "comprehensive chemistry homework" as complete/i,
    });
    await asgCheckbox.click();

    await expect(
      page.getByRole('checkbox', {
        name: /mark "comprehensive chemistry homework" as incomplete/i,
      })
    ).toBeVisible();

    // 6. Navigate to Subjects
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await nav.getByRole('link', { name: /subjects/i }).click();
    await expect(page.getByRole('heading', { name: /class subjects/i })).toBeVisible();
    await expect(page.getByText('AP Calculus BC')).toBeVisible();

    // 7. Navigate to History
    await nav.getByRole('link', { name: /history/i }).click();
    await expect(page.getByRole('heading', { name: /edit history & undo/i })).toBeVisible();
    await expect(page.getByText('Comprehensive Chemistry Homework').first()).toBeVisible();

    // 8. One-tap revert
    const revertBtn = page.getByRole('button', {
      name: /revert edit on comprehensive chemistry homework/i,
    }).first();
    await revertBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: /confirm revert/i })).toBeVisible();
    await dialog.getByRole('button', { name: /yes, revert edit/i }).click();
    await expect(dialog).not.toBeVisible();

    // 9. Leave Class
    await page.getByRole('button', { name: /leave class/i }).click();
    await expect(page.getByRole('heading', { name: /join your class board/i })).toBeVisible();
  });
});
