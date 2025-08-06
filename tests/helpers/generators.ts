import { faker } from '@faker-js/faker';

const generateComplexPassword = (): string => {
    const length = faker.number.int({ min: 8, max: 32 });
    const lowercase = faker.string.alpha({ length: 1, casing: 'lower' });
    const uppercase = faker.string.alpha({ length: 1, casing: 'upper' });
    const digit = faker.string.numeric(1);
    const remaining = faker.internet.password({
        length: length - 3,
        memorable: false,
        pattern: /[a-zA-Z0-9!@#$%^&*]/,
    });

    const chars = (lowercase + uppercase + digit + remaining).split('');
    return faker.helpers.shuffle(chars).join('');
};

export const generateUser = () => {
    return {
        email: faker.internet.email(),
        password: generateComplexPassword(),
        name: `${faker.person.firstName()} ${faker.person.lastName()}`.replace("'", ''),
    };
};
