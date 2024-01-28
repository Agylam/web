import { ConnectionManager } from './ConnectionManager';
import { createCluster } from 'redis';
import { WebSocketServer } from 'ws';

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
            this.__initRedisClient();
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
        this.__redisClient = createCluster({
            rootNodes: process.env.REDIS_CLUSTER_NODES.split(',').map((url) => {
                return {
                    url,
                };
            }),
        });

        this.__redisClient.on('error', (err) => console.log('Ошибка Observer: Ошибка Redis кластера:', err));
        await this.__redisClient.connect();
        console.log('Успешное подключение к кластеру Redis');
    }

    private __subscribe() {}
}
