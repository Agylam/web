import { Controller, Get, Put } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {}

    @Get('/:id')
    async get() {
        return [];
    }

    @Put('/:id')
    async put() {
        return [];
    }
}
