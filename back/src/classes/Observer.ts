import { ConnectionManager } from './ConnectionManager';
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';

export enum RedidUpdateMessageType {
    SCHEDULE = 'SCHEDULE',
    CLASS_RANGE = 'CLASS_RANGE',
}

export interface RedisUpdateMessage {
    school_uuid: string;
    type: RedidUpdateMessageType;
}

export class Observer {
    private __wsServer: WebSocketServer;
    private __connectionManager: ConnectionManager;
    private __redisClient;

    constructor() {
        try {
            if (process.env.WS_SERVER_PORT == '') {
                throw new Error('WS_SERVER_PORT не указан');
            }

            this.__createWSServer();
            this.__initConnectionManager();
            this.__initRedisClient().then(() => console.log('Успешное подключение к кластеру Redis'));
            this.__subscribe().then(() => console.log('Успешная подписка на события Redis'));
        } catch (e) {
            console.error('Ошибка Observer:', e);
        }
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

    private async __initRedisClient() {
        this.__redisClient = createClient({
            url: process.env.REDIS_URL,
        });

        this.__redisClient.on('error', (err) => console.log('Ошибка Observer: Ошибка Redis кластера:', err));
        await this.__redisClient.connect();
    }

    private async __subscribe() {
        await this.__redisClient.subscribe('UPDATE', (unparsed_message: string) => {
            let response = '';
            const message: RedisUpdateMessage = JSON.parse(unparsed_message);
            switch (message.type) {
                case RedidUpdateMessageType.CLASS_RANGE:
                    response = 'UPDATE_CLASS_RANGES';
                    break;
                case RedidUpdateMessageType.SCHEDULE:
                    response = 'UPDATE_SCHEDULE';
                    break;
            }
            this.__connectionManager.sendToSchool(message.school_uuid, response);
        });
    }
}
