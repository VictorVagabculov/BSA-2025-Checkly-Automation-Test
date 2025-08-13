import { expect, Locator } from '@playwright/test';

//Assert all elements in a locator are visible

export async function expectAllVisible(locator: Locator): Promise<void> {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
        await expect(locator.nth(i)).toBeVisible();
    }
}

//Assert all elements in a locator have a given attribute value

export async function expectAllHaveAttribute(locator: Locator, attr: string, value: string): Promise<void> {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
        await expect(locator.nth(i)).toHaveAttribute(attr, value);
    }
}

// Assert multiple named links exist in a container and have expected hrefs

export async function expectNamedLinks(container: Locator, links: { name: string; href: string }[]): Promise<void> {
    for (const { name, href } of links) {
        const link = container.getByRole('link', { name });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', href);
    }
}

// Assert that a locator has an exact number of elements

export async function expectCount(locator: Locator, expectedCount: number): Promise<void> {
    const actualCount = await locator.count();
    expect(actualCount, `Expected ${expectedCount} elements but found ${actualCount}`).toBe(expectedCount);
}

// These assertions weren't implemented in Landing page tests in order to have better traceability in playwright's UI.
// For now, they'll remain here for later use if needed. 
// https://playwright.dev/docs/best-practices
