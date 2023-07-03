import { FastifyInstance, RouteOptions } from "fastify";

export default (fastify: FastifyInstance): RouteOptions => {
    const makeSecret = async () => {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*!@#$%^&*";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 32) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    };
    return {
        method: "GET",
        url: "/device/create",
        handler: async (request, reply) => {
            const { Devices } = fastify.db.models;
            const device = await Devices.create({ secret: await makeSecret() });
            reply.code(200).send(device);
        },
    };
};
