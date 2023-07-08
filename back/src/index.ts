// Libs
import "dotenv/config";
import Fastify from "fastify";
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
