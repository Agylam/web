import { NtpTimeSync } from 'ntp-time-sync';
import { Lesson } from '../entities/Lesson';
import { ConnectionManager } from './ConnectionManager';

export class Observer {
    timeSync: NtpTimeSync;
    connectionManager: ConnectionManager;

    constructor() {
        this.timeSync = NtpTimeSync.getInstance();

        const ws_serv_settings = { port: process.env.WS_SERVER_PORT };

        this.connectionManager = new ConnectionManager(ws_serv_settings, () => {
            this.getTime().then(({ seconds }) => {
                setTimeout(
                    () => {
                        console.log('Успешный запуск');
                        this.check();
                        setInterval(() => this.check(), 60000);
                    },
                    seconds == 0 ? 1 : (60 - seconds) * 1000,
                );
            });
        });
    }

    async getTime() {
        let now = new Date();
        try {
            const ntpTime = await this.timeSync.getTime();
            now = ntpTime.now;
        } catch (e) {
            console.error('NTP', e);
        }
        const hour = now.getHours();
        const minute = now.getMinutes();
        const seconds = now.getSeconds();
        const day = now.getDay();

        console.log({ hour, minute, seconds, day });
        return { hour, minute, seconds, day };
    }

    async getSoundsByTime({ hour, minute, day }) {
        const start_lessons = await Lesson.getLessonsByStartTime(hour, minute, day);
        const end_lessons = await Lesson.getLessonsByEndTime(hour, minute, day);

        console.log('lessons', start_lessons, end_lessons);

        const start_sounds = start_lessons.map((l) => l.class_range.start_sound);
        const end_sounds = end_lessons.map((l) => l.class_range.end_sound);

        return start_sounds.concat(end_sounds);
    }

    async check() {
        try {
            const time = await this.getTime();
            const sounds = await this.getSoundsByTime({
                ...time,
                day: time.day - 1,
            });
            sounds.map(async (sound) => {
                try {
                    const school_uuid = sound.school.uuid;
                    console.log(school_uuid, 'PLAY ' + sound.uuid);
                    await this.connectionManager.sendToSchool(school_uuid, 'PLAY ' + sound.uuid);
                } catch (e) {
                    console.error('SoundsMap Error. Sound UUID:', sound.uuid, 'Error:', e);
                }
            });

            const preSounds = await this.getSoundsByTime({
                hour: time.hour,
                minute: time.minute + 1,
                day: time.day - 1,
            });
            preSounds.map(async (sound) => {
                try {
                    const school_uuid = sound.school.uuid;
                    console.log(school_uuid, 'WARN ' + sound.uuid);
                    await this.connectionManager.sendToSchool(school_uuid, 'WARN ' + sound.uuid);
                } catch (e) {
                    console.error('preSound Error. Sound UUID: ', sound.uuid, 'Error:', e);
                }
            });
        } catch (e) {
            console.error('Check error:', e);
        }
    }
}
