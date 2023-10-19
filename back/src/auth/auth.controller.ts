import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken } = await this.authService.login(userDto);
        response.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { accessToken };
    }

    @Post('/refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken } = await this.authService.updateRefreshToken(req.cookies['refreshToken']);
        response.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { accessToken };
    }
}
