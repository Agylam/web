// Libs
import "dotenv/config";
import Fastify from "fastify";
import type { FastifyCookieOptions } from "@fastify/cookie"
import cookie from "@fastify/cookie"
import { Sequelize } from "sequelize";
import modelsInit from "./modelsInit.js";
import databaseInit from "./databaseInit.js";
import routesInit from "./routesInit.js";

declare module "fastify" {
    interface FastifyInstance {
        db: Sequelize;
    }
}

const init = async () => {
	const fastify = Fastify();

    fastify.register(cookie, {
        secret: "12345", // for cookies signature
        parseOptions: {}     // options for parsing cookies
    } as FastifyCookieOptions);

	await databaseInit(fastify);
	await modelsInit(fastify);
	await routesInit(fastify);
	return fastify;
};

const fastify = await init();

fastify.listen({ port: Number(process.env.BACKEND_PORT) , host: "0.0.0.0" }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
