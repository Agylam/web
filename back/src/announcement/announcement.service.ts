import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities/Announcement.js';
import { CreateAnnouncementDto } from './dto/create.announcement.dto.js';
import { School } from '../entities/School.js';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(Announcement)
        private announcementRepository: Repository<Announcement>,
        @InjectRepository(School)
        private schoolRepository: Repository<School>,
        private redisService: RedisService,
    ) {}

    async createAnnouncement(announcement: CreateAnnouncementDto) {
        const school = await this.schoolRepository.findOneBy({ uuid: announcement.schoolUuid });
        if (!school) throw new BadRequestException('Неизвестная школа');

        const announcementObj = new Announcement();
        announcementObj.text = announcement.text;
        announcementObj.school = school;
        const { text, uuid, state } = await announcementObj.save();
        return { text, uuid, state };
    }
}
