import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common"

import { LocalAuthenticatedRequest } from "./interfaces/local-authenticated-request.interface"
import { JwtAuthenticatedUser } from "./interfaces/jwt-authenticated-request.interface"
import { JwtRefreshTokenAuthGuard } from "./guards/jwt-refresh-token.guard"
import { InjectUser } from "./decorators/inject-user.decorator"
import { ChangePasswordDto } from "./dto/change-password.dto"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { SignUpDto } from "./dto/sign-up.dto"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("sign-in")
    @UseGuards(LocalAuthGuard)
    async signIn(@Req() req: LocalAuthenticatedRequest) {
        return await this.authService.signIn(req.user)
    }

    @Post("sign-up")
    async signUp(@Body() singUpDto: SignUpDto) {
        return await this.authService.signUp(singUpDto)
    }

    @Post("refresh-token")
    @UseGuards(JwtRefreshTokenAuthGuard)
    async refreshToken(@InjectUser("id") userId: string, @Body() refreshTokenDto: RefreshTokenDto) {
        return await this.authService.refreshToken(userId, refreshTokenDto)
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    async getMe(@InjectUser() user: JwtAuthenticatedUser) {
        return user
    }

    @Post("change-password")
    @UseGuards(JwtAuthGuard)
    async changePassword(@InjectUser("id") userId: string, @Body() changePasswordDto: ChangePasswordDto) {
        return await this.authService.changePassword(
            userId,
            changePasswordDto.currentPassword,
            changePasswordDto.newPassword,
        )
    }
}
