import WebSocket from 'ws';
import { v4 as genUUID } from 'uuid';
import { School } from '../entities/School';

export class Connection {
    public uuid: string;
    public school_uuid: string;
    public authorized = false;

    private auth_random: string;
    private connection: WebSocket;

    constructor(connection) {
        this.uuid = genUUID();
        this.auth_random = genUUID();
        this.connection = connection;

        this.connection.on('message', (buf) => {
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

                const authorized = await School.authorizate(this.school_uuid, this.auth_random, args[1]);

                if (authorized) {
                    this.authorized = true;
                    return 'AUTHORIZED';
                } else {
                    await this.close('Invalid authorization data. Bye bye');
                }
                break;
            default:
                return 'ERROR Unknown command';
        }
    }

    async authRequest() {
        await this.send('AUTH_REQUEST ' + this.auth_random);
        setTimeout(() => {
            if (this.authorized !== true) this.close('Auth timeout');
        }, 30000);
    }

    async send(msg) {
        this.connection.send(msg);
    }

    async close(err: string | null) {
        if (err !== null) await this.send('ERROR ' + err);
        this.connection.close();
    }
}
