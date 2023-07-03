import { FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods, RouteOptions } from "fastify";
import { LessonsClass } from "../models/Lessons.js";

export default (fastify: FastifyInstance): RouteOptions => {
    return {
        method: "PUT" as HTTPMethods,
        url: "/schedule/:id",
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const { Lessons } = fastify.db.models;
            const { id } = request.params as { id: number };
            const newSchedule = request.body as LessonsClass;

            const schedule = await Lessons.findOne({
                where: {
                    id: Number(id),
                },
            });
            if (!schedule) {
                reply.code(400).send({ error: "Invalid ID" });
                return;
            }

            const scheduleUpdated = await Lessons.update(newSchedule, {
                where: {
                    id: Number(id),
                },
            });
            if (scheduleUpdated[0] != 1) {
                reply.code(400).send({ error: "Invalid ID" });
                return;
            }

            reply.code(200).send({ status: "OK" });
        },
    };
};
