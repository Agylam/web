import {FastifyInstance} from "fastify";
import {DevicesInit} from "./models/Devices.js";
import {UidSessionsInit} from "./models/UidSessions.js";
import {UsersInit} from "./models/Users.js";
import {RefreshTokensInit} from "./models/RefreshTokens.js";
import {LessonsInit} from "./models/Lessons.js";

export default async (fastify: FastifyInstance) => {
	await DevicesInit(fastify);
	await UidSessionsInit(fastify);
	await UsersInit(fastify);
	await RefreshTokensInit(fastify);
	await LessonsInit(fastify);
};
