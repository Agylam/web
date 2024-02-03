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
                await this.send(response);
            } catch (e) {
                console.error('Ошибка в отправке сообщения:', e, 'DeviceUUID:', this.device_uuid);
                await this.send('ERROR Internal error, see console');
            }
        });

        console.log('WS UUID:', this.uuid, 'Новое подключение');
        this.__authRequest()
            .then(() => console.log('WS UUID:', this.uuid, 'Отправил авторизационные данные'))
            .catch(async (e) => {
                console.error('Ошибка в отправке сообщения:', e, 'DeviceUUID:', this.device_uuid);
                await this.send('ERROR Internal error, see console');
            });
    }

    onAuthorized(callback: (device_id: string) => void | Promise<void>) {
        this.__onAuthorized = callback;
    }

    async close(err: string | null) {
        if (err !== null) await this.send('ERROR ' + err);
        this.__connection.close();
    }

    async send(msg: string) {
        this.__connection.send(msg);
    }

    private async __msgHandler(msg: string): Promise<string> {
        const msg_sliced = msg.split(' ');
        if (msg_sliced.length === 0) return 'ERROR empty request';
        const cmd = msg_sliced[0];
        const args = msg_sliced.slice(1);

        if (!cmd) return 'ERROR empty request';

        switch (cmd) {
            case 'AUTH':
                return await this.__onAuth(args);

            case 'GET_CONFIG':
                return await this.__getConfig();

            case 'PLAYED_ANNOUNCEMENT':
                if (args[0] === undefined) return 'ERROR announcement UUID is empty';

                const announcement = await Announcement.getByUUID(args[0]);
                if (announcement === null) return 'ERROR Announcement not found';

                announcement.state = AnnouncementState.PLAYED;
                await announcement.save();
                return 'OK';

            default:
                return 'ERROR Unknown command';
        }
    }

    private async __onAuth(args: string[]) {
        console.log('WS UUID:', this.uuid, 'Отправил авторизационные данные. Проверяю...');

        if (args[0] === undefined) return 'ERROR DEVICE_UUID is empty';
        if (args[1] === undefined) return 'ERROR auth token is empty';
        if (this.school_uuid !== undefined) return 'ERROR already authorized';

        const device = await Device.authorize(args[0], this.__auth_random, args[1]);

        if (device !== false) {
            this.device_uuid = args[0];
            this.school_uuid = device.school.uuid;
            this.isAuthorized = true;
            this.__onAuthorized(args[0]);

            console.log('WS UUID:', this.uuid, 'Проверил авторизационные данные. Успешно');
            return 'AUTHORIZED';
        } else {
            console.log('WS UUID:', this.uuid, 'Неверные авторизационные данные');
            await this.close('Invalid authorization data. Bye bye');
        }
    }

    private async __authRequest() {
        await this.send('AUTH_REQUEST ' + this.__auth_random);
        setTimeout(() => {
            if (!this.isAuthorized) this.close('Auth timeout');
        }, this.__connectionTimeout);
    }

    private async __getConfig() {
        try {
            const config = await School.getConfig(this.school_uuid);
            return 'SET_CONFIG ' + JSON.stringify(config);
        } catch (e) {
            console.error('Ошибка отправки конфига:', e);
        }
    }
}
