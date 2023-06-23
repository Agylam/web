import {FastifyInstance, FastifyReply, FastifyRequest, HTTPMethods} from "fastify";
import type {UserAttributes} from "../interfaces/user";
import {genSalt, hash} from "bcrypt-ts";
import {Op} from "sequelize";

export default (fastify: FastifyInstance) => {
	return {
		method: "POST" as HTTPMethods,
		url: "/user/create",
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			const {Users} = fastify.db.models;
			const userParams = request.body as UserAttributes;
			userParams.password = await genSalt(10)
				.then((salt) => hash(userParams.password, salt));
			const userExists = await Users.findOne({
				where: {
					[Op.or]: [
						{email: userParams.email},
						{uid: userParams.uid},
						{fullname: userParams.fullname}
					]
				}
			});
			if (userExists) {
				reply.code(400).send({error: "User already exists"});
				return;
			}
			const user = await Users.create({...userParams});
			if (!user) {
				reply.code(400).send({error: "User already exists"});
				return;
			}
			reply.code(200).send(user);
		}
	};
};