import { Test, TestingModule } from "@nestjs/testing"

import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"

describe("AuthController", () => {
    let controller: AuthController
    let service: AuthService

    const mockAuthService = {
        signIn: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        changePassword: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockAuthService }],
        }).compile()

        controller = module.get<AuthController>(AuthController)
        service = module.get<AuthService>(AuthService)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })

    describe("signIn", () => {
        it("should call service.signIn", async () => {
            const req = { user: { id: "1" } } as any
            await controller.signIn(req)
            expect(service.signIn).toHaveBeenCalledWith(req.user)
        })
    })

    describe("signUp", () => {
        it("should call service.signUp", async () => {
            const dto = { email: "test@test.com" } as any
            await controller.signUp(dto)
            expect(service.signUp).toHaveBeenCalledWith(dto)
        })
    })

    describe("refreshToken", () => {
        it("should call service.refreshToken", async () => {
            const dto = { refreshToken: "token" }
            await controller.refreshToken("1", dto)
            expect(service.refreshToken).toHaveBeenCalledWith("1", dto)
        })
    })

    describe("getMe", () => {
        it("should return the user", async () => {
            const user = { id: "1", email: "test@test.com" } as any
            const result = await controller.getMe(user)
            expect(result).toEqual(user)
        })
    })

    describe("changePassword", () => {
        it("should call service.changePassword", async () => {
            const dto = { currentPassword: "old", newPassword: "new" }
            await controller.changePassword("1", dto)
            expect(service.changePassword).toHaveBeenCalledWith("1", "old", "new")
        })
    })
})
