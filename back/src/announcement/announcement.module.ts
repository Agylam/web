import { forwardRef, Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from '../entities/Announcement.js';
import { UserModule } from '../user/user.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { School } from '../entities/School.js';

@Module({
    providers: [AnnouncementService],
    controllers: [AnnouncementController],
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Announcement, School]),
        forwardRef(() => AuthModule),
    ],
    exports: [AnnouncementService],
})
export class AnnouncementModule {}
