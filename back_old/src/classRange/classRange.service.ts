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
        private classRangesRepository: Repository<ClassRange>,
    ) {}

    async getList(schoolUUID: string) {
        return this.classRangesRepository.find({
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

    async getByUUID(uuid: string) {
        return await this.classRangesRepository.findOne({
            where: {
                uuid,
            },
            relations: {
                school: true,
            },
        });
    }
}
