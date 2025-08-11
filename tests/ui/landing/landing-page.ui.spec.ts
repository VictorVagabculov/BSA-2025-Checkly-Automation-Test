import { test } from '@ui/controllers/landing-navigation';
import { expect } from '@playwright/test';

test.describe('Page Title', async () => {
    test('Landing page has Checkly Title', async ({ page }) => {
        await expect(page).toHaveTitle('Checkly');
    });
    // Optional, check the presence of a favicon
    test.skip('Landing page has a favicon', async ({ page }) => {
        const favicon = page.locator('link[rel="icon"][type="image/x-icon"][href="/favicon.ico"]');
        await expect(favicon).toHaveCount(1);
    });
});

test.describe('Header', async () => {
    test('header contains page name', async ({ header }) => {
        await expect(header.getByText('Checkly')).toBeVisible();
    });

    test('header contains page logo', async ({ header }) => {
        const headerLogo = header.locator('img');
        await expect(headerLogo).toBeVisible();
        await expect(headerLogo).toHaveAttribute('alt', 'Binary Checkly web-application logo');
    });

    test('header Start Quiz and Sign in links', async ({ header }) => {
        await expect(header.getByRole('link', { name: 'Start quiz' })).toBeVisible();
        await expect(header.getByRole('link', { name: 'Sign in' })).toBeVisible();
    });

    test('Sign in button navigates to the sign-in page', async ({ page }) => {
        await page.getByRole('link', { name: 'Sign in' }).click();
        const heading = page.getByRole('heading', { name: 'Sign In' });
        await expect(heading).toBeVisible();
    });

    //Skipping until this function gets implemented.
    test.skip('Star Quiz button navigates to the sign-up page', async ({ page }) => {
        await page.getByRole('link', { name: 'Sign in' }).click();
        const heading = page.getByRole('heading', { name: 'Sign Up' });
        await expect(heading).toBeVisible();
    });
});

test.describe('Hero', async () => {
    test('Hero section has heading', async ({ heroSection }) => {
        const heroHeading = heroSection.getByRole('heading', {
            name: 'Create a personal development plan in 2 minutes',
        });
        await expect(heroHeading).toBeVisible();
    });

    test('Hero section has subtitle', async ({ heroSection }) => {
        const subtitle = heroSection.getByText(
            'AI-powered checklist generator for your goals — from fitness to creativity',
        );
        await expect(subtitle).toBeVisible();
    });

    test('Hero section has Start button', async ({ heroSection }) => {
        const startButton = heroSection.getByRole('link', { name: /^start$/i });
        await expect(startButton).toBeVisible();
        await expect(startButton).toHaveAttribute('href', '/');
    });

    test('Hero section has decorative images', async ({ heroSection }) => {
        const images = heroSection.locator('img'); //[class^="_icons-wrapper"] can be used for I rather avoid it
        await expect(images).toHaveCount(5);
        // await expect(images.nth(0)).toHaveAttribute('alt', ''); Optional for alt attribute
    });

    //Skipping until behavior is defined and implemented
    test.skip('Star button redirects to - page', async ({ heroSection }) => {

    });
});

test.describe('How it Works', async () => {
    test('How it Works has a title', async ({ howItWorksSection }) => {
        const howHeading = howItWorksSection.getByRole('heading', { name: 'How it works' });
        await expect(howHeading).toBeVisible();
    });

    test('How it Works has 3-step guide', async ({ howItWorksSection }) => {
        //Only works if they're in order in the html
        const stepsText = await howItWorksSection.textContent();
        expect(stepsText).toContain('1');
        expect(stepsText).toContain('Take the quiz');
        expect(stepsText).toContain('2');
        expect(stepsText).toContain('Get your plan');
        expect(stepsText).toContain('3');
        expect(stepsText).toContain('Download PDF or customize it');

        //Alternatively:
        // const steps = [
        //   { number: '1', title: 'Take the quiz' },
        //   { number: '2', title: 'Get your plan' },
        //   { number: '3', title: 'Download PDF or customize it' },
        // ];

        // for (const { number, title } of steps) {
        //   const stepNumber = page.locator(`text="${number}"`);
        //   const stepTitle = page.getByText(title, { exact: true });
        //   await expect(stepNumber).toBeVisible();
        //   await expect(stepTitle).toBeVisible();
        // }
    });

    test('How it Works has decorative images', async ({ howItWorksSection }) => {
        const croissantImg = howItWorksSection.locator('img[src*="croissant"]');
        const laptopImg = howItWorksSection.locator('img[src*="laptop"]');

        await expect(croissantImg).toBeVisible();
        await expect(laptopImg).toBeVisible();

        const arrows = howItWorksSection.locator('img[class*="arrow"]');
        const arrowCount = await arrows.count();
        expect(arrowCount).toBeGreaterThanOrEqual(2);
    });
});

