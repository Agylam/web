import { Sequelize } from "sequelize";
export default async (fastify) => {
    const sequelize = await new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, { host: process.env.PGHOST, dialect: "postgres", logging: (...msg) => console.log(msg) });
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
    await fastify.decorate("db", sequelize);
};
//# sourceMappingURL=databaseInit.js.map