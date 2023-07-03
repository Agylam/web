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
        method: "GET",
        url: "/user/refresh_token/:refresh_token",
        handler: async (request, reply) => {
            const { RefreshTokens } = fastify.db.models;
            const { refresh_token } = request.params;
            const activeToken = await RefreshTokens.findOne({
                where: {
                    token: refresh_token,
                    active: true
                }
            });
            if (!activeToken) {
                reply.code(400).send({ error: "Incorrect refresh token" });
                return;
            }
            activeToken.update({ active: false }, {
                where: {
                    token: refresh_token,
                    active: true
                }
            });
            const user = await activeToken.getUser();
            if (!user) {
                reply.code(400).send({ error: "Incorrect refresh token" });
                return;
            }
            const accessToken = jwt.sign({
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                group_id: user.group_id
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN });
            const refreshToken = await generateRefreshToken(user);
            reply.code(200).send({ accessToken, refreshToken });
        }
    };
};
//# sourceMappingURL=userUpateToken.js.map