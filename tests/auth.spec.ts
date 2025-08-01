import { test, expect, request } from '@playwright/test';
import { registerResponseSchema, loginResponseSchema } from "../api/schemas/auth-schemas"
import { errorSchema } from '../api/schemas/error-schemas';
import { ApiControllers } from '../api/controllers/api-controllers';

import { generateUser } from '../helpers/generators';
import { expectToMatchSchema } from '../helpers/schema-validator';
import { faker } from '@faker-js/faker/locale/en_US';


let api: ApiControllers;

test.beforeAll("Setup API controllers", async ({}) => {
    const requestContext = await request.newContext();
    api = new ApiControllers(requestContext);
});

test.describe('[CHECKLY-1] Successful registration with valid data', async () => {
    test("Regular valid data", async ({}) => {
        const newUser = generateUser();
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);
    })

    test("Name with maximum length", async ({}) => {
        const newUser = generateUser();
        newUser.name = "a".repeat(32);
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);
    })

    test("Name with minimum length", async ({}) => {
        const newUser = generateUser();
        newUser.name = "Max";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);
    })

    test("Name Contains Hyphen", async ({}) => {
        const newUser = generateUser();
        newUser.name = "Max-Mustermann";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);
    })


    test("Email with Minimum Length", async ({}) => {
        const newUser = generateUser();
        newUser.email = `${faker.string.alpha(1)}@${faker.string.alpha(1)}.${faker.string.alpha(1)}` ;
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);
    })

    test("Email with Maximum Length", async ({}) => {
        const newUser = generateUser();
        newUser.email = faker.string.alpha(1).repeat(35) + `@${faker.string.alpha(1)}.` + faker.string.alpha(1).repeat(32);
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);  
    })

    test("Password with Minimum Length", async ({}) => {
        const newUser = generateUser();
        newUser.password = "123456Aa"
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema);  
    })

    test("Password with Maximum Length", async ({}) => {
        const newUser = generateUser();
        newUser.password = "Aa" + faker.string.numeric(1).repeat(30)
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 201").toBe(201);
        expectToMatchSchema(responseBody, registerResponseSchema); 
    })
})

test('[CHECKLY-2] Attempt to register with an already registered email', async () => {
    const newUser = generateUser();
    const successfulResponse = await api.auth.register(newUser.email, newUser.name, newUser.password);
    const successfulBody = await successfulResponse.json();
    expect(successfulResponse.status(), "Status Code should be 201").toBe(201);
    expectToMatchSchema(successfulBody, registerResponseSchema);  
    const failedResponse = await api.auth.register(newUser.email, newUser.name, newUser.password);
    const failedBody = await failedResponse.json();
    expect(failedResponse.status(), "Status Code should be 400").toBe(400);
    expectToMatchSchema(failedBody, errorSchema);
    expect(failedBody.message).toBe("Email already in use");
})

test.describe("[CHECKLY-3] Registration fails with invalid email format", async () => {
    test("Email without @", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Missing local part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "@domain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Missing domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test@";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Missing top-level domain", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test@domain";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Dot as first character of local part", async ({}) => {
        const newUser = generateUser();
        newUser.email = ".test@domain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Dot as last character of local part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test.@domain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Dot as first character of domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test@.domain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Dot as last character of domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test@domain.com.";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Repeated dots in local part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test..test@domain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Repeated dots in domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "testtest@domain..com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Hyphen as first character of domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test.test@-domain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Hyphen as last character of domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test.test@domain.com-";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })

    test("Invalid characters in domain part", async ({}) => {
        const newUser = generateUser();
        newUser.email = "test.test@dom_ain.com";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })
    
    test("Non-Latin character in the email address", async ({}) => {
        const newUser = generateUser();
        newUser.email = "屁股@混蛋.中国";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Invalid email format");
    })
})

test('[CHECKLY-4] Registration fails when email field is empty', async () => {
    const newUser = generateUser();
    newUser.email = "";
    const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
    const responseBody = await response.json();
    expect(response.status(), "Status Code should be 422").toBe(422);
    expectToMatchSchema(responseBody, errorSchema);
    expect(responseBody.message).toBe("Field is required");
})

test.describe('[CHECKLY-5] Registration fails when name as an invalid value', async () => {
    test("Name is empty", async ({}) => {
        const newUser = generateUser();
        newUser.name = "";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Field is required");
    })

    test("Name too short (less than 3 characters)", async () => {
        const newUser = generateUser();
        newUser.name = "Ma";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Name must have at least 3 characters and maximum of 32 characters");
    })

    test("Name too long (more than 32 characters)", async () => {
        const newUser = generateUser();
        newUser.name = "a".repeat(33);
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Name must have at least 3 characters and maximum of 32 characters");
    })

    test("Space as first character", async () => {
        const newUser = generateUser();
        newUser.name = " Max Mustermann";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Spaces and hyphens are allowed, as long as they are surrounded by letters");
    })

    test("Space as last character", async () => {
        const newUser = generateUser();
        newUser.name = "Max Mustermann ";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Spaces and hyphens are allowed, as long as they are surrounded by letters");
    })

    test("Hyphen as the first character", async () => {
        const newUser = generateUser();
        newUser.name = "-Max Mustermann";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Spaces and hyphens are allowed, as long as they are surrounded by letters");
    })

    test("Hyphen as the last character", async () => {
        const newUser = generateUser();
        newUser.name = "Max Mustermann-";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Spaces and hyphens are allowed, as long as they are surrounded by letters");
    })

    test("Invalid Characters: Non-Latin characters", async () => {
        const newUser = generateUser();
        newUser.name = "ジョン・ドウ";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Digits and special characters are not allowed");
    })

    test("Invalid Characters: Digits", async () => {
        const newUser = generateUser();
        newUser.name = "Max Mustermann123";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Digits and special characters are not allowed");
    })

    test("Invalid Characters: Special characters", async () => {
        const newUser = generateUser();
        newUser.name = "Max #Mustermann";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Digits and special characters are not allowed");
    })
})

test.describe("[CHECKLY-6] Registration fails with empty or weak password", async () => {
    test("Empty password", async ({}) => {
        const newUser = generateUser();
        newUser.password = "";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Field is required");
    })

    test("Password too short (less than 8 characters)", async () => {
        const newUser = generateUser();
        newUser.password = "1234567";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit");
    })

    test("Password too long (more than 32 characters)", async () => {
        const newUser = generateUser();
        newUser.password = "Aa123456789012345678901234567890123456";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit");
    })

    test("Password without lowercase letter", async () => {
        const newUser = generateUser();
        newUser.password = "123456AA";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit");
    })

    test("Password without uppercase letter", async () => {
        const newUser = generateUser();
        newUser.password = "123456aa";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit");
    })

    test("Password without digit", async () => {
        const newUser = generateUser();
        newUser.password = "AaBbCcDd";
        const response = await api.auth.register(newUser.email, newUser.name, newUser.password);
        const responseBody = await response.json();
        expect(response.status(), "Status Code should be 422").toBe(422);
        expectToMatchSchema(responseBody, errorSchema);
        expect(responseBody.message).toBe("Password should contain between 8 to 32 characters, at least one lowercase letter, one uppercase letter and one digit");
    })
})