import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { RedisMessage, RedisMessageChannel } from '../classes/Observer';

@Injectable()
export class RedisService {
    private __cluster: RedisClientType;

    constructor() {
        this.__cluster = createClient({
            url: 'redis://' + process.env.REDIS_URL,
        });

        this.__cluster.on('error', (err) => console.log('Ошибка Redis кластера:', err));
        this.__cluster.connect().then(() => console.log('Успешное подключение к кластеру Redis'));
    }

    pubUpdate(channel: RedisMessageChannel, message: RedisMessage) {
        return this.__cluster.publish(channel, JSON.stringify(message));
    }
}
