import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/RefreshToken.js';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
    constructor(
        private userService: UserService,
        @InjectRepository(RefreshToken)
        private refreshTokensRepository: Repository<RefreshToken>,
    ) {}

    async getSchedule() {}
}
