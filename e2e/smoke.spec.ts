/**
 * E2E Smoke Tests
 *
 * 验证关键页面可访问、核心导航正常、API 健康检查通过。
 * 这些测试不需要认证，适合 CI 自动运行。
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {
  test('homepage loads and shows key elements', async ({ page }) => {
    await page.goto('/');
    // 页面标题存在
    await expect(page).toHaveTitle(/新岛|Niijima|新島/i);
    // 主导航存在
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('health screening page is accessible', async ({ page }) => {
    await page.goto('/health-checkup');
    await expect(page).toHaveURL(/health-checkup/);
    // 页面有内容（非空白页）
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    // 应该显示登录表单或登录相关UI
    await expect(page).toHaveURL(/login/);
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('guide partner page is accessible', async ({ page }) => {
    await page.goto('/guide-partner');
    await expect(page).toHaveURL(/guide-partner/);
  });

  test('FAQ page is accessible', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveURL(/faq/);
  });
});

test.describe('API Health Check', () => {
  test('GET /api/health returns status', async ({ request }) => {
    const response = await request.get('/api/health');
    // 即使部分服务不可用，也应该返回 200 或 503
    expect([200, 503]).toContain(response.status());

    const body = await response.json();
    expect(body.status).toBeDefined();
    expect(['healthy', 'degraded', 'unhealthy']).toContain(body.status);
    expect(body.checks).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });
});

test.describe('Static Pages', () => {
  test('privacy policy page loads', async ({ page }) => {
    await page.goto('/legal/privacy');
    await expect(page).toHaveURL(/legal\/privacy/);
  });

  test('terms of service page loads', async ({ page }) => {
    await page.goto('/legal/terms');
    await expect(page).toHaveURL(/legal\/terms/);
  });
});

test.describe('Medical Venue Pages', () => {
  test('hyogo medical page loads', async ({ page }) => {
    await page.goto('/hyogo-medical');
    await expect(page).toHaveURL(/hyogo-medical/);
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('cancer treatment page loads', async ({ page }) => {
    await page.goto('/cancer-treatment');
    await expect(page).toHaveURL(/cancer-treatment/);
  });
});
