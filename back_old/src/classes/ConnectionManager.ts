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
            connection.onAuthorized((device_uuid) => {
                const con_uuids = Object.keys(this.__connections);

                // Закрытие уже существующих подключений
                Object.values(this.__connections)
                    .map((con, key) => {
                        return con.device_uuid === device_uuid && con_uuids[key] !== connection.uuid ? key : -1;
                    })
                    .filter((index) => index !== -1)
                    .map((index) => {
                        this.__connections[con_uuids[index]].close('Another connection. Bye bye');
                    });
            });
            ws_connection.on('close', () => {
                delete this.__connections[connection.uuid];
            });
        });
    }

    getConnectionBySchoolUUID(uuid: string) {
        return Object.values(this.__connections).filter((e) => e.school_uuid === uuid && e.isAuthorized);
    }

    async sendToSchool(uuid: string, msg: string) {
        const schools = this.getConnectionBySchoolUUID(uuid);
        if (schools === undefined) {
            return false;
        }

        schools.map((school) => school.send(msg));
        return true;
    }

    private __newConnection(con: WebSocket) {
        const created_connection = new Connection(con);
        this.__connections[created_connection.uuid] = created_connection;
        return created_connection;
    }
}
