import { test as base, Locator, Page } from '@playwright/test';

//export Locators for each segment of the page. Using "sectionSection" format for segments that have the <section> tag
export const test = base.extend<{
    page: Page;
    header: Locator;
    heroSection: Locator;
    howItWorksSection: Locator;
    categoriesSection: Locator;
    layoutsSection: Locator;
    testimonialsSection: Locator;
    footer: Locator;
}>({
    page: async ({ page }, use) => {
        await page.goto('/');
        await use(page);
    },

    header: async ({ page }, use) => {
        const section = page.locator('header');
        await use(section);
    },

    heroSection: async ({ page }, use) => {
        const section = page.locator('section', { hasText: /^create a personal development plan/i });
        await use(section);
    },

    howItWorksSection: async ({ page }, use) => {
        const section = page.locator('section', { hasText: /^how it works/i });
        await use(section);
    },

    categoriesSection: async ({ page }, use) => {
        const section = page.locator('section', { hasText: /^categories/i });
        await use(section);
    },

    layoutsSection: async ({ page }, use) => {
        const section = page.locator('section', { hasText: /^Sample visual layouts/i });
        await use(section);
    },

    testimonialsSection: async ({ page }, use) => {
        const section = page.locator('section', { hasText: /^testimonials/i });
        await use(section);
    },

    footer: async ({ page }, use) => {
        const footer = page.locator('footer');
        await use(footer);
    },
});
