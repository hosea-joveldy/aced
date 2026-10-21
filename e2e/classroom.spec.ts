import { test, expect } from '@playwright/test';

test.describe('Classroom Import Feature Flag Gating', () => {
  test('ensures Classroom Import UI is completely absent from DOM when flag is off', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/#/join');

    // Join class
    await page.getByLabel(/email address/i).fill('flag@aced.school');
    await page.getByLabel(/your name/i).fill('Flag Tester');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Verify board renders
    await expect(
      page.getByRole('heading', { name: /assignments & deadlines/i })
    ).toBeVisible();

    // Verify Classroom Import button is not in DOM
    await expect(page.locator('[data-testid="classroom-import-button"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /classroom import/i })).toHaveCount(0);
  });
});
