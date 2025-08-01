import { APIRequestContext } from "@playwright/test";
import { AuthController } from "./auth-controller";

export class ApiControllers {
    public readonly auth: AuthController;

    constructor(request: APIRequestContext) {
        this.auth = new AuthController(request);;
    }
}