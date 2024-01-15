import { dataSource } from '../db.config.js';
import { Announcement, AnnouncementState } from '../entities/Announcement.js';

export class AnnouncementPusher {
    private __timer_id: NodeJS.Timeout;

    private readonly __announcementRepository = dataSource.getRepository(Announcement);

    constructor() {
        this.__timer_id = setInterval(() => this.__check(), 1000);
    }

    async __check() {
        const announcements = await this.__announcementRepository.find({
            where: {
                state: AnnouncementState.CREATED,
            },
            relations: {
                school: true,
            },
            select: {
                uuid: true,
                text: true,
                school: {
                    uuid: true,
                },
            },
        });

        announcements.map(async (announcement) => {});
    }
}
