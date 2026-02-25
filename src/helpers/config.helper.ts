import { ValidationPipe } from "@nestjs/common"
import { env } from "@marcuth/env"

const isProduction = process.env.NODE_ENV === "production"

export const configHelper = {
    isProduction: isProduction,
    isDevelopment: !isProduction,
    app: {
        metadata: {
            name: "Bolierplate",
            version: "0.0.1",
        },
        port: process.env.PORT || 3003,
        validationPipe: new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
        cors: {
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            origin: env("CORS_ORIGIN", false) || true,
            credentials: true,
        },
    },
    pagination: {
        minPage: 1,
        defaultPage: 1,
        minPerPage: 2,
        defaultPerPage: 20,
        maxPerPage: 50,
    },
    users: {
        apiKey: {
            prefix: "dev_",
            randomCharsLength: 32,
        },
        minNameLength: 3,
        maxNameLength: 100,
        minUsernameLength: 4,
        maxUsernameLength: 16,
        maxEmailLength: 150,
        generatedUsernameLength: 8,
    },
}
