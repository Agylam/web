import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
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

    async updateRefreshToken(oldRefreshToken: string) {
        const oldRefreshTokenObj = await this.getRefreshToken(oldRefreshToken);
        if (oldRefreshTokenObj === null) {
            return null;
        } else {
            const accessToken = await this.generateToken(oldRefreshTokenObj.user);
            const refreshToken = await this.generateRefreshToken(oldRefreshTokenObj.user);
            return { accessToken, refreshToken };
        }
    }

    private async getRefreshToken(refreshToken: string) {
        return await this.refreshTokensRepository.findOne({
            where: {
                uuid: refreshToken,
                created_at: MoreThan(new Date(new Date().getTime() - 86400000)),
            },
            relations: {
                user: {
                    roles: true,
                    school: true,
                },
            },
        });
    }

    private async generateToken(user: User) {
        const payload = {
            email: user.email,
            uuid: user.uuid,
            roles: user.roles.map((r) => r),
            school: {
                uuid: user.school.uuid,
            },
            fullname: user.fullName,
        };
        return this.jwtService.sign(payload);
    }

    private async generateRefreshToken(user: User) {
        await this.refreshTokensRepository
            .createQueryBuilder('')
            .delete()
            .where('userUuid = :uuid', { uuid: user.uuid })
            .execute();

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
