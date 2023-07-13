import {FastifyInstance} from "fastify";

import deviceGenerateSessionRouter from "./routes/deviceGenerateSession.js";
import deviceCreate from "./routes/deviceCreate.js";
import userCreate from "./routes/userCreate.js";
import userAuth from "./routes/userAuth.js";
import deviceCheckToken from "./routes/deviceCheckToken.js";
import userUpdateToken from "./routes/userUpateToken.js";
import scheduleGet from "./routes/scheduleGet.js";
import scheduleUpdate from "./routes/scheduleUpdate.js";

export default async (fastify : FastifyInstance) => {
	// TODO: Refactor with Promise.all()
	await fastify.route(deviceGenerateSessionRouter(fastify));
	await fastify.route(deviceCreate(fastify));
	await fastify.route(deviceCheckToken(fastify));
	await fastify.route(userCreate(fastify));
	await fastify.route(userAuth(fastify));
	await fastify.route(userUpdateToken(fastify));
	await fastify.route(scheduleGet(fastify));
	await fastify.route(scheduleUpdate(fastify));
};
