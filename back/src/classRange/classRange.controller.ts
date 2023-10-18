import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ClassRangeService } from './classRange.service.js';
import { Roles } from '../auth/roles-auth.decorator.js';
import { RolesGuard, RolesGuardBody } from '../auth/roles.guard.js';

interface ClassRangeGetListBody extends RolesGuardBody {}

@Controller('class_range')
export class ClassRangeController {
    constructor(private classRangeService: ClassRangeService) {}

    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Get('/')
    async get(@Body() body: ClassRangeGetListBody) {
        return await this.classRangeService.getList(body.user.school.uuid);
    }
}
