import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';

async function runServer() {
    const SERVER_PORT = process.env.SERVER_PORT || 3000;
    const app: INestApplication = await NestFactory.create<NestExpressApplication>(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Agylam API')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(SERVER_PORT, () => {
        console.log(`Сервер запущен на порту ${SERVER_PORT}`);
    });
}

runServer();
