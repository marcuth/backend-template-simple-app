import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsString, IsUUID } from "class-validator"

import { UserRole } from "../../generated/prisma/enums"

export class JwtAccessPayloadDto {
    @IsUUID()
    sub: string

    @IsEmail()
    email: string

    @IsEnum(UserRole)
    role: UserRole

    @IsString()
    @IsNotEmpty()
    name: string

    @IsIn(["access"])
    type: "access"
}
