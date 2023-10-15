import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ClassRangeService } from './classRange.service.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';
import { Roles } from '../auth/roles-auth.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Controller('schedule')
export class ClassRangeController {
    constructor(private scheduleService: ClassRangeService) {}

    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Get('/')
    async get(@Body() userDto: CreateUserDto) {
        return [];
    }
}
