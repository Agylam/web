import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/Lesson';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Lesson)
        private lessonsRepository: Repository<Lesson>,
    ) {}

    async getSchedule(classRange: string, dayOfWeek: number) {
        if (dayOfWeek < 0 || dayOfWeek > 6) throw new BadRequestException('Day must be from 0 to 6');

        const lessons = await this.lessonsRepository.find({
            where: {
                class_range: {
                    uuid: classRange,
                },
                day: dayOfWeek,
            },
        });

        return lessons.map((lesson) => {
            return {
                ...lesson,
                start:
                    (lesson.start_hour < 10 ? '0' : '') +
                    lesson.start_hour +
                    ':' +
                    (lesson.start_minute < 10 ? '0' : '') +
                    lesson.start_minute,
                end:
                    (lesson.end_hour < 10 ? '0' : '') +
                    lesson.end_hour +
                    ':' +
                    (lesson.end_minute < 10 ? '0' : '') +
                    lesson.end_minute,
            };
        });
    }
}
