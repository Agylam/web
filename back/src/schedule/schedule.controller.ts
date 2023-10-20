import { Controller, Get, Param } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {}

    @Get('/:class_range_uuid/:day')
    async get(@Param('class_range_uuid') class_range_uuid: string, @Param('day') day: number) {
        return this.scheduleService.getSchedule(class_range_uuid, day);
    }
}
