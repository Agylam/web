import {Sequelize} from "sequelize";
import {FastifyInstance} from "fastify";

export default async (fastify: FastifyInstance) => {
	const sequelize = await new Sequelize(
        process.env.PGDATABASE as string,
        process.env.PGUSER as string,
        process.env.PGPASSWORD as string,
        {host: process.env.PGHOST, dialect: "postgres", logging: (...msg) => console.log(msg)},
	);
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to thexx database:", error);
		process.exit(1);
	}
	await fastify.decorate("db", sequelize);
};

