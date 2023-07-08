// Libs
import "dotenv/config";
import Fastify from "fastify";
import modelsInit from "./modelsInit.js";
import databaseInit from "./databaseInit.js";
import routesInit from "./routesInit.js";
const init = async () => {
    const fastify = Fastify();
    await databaseInit(fastify);
    await modelsInit(fastify);
    await routesInit(fastify);
    return fastify;
};
const fastify = await init();
fastify.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=index.js.map