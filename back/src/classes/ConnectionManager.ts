import WebSocket, { WebSocketServer } from 'ws';
import { Connection } from './Connection';

interface Connections {
    [key: string]: Connection;
}

export class ConnectionManager {
    private __wsServer: WebSocketServer;
    private __connections: Connections = {};

    constructor(ws_server: WebSocketServer) {
        this.__wsServer = ws_server;
        this.__wsServer.on('connection', (ws_connection) => {
            const connection = this.__newConnection(ws_connection);
            connection.onAuthorized(() => {
                this.__connections[connection.uuid];
            });
            ws_connection.on('close', () => {
                delete this.__connections[connection.uuid];
            });
        });
    }

    getConnectionBySchoolUUID(uuid: string) {
        return Object.values(this.__connections).find((e) => e.school_uuid === uuid && e.isAuthorized);
    }

    async sendToSchool(uuid: string, msg: string) {
        const school = this.getConnectionBySchoolUUID(uuid);
        if (school === undefined) {
            return false;
        }
        await school.send(msg);
        return true;
    }

    private __newConnection(con: WebSocket) {
        const created_connection = new Connection(con);
        this.__connections[created_connection.uuid] = created_connection;
        return created_connection;
    }
}
