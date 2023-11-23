import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { UserModule } from '../user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../entities/Lesson';
import { AuthModule } from '../auth/auth.module.js';
import { ClassRangeModule } from '../classRange/classRange.module';

@Module({
    providers: [ScheduleService],
    controllers: [ScheduleController],
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Lesson]),
        forwardRef(() => AuthModule),
        ClassRangeModule,
    ],
    exports: [ScheduleService],
})
export class ScheduleModule {}
