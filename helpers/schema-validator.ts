import Ajv from 'ajv';
import { expect } from "@playwright/test";

const ajv = new Ajv({ strict: false});

export function expectToMatchSchema(responseBody: any, schema: object) {
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);

    expect(valid, "Response should match schema").toBe(true);

    if (!valid) {
        console.log("Schema errors:", validate.errors);
    }
}