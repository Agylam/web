import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller.js';
import { ScheduleModule } from './schedule/schedule.module.js';
import { ScheduleController } from './schedule/schedule.controller.js';
import { ClassRangeModule } from './classRange/classRange.module.js';
import { ClassRangeController } from './classRange/classRange.controller.js';
import { typeOrmConfig } from './db.config';
import { AnnouncementController } from './announcement/announcement.controller';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        ScheduleModule,
        ClassRangeModule,
        AnnouncementModule,
    ],
    controllers: [AuthController, UserController, ScheduleController, ClassRangeController, AnnouncementController],
    providers: [],
})
export class AppModule {}
