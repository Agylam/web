import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import * as process from "process";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { ConnectionManager } from "./classes/ConnectionManager";
import { Lesson } from "./entities/Lesson";
import { DataSource } from "typeorm";
import { School } from "./entities/School";
import { Sound } from "./entities/Sound";
import { ClassRange } from "./entities/ClassRange";
import { NtpTimeSync } from "ntp-time-sync";
import { User } from "./entities/User";
import { RefreshToken } from "./entities/RefreshToken";
import { Role } from "./entities/Role";

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: 5432,
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
    synchronize: true,
    logging: false,
    entities: [School, Lesson, Sound, ClassRange, User, RefreshToken, Role],
    migrations: [],
    subscribers: [],
});

async function runServer() {
    const SERVER_PORT = process.env.BACKEND_PORT || 3000;
    const app: INestApplication = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Agylam API')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);
    app.use(cookieParser());

    await app.listen(SERVER_PORT, () => {
        console.log(`Сервер запущен на порту ${SERVER_PORT}`);
    });

    const ws_server_properties = { port: process.env.WS_SERVER_PORT };
    const timeSync = NtpTimeSync.getInstance();

    const getTime = async () => {
        let now = new Date();
        try {
            const ntpTime = await timeSync.getTime();
            now = ntpTime.now;
        } catch (e) {
            console.error('NTP', e);
        }
        const hour = now.getHours();
        const minute = now.getMinutes();
        const seconds = now.getSeconds();
        const day = now.getDay();

        console.log({ hour, minute, seconds, day });
        return { hour, minute, seconds, day };
    };

    AppDataSource.initialize()
        .then(async () => {
            const getSoundsByTime = async ({ hour, minute, day }) => {
                const start_lessons = await Lesson.getLessonsByStartTime(hour, minute, day);
                const end_lessons = await Lesson.getLessonsByEndTime(hour, minute, day);

                console.log('lessons', start_lessons, end_lessons);

                const start_sounds = start_lessons.map((l) => l.class_range.start_sound);
                const end_sounds = end_lessons.map((l) => l.class_range.end_sound);

                return start_sounds.concat(end_sounds);
            };
            const check = async () => {
                try {
                    const time = await getTime();
                    const sounds = await getSoundsByTime({
                        ...time,
                        day: time.day - 1,
                    });
                    sounds.map(async (sound) => {
                        try {
                            const school_uuid = sound.school.uuid;
                            console.log(school_uuid, 'PLAY ' + sound.uuid);
                            await connectionManager.sendToSchool(school_uuid, 'PLAY ' + sound.uuid);
                        } catch (e) {
                            console.error('SoundsMap Error. Sound UUID:', sound.uuid, 'Error:', e);
                        }
                    });

                    const preSounds = await getSoundsByTime({
                        hour: time.hour,
                        minute: time.minute + 1,
                        day: time.day - 1,
                    });
                    preSounds.map(async (sound) => {
                        try {
                            const school_uuid = sound.school.uuid;
                            console.log(school_uuid,"WARN "' + sound.uuid);
                            await connectionManager.sendToSchool(school_uuid,"WARN "' + sound.uuid);
                        } catch (e) {
                            console.error("preSound Error. Sound UUID: ", sound.uuid, "Error:", e);
                        }
                    });
                } catch (e) {
                    console.error("Check");
                }
            };

            const connectionManager = new ConnectionManager(ws_server_properties, () => {
                getTime().then(({ seconds }) => {
                    setTimeout(
                        () => {
                            console.log('Успешный запуск');
                            check();
                            setInterval(check, 60000);
                        },
                        seconds == 0 ? 1 : (60 - seconds) * 1000,
                    );
                });
            });
        })
        .catch(console.error);
}

runServer();
