import WebSocket from 'ws';
import { v4 as genUUID } from 'uuid';
import { Announcement, AnnouncementState } from '../entities/Announcement';
import { Device } from '../entities/Device';
import { School } from '../entities/School';

export class Connection {
    public uuid: string;
    public school_uuid: string;
    public device_uuid: string;
    public isAuthorized = false;

    private __connection: WebSocket;
    private readonly __auth_random: string;
    private readonly __connectionTimeout = 50000;
    private __onAuthorized: (deviceUUID: string) => void;

    constructor(connection: WebSocket) {
        this.uuid = genUUID();
        this.__auth_random = genUUID();
        this.__connection = connection;

        this.__connection.on('message', async (buf) => {
            try {
                const msg = buf.toString('utf8');
                const response = await this.__msgHandler(msg);
                if (response) {
                    if (response.length > 1) {
                        await this.send(response[0], response[1]);
                    } else {
                        await this.send(response[0]);
                    }
                }
            } catch (e) {
                console.error('Ошибка в отправке сообщения:', e, 'DeviceUUID:', this.device_uuid);
                await this.__error('Internal error, see console');
            }
        });

        console.log('WS UUID:', this.uuid, 'Новое подключение');
        this.__authRequest()
            .then(() => console.log('WS UUID:', this.uuid, 'Отправил авторизационные данные'))
            .catch(async (e) => {
                console.error('Ошибка в отправке сообщения:', e, 'DeviceUUID:', this.device_uuid);
                await this.__error('Internal error, see console');
            });
    }

    onAuthorized(callback: (device_id: string) => void | Promise<void>) {
        this.__onAuthorized = callback;
    }

    async close(err: string | null) {
        if (err !== null) await this.__error(err);
        this.__connection.close();
    }

    async send(cmd: string, args?: any[]) {
        const msg = JSON.stringify({ cmd, args });
        this.__connection.send(msg);
    }

    private async __error(err: string) {
        await this.send('ERROR', [err]);
    }

    private async __msgHandler(msg: string): Promise<[string, string[]] | [string]> {
        try {
            const msg_parsed = JSON.parse(msg);
            const cmd = msg_parsed?.cmd;
            const args = msg_parsed?.args;

            if (!cmd) {
                await this.__error('Empty request');
                return;
            }

            switch (cmd) {
                case 'AUTH':
                    return await this.__onAuth(args);

                case 'GET_CONFIG':
                    const config = await this.__getConfig();
                    return ['SET_CONFIG', [config]];

                case 'PLAYED_ANNOUNCEMENT':
                    if (!args[0]) {
                        await this.__error('Announcement UUID is empty');
                        return;
                    }

                    const announcement = await Announcement.getByUUID(args[0]);
                    if (!announcement) {
                        await this.__error('Announcement not found');
                        return;
                    }

                    announcement.state = AnnouncementState.PLAYED;
                    await announcement.save();
                    return ['OK'];

                default:
                    await this.__error('ERROR Unknown command');
                    return;
            }
        } catch (e) {
            this.__error('Internal server error. Connect with admins');
            console.error('Connection error: ', e);
        }
    }

    private async __onAuth(args: string[]): Promise<[string]> {
        console.log('WS UUID:', this.uuid, 'Отправил авторизационные данные. Проверяю...');

        if (args[0] === undefined) {
            await this.__error('DEVICE_UUID is empty');
            return;
        }
        if (args[1] === undefined) {
            await this.__error('auth token is empty');
            return;
        }
        if (this.school_uuid !== undefined) {
            await this.__error('already authorized');
            return;
        }

        const device = await Device.authorize(args[0], this.__auth_random, args[1]);

        if (device !== false) {
            this.device_uuid = args[0];
            this.school_uuid = device.school.uuid;
            this.isAuthorized = true;
            this.__onAuthorized(args[0]);

            console.log('WS UUID:', this.uuid, 'Проверил авторизационные данные. Успешно');
            return ['AUTHORIZED'];
        } else {
            console.log('WS UUID:', this.uuid, 'Неверные авторизационные данные');
            await this.close('Invalid authorization data. Bye bye');
        }
    }

    private async __authRequest() {
        await this.send('AUTH_REQUEST ', [this.__auth_random]);
        setTimeout(() => {
            if (!this.isAuthorized) this.close('Auth timeout');
        }, this.__connectionTimeout);
    }

    private async __getConfig() {
        try {
            const config = await School.getConfig(this.school_uuid);
            return JSON.stringify(config);
        } catch (e) {
            console.error('Ошибка отправки конфига:', e);
        }
    }
}
