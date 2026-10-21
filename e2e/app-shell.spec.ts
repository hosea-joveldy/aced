import { test, expect } from '@playwright/test';

test.describe('App Shell and Identity Flow', () => {
  test('allows student to see landing page, join class, and navigate on mobile viewport (375px)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify initial Landing page
    await expect(
      page.getByRole('heading', { name: /introducing aced/i })
    ).toBeVisible();
    await expect(page.getByText(/crowdsourced deadlines for your entire class/i)).toBeVisible();

    // Click CTA to join class
    await page.getByRole('button', { name: /join with code/i }).first().click();

    // Verify join form screen
    await expect(
      page.getByRole('heading', { name: /join your class board/i })
    ).toBeVisible();

    // Fill demo credentials
    await page.getByLabel(/email address/i).fill('alex.student@aced.school');
    await page.getByLabel(/your name/i).fill('Alex Student');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    // Verify successful join and dashboard rendering
    await expect(page.getByRole('banner').getByText('Class of 2026 — Period 3')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /assignments & deadlines/i })
    ).toBeVisible();

    // Verify bottom tab bar items
    const nav = page.getByRole('navigation', { name: /main navigation/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /board/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /subjects/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /history/i })).toBeVisible();

    // Navigate to Subjects
    await nav.getByRole('link', { name: /subjects/i }).click();
    await expect(
      page.getByRole('heading', { name: /class subjects/i })
    ).toBeVisible();

    // Navigate to History
    await nav.getByRole('link', { name: /history/i }).click();
    await expect(
      page.getByRole('heading', { name: /edit history & undo/i })
    ).toBeVisible();

    // Leave class
    await page.getByRole('button', { name: /leave class/i }).click();
    await expect(
      page.getByRole('heading', { name: /join your class board/i })
    ).toBeVisible();
  });

  test('adapts layout cleanly on desktop viewport (1280px)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/#/join');

    await page.getByLabel(/email address/i).fill('desktop@aced.school');
    await page.getByLabel(/your name/i).fill('Desktop Student');
    await page.getByLabel(/class code/i).fill('ACED2026');
    await page.getByRole('button', { name: /enter class/i }).click();

    await expect(page.getByRole('banner').getByText('Class of 2026 — Period 3')).toBeVisible();
    await expect(page.getByText('Desktop Student')).toBeVisible();
  });

  test('allows student to create a new class and automatically become class leader', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Click Create a class on landing page
    await page.getByRole('button', { name: /create a class/i }).first().click();

    await expect(page.getByRole('heading', { name: /create a new class/i })).toBeVisible();

    await page.getByLabel(/class name/i).fill('AP Biology 2027');
    await page.getByLabel(/email address/i).fill('creator@aced.school');
    await page.getByLabel(/your name/i).fill('Jane Creator');
    await page.getByRole('button', { name: /create class & become leader/i }).click();

    // Check header displays the new class name and leader badge
    await expect(page.getByRole('banner').getByText('AP Biology 2027')).toBeVisible();
    await expect(page.getByText('Leader').first()).toBeVisible();
  });
});
