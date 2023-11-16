import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClassRangeService } from './classRange.service.js';
import { Roles } from '../auth/roles-auth.decorator.js';
import { RolesGuard, RolesGuardRequest } from '../auth/roles.guard.js';

interface ClassRangeGetListRequest extends RolesGuardRequest {}

@Controller('class_range')
export class ClassRangeController {
    constructor(private classRangeService: ClassRangeService) {}

    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Get('/')
    async get(@Req() req: ClassRangeGetListRequest) {
        return await this.classRangeService.getList(req.user.school.uuid);
    }
}
