import { Sequelize } from "sequelize";
import { FastifyInstance } from "fastify";

const databaseInit = async (fastify: FastifyInstance) => {
    const sequelize = new Sequelize(
        process.env.PGDATABASE as string,
        process.env.PGUSER as string,
        process.env.PGPASSWORD as string,
        { host: process.env.PGHOST, dialect: "postgres", logging: false }
    );
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to thexx database:", error);
        process.exit(1);
    }
    fastify.decorate("db", sequelize);
};

export default databaseInit;
