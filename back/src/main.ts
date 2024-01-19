import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Observer } from './classes/Observer';
import { AnnouncementPusher } from './classes/AnnouncementPusher.js';
import { dataSource } from './db.config.js';

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

    await app.listen(SERVER_PORT, '127.0.0.1', () => {
        console.log(`HTTP Сервер запущен на порту ${SERVER_PORT}`);
    });

    await dataSource.initialize().catch(console.error);

    const observer = new Observer(); // Запуск Observer для проверки времени и отправки звуков
    const announcementPusher = new AnnouncementPusher(); // Запуск AnnouncementPusher для отправки объявлений
}

runServer()
    .then(() => console.log('Успешный запуск'))
    .catch((e) => console.error('Ошибка запуска:', e));
