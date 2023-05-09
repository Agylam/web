import "reflect-metadata";
import "dotenv/config";
import {Action, createExpressServer} from "routing-controllers";

import {verify} from 'jsonwebtoken';
import {AuthController} from "./controllers/AuthController.js";
import {ScheduleController} from "./controllers/ScheduleController.js";
import {NavLinksController} from "./controllers/NavLinksController.js";

createExpressServer({
    controllers: [
        AuthController,
        ScheduleController,
        NavLinksController
    ],
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: process.env.CORS_METHODS,
        allowedHeaders: process.env.CORS_ALLOWEDHEADERS,
    },
    currentUserChecker: async (action: Action) => {
        const token = action.request.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decodedToken = verify(token, process.env.JWT_SECRET as string);
                return decodedToken;
            } catch (error) {
                return null;
            }
        }
        return null;
    }
}).listen(process.env.PORT, () => {
    console.log("Server started on port " + process.env.PORT);
});
