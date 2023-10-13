import { Body, Controller, Get, Put, Res } from '@nestjs/common';
import { ScheduleService } from './schedule.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { Response } from 'express';

@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {}

    @Get('/:id')
    async get(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        return [];
    }

    @Put('/:id')
    async put(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        return [];
    }
}
