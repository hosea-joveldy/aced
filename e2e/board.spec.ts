import { test, expect } from '@playwright/test';

test.describe('Deadline Board Flow', () => {
  test('displays grouped assignments, filters by subject, and toggles completion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Join class
    await page.getByLabel(/email address/i).fill('riley@aced.school');
    await page.getByLabel(/your name/i).fill('Riley Board Tester');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Verify Board screen and metrics
    await expect(
      page.getByRole('heading', { name: /assignments & deadlines/i })
    ).toBeVisible();
    const metricsStrip = page.getByLabel(/deadline summary metrics/i);
    await expect(metricsStrip.getByText('Overdue')).toBeVisible();
    await expect(metricsStrip.getByText('Due Today')).toBeVisible();
    await expect(metricsStrip.getByText('Needs Date')).toBeVisible();

    // Check grouped headers
    await expect(page.getByRole('heading', { name: /^needs a date$/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /^overdue$/i })).toBeVisible();

    // Filter by AP Calculus BC
    await page.getByRole('button', { name: 'AP Calculus BC' }).click();
    await expect(page.getByText('Calculus Problem Set 4')).toBeVisible();
    await expect(page.getByText('Hamlet Essay Outline')).not.toBeVisible();

    // Reset filter
    await page.getByRole('button', { name: 'All Subjects' }).click();
    await expect(page.getByText('Hamlet Essay Outline')).toBeVisible();

    // Toggle completion on an assignment
    const calcCheckbox = page.getByRole('checkbox', {
      name: /mark "calculus problem set 4" as complete/i,
    });
    await calcCheckbox.click();

    // Verify it is now marked completed
    await expect(
      page.getByRole('checkbox', {
        name: /mark "calculus problem set 4" as incomplete/i,
      })
    ).toBeVisible();
  });
});
