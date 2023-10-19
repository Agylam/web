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

    async getList(schoolUUID: string) {
        return this.refreshTokensRepository.find({
            where: {
                school: {
                    uuid: schoolUUID,
                },
            },
            select: {
                uuid: true,
                name: true,
                start_sound: {
                    uuid: true,
                },
                end_sound: {
                    uuid: true,
                },
            },
        });
    }
}
