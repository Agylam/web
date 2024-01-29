import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/Lesson';
import { LessonDto } from './dto/lesson.dto.js';
import { ClassRangeService } from '../classRange/classRange.service';
import { RedisService } from '../redis/redis.service';
import { RedidUpdateMessageType } from '../classes/Observer';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Lesson)
        private lessonsRepository: Repository<Lesson>,
        private classRangesService: ClassRangeService,
        private redisService: RedisService,
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

        const classRangeObj = await this.classRangesService.getByUUID(classRange);

        return lessons.map((lesson) => {
            return {
                ...lesson,
                start: this.timeToLocal(lesson.start_hour, lesson.start_minute, classRangeObj.school.timezone_offset),
                end: this.timeToLocal(lesson.end_hour, lesson.end_minute, classRangeObj.school.timezone_offset),
            };
        });
    }

    // dow = (date.getDate() || 7) - 1
    // Пн - 0 Вс - 6
    async updateSchedule(classRange: string, dayOfWeek: number, newSchedule: LessonDto[]) {
        if (dayOfWeek < 0 || dayOfWeek > 6) throw new BadRequestException('dayOfWeek must be from 0 yo 6');
        return await this.lessonsRepository.manager.transaction(async (transManager) => {
            await transManager
                .createQueryBuilder()
                .delete()
                .from(Lesson)
                .where('class_range = :cr', { cr: classRange })
                .andWhere('day = :day', { day: Number(dayOfWeek) })
                .execute();

            const classRangeObj = await this.classRangesService.getByUUID(classRange);

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

                        const utcStart = this.timeFromLocal(
                            Number(startAfterRegex[1]),
                            Number(startAfterRegex[2]),
                            classRangeObj.school.timezone_offset,
                        );

                        const utcEnd = this.timeFromLocal(
                            Number(endAfterRegex[1]),
                            Number(endAfterRegex[2]),
                            classRangeObj.school.timezone_offset,
                        );

                        return {
                            start_hour: utcStart[0],
                            start_minute: utcStart[1],
                            end_hour: utcEnd[0],
                            end_minute: utcEnd[1],
                            day: dayOfWeek,
                            class_range: {
                                uuid: classRange,
                            },
                        };
                    }),
                )
                .execute();

            this.redisService.pubUpdate({
                type: RedidUpdateMessageType.SCHEDULE,
                school_uuid: classRangeObj.school.uuid,
            });

            return this.getSchedule(classRange, dayOfWeek);
        });
    }

    timeFromLocal(localHours: number, localMinutes: number, offset: number) {
        const localTimeMinutes = localHours * 60 + localMinutes;

        const utcTimeMinutes = localTimeMinutes - offset;
        let utcHours = Math.floor(utcTimeMinutes / 60);
        let utcMinutes = utcTimeMinutes % 60;

        utcHours = (utcHours < 0 ? 24 : 0) + utcHours;
        utcMinutes = (utcMinutes < 0 ? 60 : 0) + utcMinutes;

        return [utcHours, utcMinutes];
    }

    timeToLocal(utcHours: number, utcMinutes: number, offset: number) {
        if (typeof utcMinutes != 'number' || typeof utcHours != 'number')
            throw new Error('Неправильный формат времени');

        const utcTimeMinutes = utcHours * 60 + utcMinutes;
        const localTimeMinutes = utcTimeMinutes + offset;
        let localHours = Math.floor(localTimeMinutes / 60);
        let localMinutes = utcTimeMinutes % 60;

        localHours = (localHours > 23 ? -24 : 0) + localHours;
        localMinutes = (localMinutes > 60 ? -60 : 0) + localMinutes;

        return this.pad2num(localHours) + ':' + this.pad2num(localMinutes);
    }

    pad2num(num: number) {
        return (num < 10 ? '0' : '') + num;
    }
}
