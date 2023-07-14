const getRandomNumber = (min = 0, max = 0) => {
    return Math.ceil(Math.random() * (max - min) + min);
};
export default (fastify) => {
    return {
        method: "GET",
        url: "/device/generate_session/:device_id",
        handler: async (request, reply) => {
            const { device_id } = request.params;
            if (!device_id) {
                reply.code(400).send({ error: "Missing deviceId" });
                return;
            }
            const { UidSessions, Devices } = fastify.db.models;
            const device = await Devices.findOne({ where: { uuid: device_id } });
            if (!device) {
                reply.code(400).send({ error: "Invalid deviceId" });
                return;
            }
            const PCRandom = getRandomNumber(1, 65535);
            const lastSession = await UidSessions.findAll({ where: { device_id, active: true } });
            if (lastSession) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                lastSession.every((ls) => ls.update({ active: false }));
            }
            const session = await UidSessions.create({ PCRandom, device_id });
            reply.code(200).send(session);
        }
    };
};
//# sourceMappingURL=deviceGenerateSession.js.map