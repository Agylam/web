import WebSocket, { WebSocketServer } from 'ws';
import { Connection } from './Connection';

interface Connections {
    [key: string]: Connection;
}

export class ConnectionManager {
    private wsServer: WebSocketServer;
    private connections: Connections = {};

    constructor(server_properties, callback = () => {}) {
        this.wsServer = new WebSocketServer(server_properties, callback);
        this.wsServer.on('connection', (connection) => {
            const connection_uuid = this.newConnection(connection);
            connection.on('close', () => {
                delete this.connections[connection_uuid];
            });
        });
    }

    newConnection(con: WebSocket) {
        const created_connection = new Connection(con);
        this.connections[created_connection.uuid] = created_connection;
        return created_connection.uuid;
    }

    getConnectionBySchoolUUID(uuid: string) {
        return Object.values(this.connections).find((e) => e.school_uuid === uuid && e.authorized);
    }

    async sendToSchool(uuid: string, msg: string) {
        const school = this.getConnectionBySchoolUUID(uuid);
        if (school === undefined) {
            return false;
        }
        await school.send(msg);
        return true;
    }
}