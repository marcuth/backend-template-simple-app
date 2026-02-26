import { Test, TestingModule } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"

import { UserRole } from "../generated/prisma/client"
import { UsersService } from "../users/users.service"
import { AuthService } from "./auth.service"

describe("AuthService", () => {
    let service: AuthService
    let usersService: UsersService
    let jwtService: JwtService

    const mockUsersService = {
        create: jest.fn(),
        findOne: jest.fn(),
        safeFindOneByEmail: jest.fn(),
        findOneByApiKey: jest.fn(),
        changePassword: jest.fn(),
    }

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    }

    const mockConfigService = {
        getOrThrow: jest.fn((key: string) => {
            if (key === "REFRESH_SIGN_EXPIRES_IN") return "30d"
            if (key === "JWT_PRIVATE_KEY") return "secret"
            return null
        }),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile()

        service = module.get<AuthService>(AuthService)
        usersService = module.get<UsersService>(UsersService)
        jwtService = module.get<JwtService>(JwtService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("signIn", () => {
        it("should return access and refresh tokens", async () => {
            const user = {
                id: "1",
                email: "test@example.com",
                username: "testuser",
                role: UserRole.USER,
                name: "Test User",
            } as any

            mockJwtService.sign.mockReturnValue("token")

            const result = await service.signIn(user)

            expect(result).toHaveProperty("accessToken")
            expect(result).toHaveProperty("refreshToken")
            expect(mockJwtService.sign).toHaveBeenCalledTimes(2)
        })
    })

    describe("validateUser", () => {
        it("should return user without password if valid", async () => {
            const user = {
                id: "1",
                email: "test@example.com",
                password: "hashed-password",
            } as any

            mockUsersService.safeFindOneByEmail.mockResolvedValue(user)
            const bcrypt = require("bcrypt")
            jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(true))

            const result = await service.validateUser("test@example.com", "password123")

            expect(result).not.toHaveProperty("password")
            expect(result?.email).toBe("test@example.com")
        })

        it("should return null if password invalid", async () => {
            const user = { id: "1", password: "hashed-password" } as any
            mockUsersService.safeFindOneByEmail.mockResolvedValue(user)
            const bcrypt = require("bcrypt")
            jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(false))

            const result = await service.validateUser("test@example.com", "wrong")

            expect(result).toBeNull()
        })
    })

    describe("validateApiKey", () => {
        it("should return user if api key is valid", async () => {
            const user = { id: "1", apiKey: "encrypted-key" } as any
            mockUsersService.findOneByApiKey.mockResolvedValue(user)

            const result = await service.validateApiKey("valid-api-key")

            expect(result).toEqual(user)
        })
    })
})
