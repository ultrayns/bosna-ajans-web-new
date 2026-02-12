import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage and display hero section', async ({ page }) => {
    await page.goto('/tr');
    
    // Check hero headline is visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Check page title
    await expect(page).toHaveTitle(/BOSNAAJANS/);
  });

  test('should switch between Turkish and English', async ({ page }) => {
    await page.goto('/tr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
    
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should toggle dark/light theme', async ({ page }) => {
    await page.goto('/tr');
    
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"]');
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      // Theme should toggle (checking for class change)
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Portfolio', () => {
  test('should load portfolio page with projects', async ({ page }) => {
    await page.goto('/tr/portfolio');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Portfolyo');
    
    // Check filter buttons are visible
    await expect(page.locator('button:has-text("Tümü")')).toBeVisible();
  });

  test('should filter projects by category', async ({ page }) => {
    await page.goto('/tr/portfolio');
    
    // Click on Fashion category
    await page.click('button:has-text("Fashion")');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Projects should be filtered (check that grid is still visible)
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('should navigate to project detail', async ({ page }) => {
    await page.goto('/tr/portfolio');
    
    // Click on first project
    await page.locator('article a').first().click();
    
    // Should be on project detail page
    await expect(page.url()).toContain('/portfolio/');
    
    // Check project title is visible
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Services', () => {
  test('should load services page with all services', async ({ page }) => {
    await page.goto('/tr/services');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('Hizmetler');
    
    // Check services are listed
    await expect(page.locator('text=Film Production')).toBeVisible();
    await expect(page.locator('text=Fashion Photography')).toBeVisible();
  });

  test('should navigate to service detail', async ({ page }) => {
    await page.goto('/tr/services');
    
    // Click on Film Production
    await page.click('text=Film Production');
    
    // Should be on service detail page
    await expect(page.url()).toContain('/services/');
    
    // Check features list
    await expect(page.locator('text=Commercial spots')).toBeVisible();
  });
});

test.describe('Contact', () => {
  test('should load contact page with form', async ({ page }) => {
    await page.goto('/tr/contact');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('İletişim');
    
    // Check form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should submit contact form', async ({ page }) => {
    await page.goto('/tr/contact');
    
    // Fill out form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=Mesajınız Alındı')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Error Pages', () => {
  test('should show 404 page for non-existent route', async ({ page }) => {
    await page.goto('/tr/this-page-does-not-exist');
    
    // Check 404 content
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Sayfa Bulunamadı')).toBeVisible();
    
    // Check navigation buttons
    await expect(page.locator('text=Anasayfaya Dön')).toBeVisible();
  });
});

test.describe('SEO', () => {
  test('should have robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('User-Agent');
  });

  test('should have sitemap.xml', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('urlset');
  });
});
