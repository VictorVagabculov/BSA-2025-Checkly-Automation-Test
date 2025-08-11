import { faker } from '@faker-js/faker';

export const uniqueEmail = () => faker.internet.email().toLowerCase();

export const validPassword = (length = 12) => {
    // Guard length between 8 and 32 as per policy
    const len = Math.min(32, Math.max(8, length));

    const lower = faker.string.alpha({ length: 1, casing: 'lower' });
    const upper = faker.string.alpha({ length: 1, casing: 'upper' });
    const digit = faker.string.numeric({ length: 1 });

    const remaining = faker.string.alphanumeric({ length: len - 3 });

    const chars = (lower + upper + digit + remaining).split('');
    return faker.helpers.shuffle(chars).join('');
};

export const randomName = () => faker.person.firstName() + ' ' + faker.person.lastName();
