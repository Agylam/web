import {JsonController, Post, Body, NotFoundError} from "routing-controllers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {DatabaseMim} from "../db.js";
import {IDBUser} from "../interfaces/IUser.js";
interface ILoginBody {
    email: string;
    password: string;
}

const DB = new DatabaseMim(process.env.DB_PATH as string);
@JsonController("/auth")
export class AuthController {
    @Post("/login")
    async login(@Body() body: ILoginBody) {
        return await DB.get<IDBUser>("SELECT * FROM users WHERE email = ?", [body.email]).then(async (user) => {
            if (!user) throw new NotFoundError(`User was not found.`);
            const match: boolean = await bcrypt.compare(body.password, user.password);
            if (!match) throw new NotFoundError(`User was not found.`);
            const token = jwt.sign(
                {id: user.id, email: user.email, fullName: user.fullName},
                process.env.JWT_SECRET as string,
                {expiresIn: process.env.JWT_EXPIRESIN}
            );
            return {token};
        })
    }
}
