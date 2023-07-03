import { FastifyInstance } from "fastify";

import deviceGenerateSessionRouter from "../routes/deviceGenerateSession.js";
import deviceCreate from "../routes/deviceCreate.js";
import userCreate from "../routes/userCreate.js";
import userAuth from "../routes/userAuth.js";
import userUpdateToken from "../routes/userUpateToken.js";
import scheduleGet from "../routes/scheduleGet.js";
import scheduleUpdate from "../routes/scheduleUpdate.js";
import deviceCheckToken from "../routes/deviceCheckToken.js";

const routesInit = async (fastify: FastifyInstance): Promise<void> => {
    await Promise.all([
        fastify.route(deviceGenerateSessionRouter(fastify)),
        fastify.route(deviceCreate(fastify)),
        fastify.route(deviceCheckToken(fastify)),
        fastify.route(userCreate(fastify)),
        fastify.route(userAuth(fastify)),
        fastify.route(userUpdateToken(fastify)),
        fastify.route(scheduleGet(fastify)),
        fastify.route(scheduleUpdate(fastify)),
    ]);

    return;
};

export default routesInit;
