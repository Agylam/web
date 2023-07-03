import { UidSessionsClass } from "../models/UidSessions";

export namespace DevicesRepository {
    export interface TokenData {
        session: UidSessionsClass;
        uid: string;
        ARRandom: string;
        sign: string;
        device: string;
    }
}
