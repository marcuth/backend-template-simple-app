import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@prisma/client"
import { env } from "@marcuth/env"
import * as bcrypt from "bcrypt"
import * as crypto from "node:crypto"

const adapter = new PrismaBetterSqlite3({ url: env("DATABASE_URL") })
const prisma = new PrismaClient({ adapter: adapter })

function encryptApiKey(apiKey: string): string {
    const encryptionAlgorithm = env("ENCRYPTION_ALGORITHM")
    const encryptionKey = Buffer.from(env("ENCRYPTION_KEY"), "hex")
    const encryptionIv = Buffer.from(env("ENCRYPTION_IV"), "hex")
    const cipher = crypto.createCipheriv(encryptionAlgorithm, encryptionKey, encryptionIv)
    return `${cipher.update(apiKey, "utf8", "hex")}${cipher.final("hex")}`
}

const adminData = {
    username: env("ADMIN_DEFAULT_USERNAME"),
    email: env("ADMIN_DEFAULT_EMAIL"),
    name: env("ADMIN_DEFAULT_NAME"),
    password: env("ADMIN_DEFAULT_PASSWORD"),
    apiKey: env("ADMIN_DEFAULT_API_KEY"),
}

async function seedAdminUser() {
    console.log("Checking for existing admin user...")

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminData.email },
        select: { id: true },
    })

    if (existingAdmin) {
        console.log("Admin already exists!")
        return
    }

    console.log("Creating admin user...")

    const hashSalts = parseInt(env("BCRYPT_SALT_ROUNDS"))
    const hashedPassword = await bcrypt.hash(adminData.password, hashSalts)
    const encryptedApiKey = encryptApiKey(adminData.apiKey)

    await prisma.user.create({
        data: {
            name: adminData.name,
            username: adminData.username,
            email: adminData.email,
            role: "ADMIN",
            password: hashedPassword,
            apiKey: encryptedApiKey,
        },
    })

    console.log("Admin created successfully!")
}

async function main() {
    console.log("Starting database seeding...")

    try {
        await seedAdminUser()

        console.log("Database seeding completed successfully")
    } catch (error) {
        console.error("Seeding failed:", error)
        throw error
    } finally {
        console.log("Disconnecting Prisma client...")

        await prisma.$disconnect()

        console.log("Prisma client disconnected")
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error(error)
        process.exit(1)
    })
}
