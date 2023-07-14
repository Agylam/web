import { genSalt, hash } from "bcrypt-ts";
import { Op } from "sequelize";
export default (fastify) => {
    return {
        method: "POST",
        url: "/user/create",
        handler: async (request, reply) => {
            const { Users } = fastify.db.models;
            const userParams = request.body;
            userParams.password = await genSalt(10)
                .then((salt) => hash(userParams.password, salt));
            const userExists = await Users.findOne({
                where: {
                    [Op.or]: [
                        { email: userParams.email },
                        { uid: userParams.uid },
                        { fullname: userParams.fullname }
                    ]
                }
            });
            if (userExists) {
                reply.code(400).send({ error: "User already exists" });
                return;
            }
            const user = await Users.create({ ...userParams });
            if (!user) {
                reply.code(400).send({ error: "User already exists" });
                return;
            }
            reply.code(200).send(user);
        }
    };
};
//# sourceMappingURL=userCreate.js.map