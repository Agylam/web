import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/School.js';
import { Lesson } from './entities/Lesson.js';
import { Sound } from './entities/Sound.js';
import { ClassRange } from './entities/ClassRange.js';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/User.js';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './entities/RefreshToken.js';
import { UserController } from './user/user.controller.js';
import { ScheduleModule } from './schedule/schedule.module.js';
import { ScheduleController } from './schedule/schedule.controller.js';
import { Role } from './entities/Role.js';
import { ClassRangeModule } from './classRange/classRange.module.js';
import { ClassRangeController } from './classRange/classRange.controller.js';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.PGHOST || 'localhost',
            port: 5432,
            username: process.env.PGUSER || 'postgres',
            password: process.env.PGPASSWORD || 'postgres',
            database: process.env.PGDATABASE || 'postgres',
            synchronize: true,
            logging: false,
            entities: [School, Lesson, Sound, ClassRange, User, RefreshToken, Role],
            migrations: [],
            subscribers: [],
        }),
        AuthModule,
        ScheduleModule,
        ClassRangeModule,
    ],

    controllers: [AuthController, UserController, ScheduleController, ClassRangeController],
    providers: [],
})
export class AppModule {}
