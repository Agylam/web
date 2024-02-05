import { dataSource } from '../db.config.js';
import { Announcement, AnnouncementState } from '../entities/Announcement.js';
import { VKCloudVoice } from './VKCloudVoice.js';
import * as process from 'process';
import { S3 } from 'aws-sdk';

export class AnnouncementPusher {
    private readonly __announcementRepository = dataSource.getRepository(Announcement);
    private __vkCloudVoice: VKCloudVoice;
    private __s3: S3;

    constructor() {
        if (!process.env.S3_ACCESS_KEY_ID) {
            throw new Error('S3_ACCESS_KEY_ID is not defined');
        }
        if (!process.env.S3_SECRET_ACCESS_KEY) {
            throw new Error('S3_SECRET_ACCESS_KEY is not defined');
        }
        if (!process.env.S3_REGION) {
            throw new Error('S3_REGION is not defined');
        }
        if (!process.env.S3_BUCKET) {
            throw new Error('S3_BUCKET is not defined');
        }
        if (!process.env.S3_ENDPOINT) {
            throw new Error('S3_ENDPOINT is not defined');
        }

        try {
            this.__vkCloudVoice = new VKCloudVoice();
            this.__s3 = new S3({
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
            });
            console.log('AnnouncementPusher initialization successful');
        } catch (e) {
            console.error('AnnouncementPusher initialization error:', e);
        }
    }

    __uploadFile(buffer: ArrayBuffer, savePath: string) {
        return new Promise((resolve, reject) => {
            try {
                const params = {
                    Body: new Uint8Array(buffer),
                    Bucket: process.env.S3_BUCKET,
                    Key: savePath,
                };
                this.__s3.upload(params).send((err, data) => {
                    if (err) reject(err);
                    console.log('Успешно загружен файл по S3');
                    resolve(data);
                });
            } catch (err) {
                console.error('Невозможно загрузить файл. Ошика:', err);
                reject(err);
            }
        });
    }

    async push(uuid: string) {
        const announcement = await this.__announcementRepository.findOneOrFail({
            where: {
                state: AnnouncementState.CREATED,
                uuid,
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

        const { text, school } = announcement;
        const filePath = 'schools/' + school.uuid + '/announcements/';
        const fileName = uuid + '.mp3';

        let announcementBuffer: ArrayBuffer;
        try {
            announcementBuffer = await this.__vkCloudVoice.streamTTS(text, announcement.speech_model);
            console.log('Объявление сохранено в буфер:', filePath + fileName);
        } catch (e) {
            console.error('Ошибка сохранения объявления в буфер:', e);
            announcement.state = AnnouncementState.ERROR;
            await this.__announcementRepository.save(announcement);
        }

        try {
            await this.__uploadFile(announcementBuffer, filePath + fileName);
            announcement.state = AnnouncementState.PUSHED;
            await this.__announcementRepository.save(announcement);
            console.log('Объявление загружено по S3 с UUID:', uuid);
        } catch (err) {
            console.error('Невозможно загрузить Объявление по S3. Ошибка:', err);
            announcement.state = AnnouncementState.ERROR;
            await this.__announcementRepository.save(announcement);
        }
    }
}
