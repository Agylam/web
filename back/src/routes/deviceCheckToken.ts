import { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { DevicesRepository } from "../repositories/devicesRepository.js";
import TokenData = DevicesRepository.TokenData;
import { DevicesService } from "../services/devicesService.js";
import { InvalidToken } from "../exceptions/invalidToken.js";
import { MissingToken } from "../exceptions/missingToken.js";

export default (fastify: FastifyInstance): RouteOptions => {
    const devicesService = DevicesService.init(fastify);

    return {
        method: "PUT",
        url: "/device/check_token/",
        handler: async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
            const { token } = request.body as { token: string };

            if (!token) {
                const error: MissingToken = new MissingToken();
                reply.code(400).send({ error: error.message });
                throw error;
            }

            const userId: number | InvalidToken = await devicesService.checkToken(token);

            if (userId instanceof Error) {
                reply.code(500).send({ error: userId.message });
                throw userId;
            }

            reply.code(200).send({ userId });
        },
    };
};
