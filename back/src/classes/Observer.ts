import { NtpTimeSync } from 'ntp-time-sync';
import { Lesson } from '../entities/Lesson';
import { ConnectionManager } from './ConnectionManager';
import { dataSource } from '../db.config';
import { Announcement, AnnouncementState } from '../entities/Announcement';
import { Sound } from '../entities/Sound';

export class Observer {
    timeSync: NtpTimeSync;
    connectionManager: ConnectionManager;

    constructor() {
        this.timeSync = NtpTimeSync.getInstance();

        const ws_serv_settings = { port: process.env.WS_SERVER_PORT };

        this.connectionManager = new ConnectionManager(ws_serv_settings, () => {
            this.__getTime().then(({ second }) => {
                setTimeout(
                    () => {
                        console.log('Успешный запуск');
                        this.__superCheck();
                        setInterval(() => this.__superCheck(), 60000);
                    },
                    second == 0 ? 1 : (60 - second) * 1000,
                );
            });
        });
    }

    async __getTime() {
        let now = new Date();
        try {
            const ntpTime = await this.timeSync.getTime();
            now = ntpTime.now;
        } catch (e) {
            console.error('NTP', e);
        }
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        let day = now.getDay();
        day = day === 0 ? 6 : day - 1;

        console.log(`Проверка на время ${hour}:${minute}:${second}. День: ${day}`);
        return { hour, minute, second, day };
    }

    async __getSoundsByTime({ hour, minute, day }) {
        const start_lessons = await Lesson.getLessonsByStartTime(hour, minute, day);
        const end_lessons = await Lesson.getLessonsByEndTime(hour, minute, day);

        const start_sounds = start_lessons.map((l) => l.class_range.start_sound);
        const end_sounds = end_lessons.map((l) => l.class_range.end_sound);

        return start_sounds.concat(end_sounds);
    }

    async __getAnnouncements() {
        return await dataSource.getRepository(Announcement).find({
            where: {
                state: AnnouncementState.PUSHED,
            },
            select: {
                uuid: true,
                school: {
                    uuid: true,
                },
            },
            relations: {
                school: true,
            },
        });
    }

    async __superCheck() {
        try {
            const time = await this.__getTime();

            const sounds = await this.__getSoundsByTime({
                ...time,
                day: time.day,
            });
            console.log('Уроки в это время:', sounds);
            this.__mapSender(sounds, 'PLAY');

            const preSounds = await this.__getSoundsByTime({
                hour: time.hour,
                minute: time.minute + 1,
                day: time.day,
            });
            console.log('Уроки через минуту:', preSounds);
            this.__mapSender(preSounds, 'WARN');

            const announcements = await this.__getAnnouncements();
            console.log('Уведомления в это время', announcements);
            this.__mapSender(announcements, 'ANNOUNCEMENT');
            announcements.map((announcement) => {
                announcement.state = AnnouncementState.PLAYING;
            });
        } catch (e) {
            console.error('Check error:', e);
        }
    }

    __mapSender(list: (Sound | Announcement)[], prefix: string) {
        list.map(async (obj) => {
            try {
                const school_uuid = obj.school.uuid;
                console.log(school_uuid, prefix + ' ' + obj.uuid);
                await this.connectionManager.sendToSchool(school_uuid, prefix + ' ' + obj.uuid);
            } catch (e) {
                console.error(prefix + ' Error. ' + prefix + ' UUID: ', obj.uuid, 'Error:', e);
            }
        });
    }
}
