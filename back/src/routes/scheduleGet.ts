import {FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods, RouteOptions} from "fastify";

export default (fastify: FastifyInstance): RouteOptions => {
	return {
		method: "GET" as HTTPMethods,
		url: "/schedule/:day",
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			const {Lessons} = fastify.db.models;
			const {day} = request.params as { day: number };
			const schedule = await Lessons.findAll({
				attributes: [
					"id","start_time", "end_time", "start_minute", "start_hour", "end_minute", "end_hour"
				],
				where: {day_of_week: Number(day)}
			});
			reply.code(200).send(schedule);
		}
	};
};
