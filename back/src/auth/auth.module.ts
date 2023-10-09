import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/RefreshToken.js';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h',
            },
        }),
        TypeOrmModule.forFeature([RefreshToken]),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
