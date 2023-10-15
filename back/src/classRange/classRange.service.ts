import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassRange } from '../entities/ClassRange.js';

@Injectable()
export class ClassRangeService {
    constructor(
        private userService: UserService,
        @InjectRepository(ClassRange)
        private refreshTokensRepository: Repository<ClassRange>,
    ) {}

    getList() {}
}
