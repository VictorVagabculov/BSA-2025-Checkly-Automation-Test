import { test } from '../fixtures/sign-up-fixtures';
import { expectSuccessfulRegistration, expectRegistrationError } from '../helpers/auth-test-helpers';
import { faker } from '@faker-js/faker';

test.describe('[CHECKLY-1] Successful registration with valid data', () => {
    test('Regular valid data', async ({ api, validUser }) => {
        await expectSuccessfulRegistration(api, validUser.email, validUser.name, validUser.password);
    });

    test('Name with maximum length', async ({ api, validUser }) => {
        const longName = 'a'.repeat(32);
        await expectSuccessfulRegistration(api, validUser.email, longName, validUser.password);
    });

    test('Name with minimum length', async ({ api, validUser }) => {
        await expectSuccessfulRegistration(api, validUser.email, 'Max', validUser.password);
    });

    test('Name Contains Hyphen', async ({ api, validUser }) => {
        await expectSuccessfulRegistration(api, validUser.email, 'Max-Mustermann', validUser.password);
    });

    test('Email with Minimum Length', async ({ api, validUser }) => {
        const minEmail = `${faker.string.alpha(1)}@${faker.string.alpha(1)}.${faker.string.alpha(1)}`;
        await expectSuccessfulRegistration(api, minEmail, validUser.name, validUser.password);
    });

    test('Email with Maximum Length', async ({ api, validUser }) => {
        const maxEmail = `${faker.string.alpha(1).repeat(35)}@${faker.string.alpha(1)}.${faker.string.alpha(1).repeat(32)}`;
        await expectSuccessfulRegistration(api, maxEmail, validUser.name, validUser.password);
    });

    test('Password with Minimum Length', async ({ api, validUser }) => {
        await expectSuccessfulRegistration(api, validUser.email, validUser.name, '123456Aa');
    });

    test('Password with Maximum Length', async ({ api, validUser }) => {
        const maxPassword = 'Aa' + '7'.repeat(30);
        await expectSuccessfulRegistration(api, validUser.email, validUser.name, maxPassword);
    });
});

test('[CHECKLY-2] Attempt to register with an already registered email', async ({ api, validUser }) => {
    await expectSuccessfulRegistration(api, validUser.email, validUser.name, validUser.password);

    await expectRegistrationError(
        api,
        validUser.email,
        validUser.name,
        validUser.password,
        400,
        'Email already in use',
    );
});

test.describe('[CHECKLY-3] Registration fails with invalid email format', () => {
    const invalidEmailTests = [
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

    for (const testCase of invalidEmailTests) {
        test(testCase.name, async ({ api, validUser }) => {
            await expectRegistrationError(
                api,
                testCase.value,
                validUser.name,
                validUser.password,
                422,
                'Invalid email format',
            );
        });
    }
});

test('[CHECKLY-4] Registration fails when email field is empty', async ({ api, validUser }) => {
    await expectRegistrationError(api, '', validUser.name, validUser.password, 422, 'Field is required');
});

test.describe('[CHECKLY-5] Registration fails when name as an invalid value', () => {
    const invalidNameTests = [
        { name: 'Name is empty', value: '', errorMessage: 'Field is required' },
        {
            name: 'Name is too short (less than 3 characters)',
            value: 'Ma',
            errorMessage: 'Name must have at least 3 characters and maximum of 32 characters',
        },
        {
            name: 'Name is too long (more than 32 characters)',
            value: 'a'.repeat(33),
            errorMessage: 'Name must have at least 3 characters and maximum of 32 characters',
        },
        {
            name: 'Space as first character',
            value: ' Max',
            errorMessage: 'Spaces and hyphens are allowed, as long as they are surrounded by letters',
        },
        {
            name: 'Space as last character',
            value: 'Max ',
            errorMessage: 'Spaces and hyphens are allowed, as long as they are surrounded by letters',
        },
        {
            name: 'Hyphen as first character',
            value: '-Max',
            errorMessage: 'Spaces and hyphens are allowed, as long as they are surrounded by letters',
        },
        {
            name: 'Hyphen as last character',
            value: 'Max-',
            errorMessage: 'Spaces and hyphens are allowed, as long as they are surrounded by letters',
        },
        {
            name: 'Invalid Characters #1 - Non Latin Characters',
            value: 'Максим',
            errorMessage: 'Digits and special characters are not allowed',
        },
        {
            name: 'Invalid Characters #2 - Special Characters',
            value: 'Max #Mustermann',
            errorMessage: 'Digits and special characters are not allowed',
        },
        {
            name: 'Invalid Characters #3 - Digits',
            value: 'Max123',
            errorMessage: 'Digits and special characters are not allowed',
        },
    ];

    for (const testCase of invalidNameTests) {
        test(testCase.name, async ({ api, validUser }) => {
            await expectRegistrationError(
                api,
                validUser.email,
                testCase.value,
                validUser.password,
                422,
                testCase.errorMessage,
            );
        });
    }
});

test.describe('[CHECKLY-6] Registration fails with empty or weak password', () => {
    const invalidPasswordTests = [
        { name: 'Password is empty', value: '', errorMessage: 'Field is required' },
        {
            name: 'Password is too short (less than 8 characters)',
            value: '12345Ab',
            errorMessage:
                'Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit',
        },
        {
            name: 'Password is too long (more than 32 characters)',
            value: '1A' + 'a'.repeat(31),
            errorMessage:
                'Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit',
        },
        {
            name: 'Password does not contain lowercase letter',
            value: '123456AB',
            errorMessage:
                'Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit',
        },
        {
            name: 'Password does not contain uppercase letter',
            value: '123456ab',
            errorMessage:
                'Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit',
        },
        {
            name: 'Password does not contain digit',
            value: 'Abcdefgh',
            errorMessage:
                'Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit',
        },
    ];

    for (const testCase of invalidPasswordTests) {
        test(testCase.name, async ({ api, validUser }) => {
            await expectRegistrationError(
                api,
                validUser.email,
                validUser.name,
                testCase.value,
                422,
                testCase.errorMessage,
            );
        });
    }
});
