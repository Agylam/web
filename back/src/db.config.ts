import 'dotenv/config';
import { School } from './entities/School';
import { Lesson } from './entities/Lesson';
import { Sound } from './entities/Sound';
import { ClassRange } from './entities/ClassRange';
import { User } from './entities/User';
import { RefreshToken } from './entities/RefreshToken';
import { Role } from './entities/Role';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Announcement } from './entities/Announcement.js';

export const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: 5432,
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
    synchronize: true,
    logging: false,
    entities: [School, Lesson, Sound, ClassRange, User, RefreshToken, Role, Announcement],
    migrations: [],
    subscribers: [],
};
export const dataSource = new DataSource(typeOrmConfig);
