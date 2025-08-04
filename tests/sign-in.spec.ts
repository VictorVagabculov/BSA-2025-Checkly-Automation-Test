import { test } from './fixtures/base-fixtures';
import { expectSuccessfulRegistration, expectSuccessfulLogin, expectLoginError } from './helpers/auth-test-helpers';
import { faker } from '@faker-js/faker';
import { generateUser } from '../helpers/generators';

const user = {
    name: '',
    email: '',
    password: '',
};

test.beforeAll(async ({ api }) => {
    const newUser = generateUser();
    user.name = newUser.name;
    user.email = newUser.email;
    user.password = newUser.password;
    await expectSuccessfulRegistration(api, user.email, user.name, user.password);
});

test('[CHECKLY-37] Sign In API | Successful Login Attempt', async ({ api }) => {
    await expectSuccessfulLogin(api, user.email, user.password);
});

test('[CHECKLY-30] Sign In API | Unsuccessful Login Attempt - Wrong Password', async ({ api }) => {
    await expectLoginError(api, user.email, 'IncorrectPassword123', 401, 'Wrong password');
});

test('[CHECKLY-29] Sign In API | Unsuccessful Login Attempt - Unregistered Email', async ({ api }) => {
    await expectLoginError(api, faker.internet.email(), 'ValidPassword123', 404, 'User not found');
});

test('[CHECKLY-35] Sign In API | Empty Password Field', async ({ api }) => {
    await expectLoginError(api, user.email, '', 422, 'Field is required');
});

test('[CHECKLY-34] Sign In API | Empty Email Field', async ({ api }) => {
    await expectLoginError(api, '', 'ValidPassword123', 422, 'Field is required');
});

test.describe('[CHECKLY-36] Sign In API | Malformatted Email', async () => {
    const malformattedEmailTests = [
        { name: 'Email without @', value: 'test.com' },
        { name: 'Missing local part', value: '@domain.com' },
        { name: 'Missing domain part', value: 'test@' },
        { name: 'Missing top-level domain', value: 'test@domain' },
        { name: 'Dot as first character of local part', value: '.test@domain.com' },
        { name: 'Dot as last character of local part', value: 'test.@domain.com' },
        { name: 'Consecutive dots in local part', value: 'test..test@domain.com' },
        { name: 'Dot as first character of domain part', value: 'test@.domain.com' },
        { name: 'Dot as last character of domain part', value: 'test@domain.' },
        { name: 'Consecutive dots in domain part', value: 'test@domain..com' },
        { name: 'Space in local part', value: 'test test@domain.com' },
        { name: 'Space in domain part', value: 'test@domain com' },
        { name: 'Hyphen as first character of domain part', value: 'test@-domain.com' },
        { name: 'Hyphen as last character of domain part', value: 'test@domain-' },
        { name: 'Invalid characters in domain part', value: 'test@doma_in.com' },
        { name: 'Non-Latin characters #1', value: 'тест@домен.com' },
        { name: 'Non-Latin characters in domain part', value: '屁股@混蛋.中国' },
    ];

    for (const testCase of malformattedEmailTests) {
        test(testCase.name, async ({ api }) => {
            await expectLoginError(api, testCase.value, 'ValidPassword123', 422, 'Invalid email format');
        });
    }
});
