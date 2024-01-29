import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { RedisUpdateMessage } from '../classes/Observer';

@Injectable()
export class RedisService {
    private __cluster: RedisClientType;

    constructor() {
        this.__cluster = createClient({
            url: process.env.REDIS_URL,
        });

        this.__cluster.on('error', (err) => console.log('Ошибка Redis кластера:', err));
        this.__cluster.connect().then(() => console.log('Успешное подключение к кластеру Redis'));
    }

    pubUpdate(message: RedisUpdateMessage) {
        this.__cluster.publish('UPDATE', JSON.stringify(message));
    }
}