test.describe('Categories', async () => {
    test('Categories has a title', async ({ categoriesSection }) => {
        const categoriesHeading = categoriesSection.getByRole('heading', { name: 'Categories' });
        await expect(categoriesHeading).toBeVisible();
    });

    test('Categories has 6 buttons', async ({ categoriesSection }) => {
        const categoriesButtons = categoriesSection.locator('button');
        await expect(categoriesButtons).toHaveCount(6);
    });

    test('Each button has their corresponding name and an image', async ({ categoriesSection }) => {
        const categoriesButtons = categoriesSection.locator('button');
        const categoriesTitles = ['personal development', 'spirituality', 'sport', 'money', 'creativity', 'hobby'];

        for (let i = 0; i < categoriesTitles.length; i++) {
            const button = categoriesButtons.nth(i);
            const h2 = button.locator('h3');
            const img = button.locator('img');

            await expect(h2).toHaveText(categoriesTitles[i]);
            await expect(img).toBeVisible(); //If alt is added and matches the category, it might be better to instead .toHaveAttribute('alt', categoriesTitles[i]); 
            await expect(button).toHaveAttribute('aria-pressed', /true|false/); //Check if buttons are clickable (optional)
        }
    });
});

test.describe('Layouts', async () => {
    test('Layouts section has a title', async ({ layoutsSection }) => {
        const layoutsHeading = layoutsSection.getByRole('heading', { name: 'Sample visual layouts' });
        await expect(layoutsHeading).toBeVisible();
    });

    test('Layouts has example cards', async ({ layoutsSection }) => {
        const layoutsCards = layoutsSection.locator('li'); //Alternatively ('[role="listitem"]') could be used if they change the attribute
        const count = await layoutsCards.count();
        expect(count).toBeGreaterThan(5);
    });

    test('Each card has and image and a name', async ({ layoutsSection }) => {
        const layoutsCards = layoutsSection.locator('li');
        const count = await layoutsCards.count();
        for (let i = 0; i < count; i++) {
            const card = layoutsCards.nth(i);
            const img = card.locator('img');

            await expect(img).toBeVisible();
            await expect(card.locator('h5')).toBeVisible();
        }

        // Optionals: Compare img with alt; aria-label check; match img alt with title. (add to the for loop)

        // await expect(img).toHaveAttribute('alt', /Preview of the/i);
        // await expect(card).toHaveAttribute('aria-label', /Visual layout option:/i); Optional
        // await expect(img).toHaveAttribute('alt', /Preview of the/i); Check img alt matches card title

        // Optional: Check each card title by matching their aria-label

        // for (let i = 0; i < count; i++) {
        //   const card = layoutsCards.nth(i);
        //   const ariaLabel = await card.getAttribute('aria-label');
        //   const expectedTitle = ariaLabel?.replace('Visual layout option: ', '').trim();
        //   const actualTitle = await card.locator('h5').textContent();
        //   const trimmedTitle = actualTitle?.trim();

        //   expect(trimmedTitle).toBe(expectedTitle);
        // }
    });
});

test.describe('Testimonials', async () => {
    test('Testimonials section has a title', async ({ testimonialsSection }) => {
        const testimonialsHeading = testimonialsSection.getByRole('heading', { name: 'Testimonials' });
        await expect(testimonialsHeading).toBeVisible();
    });

    test('Testimonials has at least 3 cards', async ({ testimonialsSection }) => {
        const testimonialsCards = testimonialsSection.locator('[class*="card"]');
        const count = await testimonialsCards.count();
        expect(count).toBeGreaterThanOrEqual(3);
    });

    test('Each card has some feedback, an avatar and a username', async ({ testimonialsSection }) => {
        const testimonialsCards = testimonialsSection.locator('[class*="card"]');
        const count = await testimonialsCards.count();
        for (let i = 0; i < count; i++) {
            const card = testimonialsCards.nth(i);

            const text = card.locator('p');
            await expect(text).not.toHaveText('');

            const avatar = card.locator('img');
            await expect(avatar).toBeVisible();
            // Optional check for alt names (because these images aren't highlighted):
            // await expect(avatar).toHaveAttribute('alt', /Roy|Emma|Joan/);

            const userName = card.locator('span');
            await expect(userName).toBeVisible();
        }
    });
});

test.describe('Footer', async () => {
    test('Footer has Checkly logo and text', async ({ footer }) => {
        await expect(footer.getByText('Checkly')).toBeVisible();
        const footerLogo = footer.locator('img[alt*="Checkly"]');
        await expect(footerLogo).toBeVisible();
    });

    test('Footer has legal texts', async ({ footer }) => {
        await expect(footer.getByText('Terms of Service')).toBeVisible();
        await expect(footer.getByText('Privacy Policy')).toBeVisible();
        await expect(footer.getByText('Contact Us')).toBeVisible();
    });

    test('Footer has 3 visible social media icons', async ({ footer }) => {
        const socialIcons = footer.locator('svg');
        const count = await socialIcons.count();
        expect(count).toBe(3);
        for (let i = 0; i < count; i++) {
            await expect(socialIcons.nth(i)).toBeVisible();
        }
    });

    //Change for corresponding links once they're added
    test('Footer elements have corresponding links', async ({ footer }) => {
        const legalLinks = [
            { name: 'Terms of Service', href: '/' },
            { name: 'Privacy Policy', href: '/' },
            { name: 'Contact Us', href: '/' },
        ];

        for (const { name, href } of legalLinks) {
            const link = footer.getByRole('link', { name });
            await expect(link, `${name} should be visible`).toBeVisible();
            await expect(link, `${name} should have correct href`).toHaveAttribute('href', href);
        }

        const socialLinks = footer.locator('nav[aria-label="Social links"] a');
        const count = await socialLinks.count();

        for (let i = 0; i < count; i++) {
            const link = socialLinks.nth(i);
            await expect(link).toBeVisible(); //This might be redundant
            await expect(link).toHaveAttribute('href', '/');
        }
    });
});
