import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { Injectable, OnModuleInit } from "@nestjs/common"
import { env } from "@marcuth/env"

import { PrismaClient } from "../generated/prisma/client"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaBetterSqlite3({ url: env("DATABASE_URL") })
        super({ adapter: adapter })
    }

    async onModuleInit() {
        await this.$connect()
    }
}
