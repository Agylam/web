import { ConnectionManager } from './ConnectionManager';
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';
import { AnnouncementPusher } from './AnnouncementPusher';

export enum RedisMessageChannel {
    FOR_SCHOOL = 'FOR_SCHOOL',
    FOR_BACKEND = 'FOR_BACKEND',
}

export enum RedisMessageType {
    UPDATE_CONFIG = 'UPDATE_CONFIG',
    NEW_ANNOUNCEMENT = 'NEW_ANNOUNCEMENT',
}

export interface RedisMessage {
    school_uuid: string;
    type: RedisMessageType;
    payload?: any;
}

export class Observer {
    private __wsServer: WebSocketServer;
    private __connectionManager: ConnectionManager;
    private __redisClient;
    private __s3;
    private __announcementPusher: AnnouncementPusher;

    constructor() {
        if (process.env.WS_SERVER_PORT == '') {
            throw new Error('WS_SERVER_PORT не указан');
        }

        this.__createWSServer();
        this.__initConnectionManager();
        this.__initRedisClient().then(() => console.log('Успешное подключение к кластеру Redis'));
        this.__subscribe().then(() => console.log('Успешная подписка на события Redis'));
    }

    private __createWSServer() {
        this.__wsServer = new WebSocketServer(
            {
                port: Number(process.env.WS_SERVER_PORT),
            },
            () => {
                console.log('WebSocket сервер успешно запущен на порту ', process.env.WS_SERVER_PORT);
            },
        );
    }

    private __initConnectionManager() {
        this.__connectionManager = new ConnectionManager(this.__wsServer);
    }

    private __initAnnouncementPusher() {
        this.__announcementPusher = new AnnouncementPusher();
    }

    private async __initRedisClient() {
        this.__redisClient = createClient({
            url: 'redis://' + process.env.REDIS_URL,
        });

        this.__redisClient.on('error', (err) => console.log('Ошибка Observer: Ошибка Redis кластера:', err));
        await this.__redisClient.connect();
    }

    private async __subscribe() {
        await this.__redisClient.subscribe(RedisMessageChannel.FOR_SCHOOL, (unparsed_message: string) => {
            const message: RedisMessage = JSON.parse(unparsed_message);
            this.__connectionManager.sendToSchool(message.school_uuid, message.type);
        });
        await this.__redisClient.subscribe(RedisMessageChannel.FOR_BACKEND, async (unparsed_message: string) => {
            const message: RedisMessage = JSON.parse(unparsed_message);
            switch (message.type) {
                case RedisMessageType.NEW_ANNOUNCEMENT:
                    if (!message.payload || !message.payload.announcementUUID) {
                        console.error('Ошибка: AnnouncementUUID путое');
                    }
                    await this.__announcementPusher.push(message.payload.announcementUUID);
                    await this.__connectionManager.sendToSchool(message.school_uuid, message.type);
                    break;
            }
        });
    }
}
