import { DevicesRepository } from "../repositories/devicesRepository.js";
import TokenData = DevicesRepository.TokenData;
import { FastifyInstance } from "fastify";
import { Md5 } from "ts-md5";
import { DevicesClass } from "../models/Devices.js";
import { UidSessionsClass } from "../models/UidSessions.js";
import { UsersClass } from "../models/Users.js";
import { InvalidToken } from "../exceptions/invalidToken.js";

export class DevicesService {
    private constructor(private readonly _fastify: FastifyInstance) {}

    public static init(fastify: FastifyInstance) {
        return new DevicesService(fastify);
    }

    private async _decodeToken(token: string): Promise<TokenData | false> {
        const { UidSessions, Devices } = this._fastify.db.models;

        // decode base64 token
        const buff = Buffer.from(token, "base64");
        const text = buff.toString("utf-8");
        const countOfColon = text.split(":").length - 1;
        if (countOfColon !== 3) {
            return false;
        }
        const [session, uid, ARRandom, sign] = text.split(":");
        const sessionObj = (await UidSessions.findOne({ where: { uuid: session, active: true } })) as UidSessionsClass;
        if (!sessionObj) {
            return false;
        }
        const device = (await Devices.findOne({ where: { uuid: sessionObj.device_id } })) as DevicesClass;
        if (!device) {
            return false;
        }
        const { secret } = device;

        // check sign
        const trueSign = Md5.hashStr(uid + sessionObj.PCRandom + ARRandom + secret);
        if (sign !== trueSign) {
            return false;
        }
        return {
            session: sessionObj,
            uid: uid,
            ARRandom: ARRandom,
            sign: sign,
            device: device.uuid,
        };
    }

    private async _deactiveSession(session: string): Promise<boolean> {
        const { UidSessions } = this._fastify.db.models;
        const sessionObj = await UidSessions.findOne({ where: { uuid: session, active: true } });

        if (!sessionObj) {
            return false;
        }

        await sessionObj.update({ active: false });

        return true;
    }

    private async _getUserIdByUid(uid: string): Promise<number | false> {
        const user = (await this._fastify.db.models.Users.findOne({ where: { uid } })) as UsersClass;
        if (!user) {
            return false;
        }
        return user.id;
    }

    public async checkToken(token: string): Promise<number | InvalidToken> {
        const tokenData = await this._decodeToken(token);

        if (tokenData === false) {
            return new InvalidToken();
        }

        const userId = await this._getUserIdByUid(tokenData.uid);

        if (userId === false) {
            return new InvalidToken();
        }

        await this._deactiveSession(tokenData.session.uuid);

        return userId;
    }
}
