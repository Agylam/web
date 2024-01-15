import { dataSource } from '../db.config.js';
import { Announcement, AnnouncementState } from '../entities/Announcement.js';
import { VKCloudVoice } from './VKCloudVoice.js';
import * as process from 'process';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';

export class AnnouncementPusher {
    private __timer_id: NodeJS.Timeout;
    private __vkCloudVoice: VKCloudVoice;
    private __s3;

    private readonly __TEMP_FOLDER = 'temp';
    private readonly __announcementRepository = dataSource.getRepository(Announcement);

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

        if (!fs.existsSync(this.__TEMP_FOLDER)) {
            fs.mkdirSync(this.__TEMP_FOLDER);
        }

        try {
            this.__timer_id = setInterval(() => this.__check(), 1000);
            this.__vkCloudVoice = new VKCloudVoice();
            this.__s3 = new S3({
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
                logger: console,
            });
            console.log('AnnouncementPusherInit successfull');
        } catch (e) {
            console.error('AnnouncementPusherInit error:', e);
        }

        // vkCloudVoice.saveTTS('Привет, мир!', 'test');
    }

    // Лютый говногод
    // TODO: Рефактор

    // Я не понимаю, почему нет нормального API для S3
    __uploadFile(filePath: string, savePath: string) {
        console.log('Uploading file:', filePath, 'to', savePath, 'step 1');
        return new Promise((resolve, reject) => {
            try {
                const params = {
                    localFile: filePath,
                    s3Params: {
                        Bucket: process.env.S3_BUCKET,
                        Key: savePath,
                    },
                };
                console.log('Setting Params');
                this.__s3.uploadFile(params, (err, data) => {
                    console.log('Uploading file step 3', err, data);
                    if (err) reject(err);
                    resolve(data);
                });
            } catch (err) {
                console.error("Can't upload file:", err);
                reject(err);
            }
        });
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

        announcements.map(async (announcement) => {
            const { uuid, text, school } = announcement;
            const filePath = '/announcements/' + school.uuid + '/';
            const fileName = uuid + '.mp3';

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }

            try {
                await this.__vkCloudVoice.saveTTS(text, filePath + fileName, announcement.speech_model);
                announcement.state = AnnouncementState.SAVED;
                await this.__announcementRepository.save(announcement);
                console.log('TTS saved:', fileName);
            } catch (e) {
                console.error('TTS save error:', e);
                announcement.state = AnnouncementState.ERROR;
                await this.__announcementRepository.save(announcement);
            }

            try {
                await this.__uploadFile('./' + this.__TEMP_FOLDER + filePath + fileName, filePath + fileName);
                announcement.state = AnnouncementState.PUSHED;
                await this.__announcementRepository.save(announcement);
                console.log('Announcement uploaded:', uuid);
            } catch (err) {
                console.error('unable to upload:', err);
                announcement.state = AnnouncementState.ERROR;
                await this.__announcementRepository.save(announcement);
            }
        });
    }
}
