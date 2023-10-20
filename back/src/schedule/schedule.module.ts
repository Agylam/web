import { forwardRef, Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { UserModule } from '../user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from '../entities/Lesson';

@Module({
    providers: [ScheduleService],
    controllers: [ScheduleController],
    imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Lesson])],
    exports: [ScheduleService],
})
export class ScheduleModule {}
