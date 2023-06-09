import jwt from "jsonwebtoken";
import { Md5 } from "ts-md5";
export default (fastify) => {
    const generateRandomHash = () => {
        const current_date = (new Date()).valueOf().toString();
        const random = Math.random().toString();
        return Md5.hashStr(current_date + random);
    };
    const generateRefreshToken = async (user) => {
        const { RefreshTokens } = fastify.db.models;
        const refreshToken = generateRandomHash() + generateRandomHash();
        const pastTokens = await RefreshTokens.findAll({
            where: {
                user_id: user.id,
                active: true
            }
        });
        if (pastTokens) {
            pastTokens.every(ls => ls.update({ active: false }));
        }
        RefreshTokens.create({
            user_id: user.id,
            token: refreshToken
        }).then(function (user) {
            // you can now access the newly created user
            console.log("success", user.toJSON());
        }).catch(function (err) {
            // print the error details
            console.log(err);
        });
        return refreshToken;
    };
    return {
        method: "POST",
        url: "/user/auth",
        handler: async (request, reply) => {
            const { Users } = fastify.db.models;
            const userParams = request.body;
            const userExists = await Users.findOne({
                where: {
                    email: userParams.email
                }
            });
            if (!userExists) {
                reply.code(400).send({ error: "Incorrect email or password" });
                return;
            }
            if (!userExists.validatePassword(userParams.password)) {
                reply.code(400).send({ error: "Incorrect email or password" });
                return;
            }
            const accessToken = jwt.sign({
                id: userExists.id,
                email: userExists.email,
                fullname: userExists.fullname,
                group_id: userExists.group_id
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });
            const refreshToken = await generateRefreshToken(userExists);
            reply.code(200).send({ accessToken, refreshToken });
        }
    };
};
//# sourceMappingURL=userAuth.js.map