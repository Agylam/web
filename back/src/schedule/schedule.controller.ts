import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';
import { Roles } from '../auth/roles-auth.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {}

    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Get('/:class_range_uuid/:day')
    async get(@Param('class_range_uuid') class_range_uuid: string, @Param('day') day: number) {
        return this.scheduleService.getSchedule(class_range_uuid, day);
    }

    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Put('/:class_range_uuid/:day')
    async put(@Param('class_range_uuid') class_range_uuid: string, @Param('day') day: number) {
        return this.scheduleService.getSchedule(class_range_uuid, day);
    }
}
