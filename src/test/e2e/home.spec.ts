import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('PaalStack');
  });

  test('renders the feature grid', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Next.js 16 App Router')).toBeVisible();
    await expect(page.getByText('TanStack Query')).toBeVisible();
    await expect(page.getByText('Zustand')).toBeVisible();
  });

  test('navigates to about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('About');
  });

  test('health API returns ok', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('timestamp');
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page not found')).toBeVisible();
  });
});
