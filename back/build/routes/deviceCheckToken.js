import { Md5 } from "ts-md5";
export default (fastify) => {
    const decodeToken = async (token) => {
        const { UidSessions, Devices } = fastify.db.models;
        // decode base64 token
        const buff = Buffer.from(token, "base64");
        const text = buff.toString("utf-8");
        const countOfColon = text.split(":").length - 1;
        if (countOfColon !== 3) {
            return false;
        }
        const [session, uid, ARRandom, sign] = text.split(":");
        const sessionObj = await UidSessions.findOne({ where: { uuid: session, active: true } });
        if (!sessionObj) {
            return false;
        }
        const device = await Devices.findOne({ where: { uuid: sessionObj.device_id } });
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
            device: device.uuid
        };
    };
    const deactiveSession = async (session) => {
        const { UidSessions } = fastify.db.models;
        const sessionObj = await UidSessions.findOne({ where: { uuid: session, active: true } });
        if (!sessionObj) {
            return false;
        }
        await sessionObj.update({ active: false });
        return true;
    };
    const getUserIdByUid = async (uid) => {
        const user = await fastify.db.models.Users.findOne({ where: { uid } });
        if (!user) {
            return false;
        }
        return user.id;
    };
    return {
        method: "PUT",
        url: "/device/check_token/",
        handler: async (request, reply) => {
            const { token } = request.body;
            if (!token) {
                reply.code(400).send({ error: "Missing token" });
                return;
            }
            const tokenData = await decodeToken(token);
            if (tokenData === false) {
                reply.code(400).send({ error: "Invalid token" });
                return;
            }
            const userId = await getUserIdByUid(tokenData.uid);
            if (userId === false) {
                reply.code(400).send({ error: "Invalid token" });
                return;
            }
            deactiveSession(tokenData.session.uuid);
            reply.code(200).send({ userId });
        }
    };
};
//# sourceMappingURL=deviceCheckToken.js.map