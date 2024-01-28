import { Injectable } from '@nestjs/common';
import { createCluster, RedisClusterType } from 'redis';

@Injectable()
export class RedisService {
    public publish;
    private __cluster: RedisClusterType;

    constructor() {
        this.__cluster = createCluster({
            rootNodes: process.env.REDIS_CLUSTER_NODES.split(',').map((url) => {
                return {
                    url,
                };
            }),
        });

        this.__cluster.on('error', (err) => console.log('Ошибка Redis кластера:', err));
        this.__cluster.connect().then((r) => console.log('Успешное подключение к кластеру Redis'));
        this.publish = this.__cluster.publish;
    }
}