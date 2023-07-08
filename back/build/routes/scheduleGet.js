export default (fastify) => {
    return {
        method: "GET",
        url: "/schedule/:day",
        handler: async (request, reply) => {
            const { Lessons } = fastify.db.models;
            const { day } = request.params;
            const schedule = await Lessons.findAll({
                attributes: [
                    "id", "start_time", "end_time", "start_minute", "start_hour", "end_minute", "end_hour"
                ],
                where: { day_of_week: Number(day) }
            });
            reply.code(200).send(schedule);
        }
    };
};
//# sourceMappingURL=scheduleGet.js.map