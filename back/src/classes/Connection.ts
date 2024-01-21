import WebSocket from 'ws';
import { v4 as genUUID } from 'uuid';
import { School } from '../entities/School';
import { Announcement, AnnouncementState } from '../entities/Announcement';
import { dataSource } from '../db.config';

export class Connection {
    public uuid: string;
    public school_uuid: string;
    public authorized = false;

    private __auth_random: string;
    private __connection: WebSocket;
    private __announcementRepository = dataSource.getRepository(Announcement);

    constructor(connection) {
        this.uuid = genUUID();
        this.__auth_random = genUUID();
        this.__connection = connection;

        this.__connection.on('message', (buf) => {
            const msg = buf.toString('utf8');
            this.msgHandler(msg).then((response) => {
                this.send(response);
            });
        });

        this.authRequest();
    }

    async msgHandler(msg): Promise<string> {
        const msg_sliced = msg.split(' ');
        const cmd = msg_sliced[0];
        const args = msg_sliced.slice(1);

        if (cmd === '') {
            return 'ERROR empty request';
        }

        switch (cmd) {
            case 'AUTH':
                if (args[0] === undefined) {
                    return 'ERROR school UUID is empty';
                }
                if (args[1] === undefined) {
                    return 'ERROR auth token is empty';
                }
                if (this.school_uuid !== undefined) {
                    return 'ERROR already authorized';
                }
                this.school_uuid = args[0];

                const authorized = await School.authorizate(this.school_uuid, this.__auth_random, args[1]);

                if (authorized) {
                    this.authorized = true;

                    return 'AUTHORIZED';
                } else {
                    await this.close('Invalid authorization data. Bye bye');
                }
                break;
            case 'PLAYED_ANNOUNCEMENT':
                if (args[0] === undefined) {
                    return 'ERROR announcement UUID is empty';
                }

                const announcement = await this.__announcementRepository.findOneBy({
                    uuid: args[0],
                });
                announcement.state = AnnouncementState.PLAYED;
                await announcement.save();
                return 'OK';
                break;
            default:
                return 'ERROR Unknown command';
        }
    }

    async authRequest() {
        await this.send('AUTH_REQUEST ' + this.__auth_random);
        setTimeout(() => {
            if (this.authorized !== true) this.close('Auth timeout');
        }, 30000);
    }

    async send(msg) {
        this.__connection.send(msg);
    }

    async close(err: string | null) {
        if (err !== null) await this.send('ERROR ' + err);
        this.__connection.close();
    }
}
