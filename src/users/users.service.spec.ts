import { ConflictException, NotFoundException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"

import { PrismaService } from "../prisma/prisma.service"
import { CryptoService } from "../crypto/crypto.service"
import { UserRole } from "../generated/prisma/client"
import { UsersService } from "./users.service"

describe("UsersService", () => {
    let service: UsersService
    let prisma: PrismaService
    let crypto: CryptoService

    const mockPrisma = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    }

    const mockCrypto = {
        encrypt: jest.fn(),
        decrypt: jest.fn(),
        hashPassword: jest.fn(),
        comparePasswords: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: CryptoService, useValue: mockCrypto },
            ],
        }).compile()

        service = module.get<UsersService>(UsersService)
        prisma = module.get<PrismaService>(PrismaService)
        crypto = module.get<CryptoService>(CryptoService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    describe("create", () => {
        const createUserDto = {
            email: "test@example.com",
            username: "testuser",
            name: "Test User",
            password: "password123",
            role: UserRole.USER,
        }

        it("should create a user successfully", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null)
            mockCrypto.encrypt.mockReturnValue("encrypted-api-key")
            mockCrypto.hashPassword.mockResolvedValue("hashed-password")

            const createdUser = { id: "1", ...createUserDto, password: "hashed-password", apiKey: "encrypted-api-key" }
            mockPrisma.user.create.mockResolvedValue(createdUser)

            const result = await service.create(createUserDto)

            expect(result).toEqual(createdUser)
            expect(mockPrisma.user.create).toHaveBeenCalled()
        })

        it("should throw ConflictException if user already exists", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ email: "test@example.com" })

            await expect(service.create(createUserDto)).rejects.toThrow(ConflictException)
        })
    })

    describe("findOne", () => {
        it("should return a user if found", async () => {
            const user = { id: "1", name: "Test User", email: "test@example.com" }
            mockPrisma.user.findUnique.mockResolvedValue(user)

            const result = await service.findOne("1")

            expect(result).toEqual(user)
        })

        it("should throw NotFoundException if user not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null)

            await expect(service.findOne("1")).rejects.toThrow(NotFoundException)
        })
    })

    describe("update", () => {
        it("should update a user successfully", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ id: "1" })
            mockPrisma.user.update.mockResolvedValue({ id: "1", name: "Updated Name" })

            const result = await service.update("1", { name: "Updated Name" })

            expect(result.name).toBe("Updated Name")
        })

        it("should throw NotFoundException if user to update is not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null)

            await expect(service.update("1", { name: "Name" })).rejects.toThrow(NotFoundException)
        })
    })

    describe("remove", () => {
        it("should remove a user successfully", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({ id: "1" })
            mockPrisma.user.delete.mockResolvedValue({ id: "1" })

            await expect(service.remove("1")).resolves.not.toThrow()
        })

        it("should throw NotFoundException if user to remove is not found", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null)

            await expect(service.remove("1")).rejects.toThrow(NotFoundException)
        })
    })
})
