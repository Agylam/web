import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/RefreshToken.js';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokensRepository: Repository<RefreshToken>,
    ) {}

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        const accessToken = await this.generateToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, uuid: user.uuid };
        return this.jwtService.sign(payload);
    }

    private async generateRefreshToken(user: User) {
        const refresh = new RefreshToken();
        refresh.user = user;
        await refresh.save();
        return refresh.uuid;
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.passwordHash);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    }
}
