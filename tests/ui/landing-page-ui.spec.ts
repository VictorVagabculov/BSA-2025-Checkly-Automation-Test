import { test, expect } from '../fixtures/base-fixtures';

test.describe("Landing Page", () => {

  test.beforeEach("Navigate to the landing page", async ({ page }) => {
    await page.goto('/');
  });

  test("Has title Checkly", async ({ page }) => {
    await expect(page).toHaveTitle("Checkly");
  });

  test('header contains page name, logo, and links', async ({ page }) => {
    
    const headerTitle = page.locator('header a', { hasText: "Checkly" });
    await expect(headerTitle).toBeVisible();

    const headerLogo = headerTitle.locator("img");
    await expect(headerLogo).toBeVisible();
    await expect(headerLogo).toHaveAttribute("alt", "Binary Checkly web-application logo")
    
    const startQuiz = page.getByRole("link", { name: "Start quiz" });
    await expect(startQuiz).toBeVisible();
    await expect(startQuiz).toHaveAttribute('href', '/');

    const signIn = page.getByRole("link", { name: "Sign in" });
    await expect(signIn).toBeVisible();
    await expect(signIn).toHaveAttribute("href", "/sign-in")

  });
  
  test.skip("Sign in button navigates to the sign-in page", async ({ page }) => {
        
    await page.getByRole("link", { name: "Sign in" }).click();
  })
  

  test.skip("Hero section elements", async ({ page }) => {
    await page;
  });

  test.skip("How it Works", async ({ page }) => {
    await page;
  });

  test.skip("Categories", async ({ page }) => {
    await page;
  });

    test.skip("Layuots", async ({ page }) => {
    await page;
  });

  test.skip("Testimonials", async ({ page }) => {
    await page;
  });

  test.skip("Footer", async ({ page }) => {
    await page;
  });


});



