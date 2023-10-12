import { IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsString({ message: 'Должно быть строкой' })
    readonly refreshToken: string;
}
