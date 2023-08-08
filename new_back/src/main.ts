import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as process from 'process';

async function runServer() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.SERVER_PORT || 3000, () => {
        console.log('Сервер запущен на порту ' + (process.env.SERVER_PORT || 3000));
    });
}

runServer().then(() => {
    console.log('Загрузка сервера...');
});
