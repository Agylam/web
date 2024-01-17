import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service.js';
import { Roles } from '../auth/roles-auth.decorator.js';
import { RolesGuard, RolesGuardRequest } from '../auth/roles.guard.js';

interface AnnouncementCreateRequest extends RolesGuardRequest {}

@Controller('announcement')
export class AnnouncementController {
    constructor(private announcementService: AnnouncementService) {}

    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Post('/new')
    async update(@Req() req: AnnouncementCreateRequest) {
        const announcement = await this.announcementService.createAnnouncement({
            ...req.body,
            schoolUuid: req.user.school.uuid,
        });
        return {
            result: announcement,
        };
    }
}
