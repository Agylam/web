export default (fastify) => {
    return {
        method: "PUT",
        url: "/schedule/:id",
        handler: async (request, reply) => {
            const { Lessons } = fastify.db.models;
            const { id } = request.params;
            const newSchedule = request.body;
            const schedule = await Lessons.findOne({
                where: {
                    id: Number(id)
                }
            });
            if (!schedule) {
                reply.code(400).send({ error: "Invalid ID" });
                return;
            }
            const scheduleUpdated = await Lessons.update(newSchedule, {
                where: {
                    id: Number(id)
                }
            });
            if (scheduleUpdated[0] != 1) {
                reply.code(400).send({ error: "Invalid ID" });
                return;
            }
            reply.code(200).send({ status: "OK" });
        }
    };
};
//# sourceMappingURL=scheduleUpdate.js.map