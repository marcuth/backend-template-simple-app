import { SetMetadata } from "@nestjs/common"

import { UserRole } from "../../generated/prisma/enums"

export const ROLES_KEY = Symbol("roles")

export const Roles = (...roles: UserRole[]) => {
    return SetMetadata(ROLES_KEY, roles)
}
