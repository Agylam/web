import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/Lesson';
import { LessonDto } from './dto/lesson.dto.js';

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

    async updateSchedule(classRange: string, dayOfWeek: number, newSchedule: LessonDto[]) {
        return await this.lessonsRepository.manager.transaction(async (transManager) => {
            await transManager
                .createQueryBuilder()
                .delete()
                .from(Lesson)
                .where('class_range = :cr', { cr: classRange })
                .andWhere('day = :day', { day: Number(dayOfWeek) })
                .execute();

            await transManager
                .createQueryBuilder()
                .insert()
                .into(Lesson)
                .values(
                    newSchedule.map((lesson) => {
                        const startAfterRegex = /(\d{2})\:(\d{2})/gm.exec(lesson.start);
                        const endAfterRegex = /(\d{2})\:(\d{2})/gm.exec(lesson.end);

                        if (startAfterRegex === null) throw new BadRequestException('Неверный формат start (HH:MM) ');
                        if (endAfterRegex === null) throw new BadRequestException('Неверный формат end (HH:MM)');

                        return {
                            start_hour: Number(startAfterRegex[1]),
                            start_minute: Number(startAfterRegex[2]),
                            end_hour: Number(endAfterRegex[1]),
                            end_minute: Number(endAfterRegex[2]),
                            day: dayOfWeek,
                            class_range: {
                                uuid: classRange,
                            },
                        };
                    }),
                )
                .execute();
            return this.getSchedule(classRange, dayOfWeek);
        });
    }
}
