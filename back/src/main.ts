import 'dotenv/config';
import {NestFactory, Reflector} from '@nestjs/core';
import * as process from 'process';
import {ApiProperty, ApiTags, DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import {
    BadRequestException,
    Body,
    CanActivate,
    Controller,
    ExecutionContext,
    forwardRef,
    Get,
    HttpException,
    HttpStatus,
    INestApplication,
    Injectable,
    Module,
    Param,
    Post,
    Put,
    Req,
    Res,
    SetMetadata,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DataSource,
    DataSourceOptions,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    MoreThan,
    OneToMany,
    PrimaryGeneratedColumn,
    Repository
} from "typeorm";
import {ConfigModule} from "@nestjs/config";
import {InjectRepository, TypeOrmModule} from "@nestjs/typeorm";
import {S3} from "aws-sdk";
import WebSocket, {WebSocketServer} from "ws";
import {createClient, RedisClientType} from "redis";
import {v4 as genUUID} from "uuid";
import {IsEmail, IsString, Length} from "class-validator";
import {createHash} from "crypto";
import {Request, Response} from "express";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {Observable} from "rxjs";

export enum AnnouncementState {
    CREATED,
    PUSHED,
    PLAYING,
    PLAYED,
    ERROR,
    SAVED,
}
export enum SpeechModel {
    KATHERINE = 'katherine',
    KATHERINE_HIFIGAN = 'katherine-hifigan',
    MARIA = 'maria',
    MARIA_SERIOUS = 'maria-serious',
    PAVEL = 'pavel',
    PAVEL_HIFIGAN = 'pavel-hifigan',
}
@Entity()
export class Announcement extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @Column({length: 2000})
    text: string;
    @Column({type: 'enum', enum: AnnouncementState, default: AnnouncementState.CREATED})
    state: AnnouncementState;
    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;
    @Column({type: 'enum', enum: SpeechModel, default: SpeechModel.PAVEL_HIFIGAN})
    speech_model: SpeechModel;
    @ManyToOne(() => School, (school) => school.announcements)
    school: School;
    static async getByUUID(uuid: string) {
        return await this.findOneBy({
            uuid,
        });
    }
}
@Entity()
export class ClassRange extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @Column({unique: true})
    name: string;
    @ManyToOne(() => School, (school) => school.class_ranges)
    @JoinColumn()
    school: School;
    @OneToMany(() => Lesson, (lesson) => lesson.class_range)
    @JoinColumn()
    lessons: Lesson[];
    @ManyToOne(() => Sound, {eager: true})
    start_sound: Sound;
    @ManyToOne(() => Sound, {eager: true})
    end_sound: Sound;
}
export enum DeviceType {
    BELLS_CLIENT,
    RFID_READER,
}
@Entity()
export class Device extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @Column({type: 'enum', enum: DeviceType})
    type: DeviceType;
    @Column({unique: true})
    name: string;
    @Column()
    secret: string;
    @ManyToOne(() => School, (school) => school.class_ranges)
    @JoinColumn()
    school: School;
    // sha256(UUID+SECRET+random)
    static async authorize(uuid: string, random: string, token: string): Promise<false | Device> {
        const device = await this.findOne({
            where: {uuid: uuid},
            select: {
                uuid: true,
                type: true,
                name: true,
                secret: true,
                school: {
                    uuid: true,
                },
            },
            relations: {
                school: true,
            },
        });
        if (device === null) return false;
        const hash = createHash('sha256')
            .update(device.uuid + device.secret + random)
            .digest('hex');
        if (hash !== token) return false;
        return device;
    }
}
@Entity()
export class Lesson extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @Column()
    day: number;
    // All time in UTC
    @Column()
    start_hour: number;
    @Column()
    start_minute: number;
    @Column()
    end_hour: number;
    @Column()
    end_minute: number;
    @ManyToOne(() => ClassRange, (class_range) => class_range.lessons)
    @JoinColumn()
    class_range: ClassRange;
    static async getLessonsByStartTime(hour, minute, day) {
        return await this.find({
            where: {start_hour: hour, start_minute: minute, day},
            relations: {
                class_range: {
                    start_sound: {
                        school: true,
                    },
                    end_sound: {
                        school: true,
                    },
                },
            },
        });
    }
    static async getLessonsByEndTime(hour, minute, day) {
        const res = await this.find({
            where: {end_hour: hour, end_minute: minute, day},
            relations: {
                class_range: {
                    start_sound: {
                        school: true,
                    },
                    end_sound: {
                        school: true,
                    },
                },
            },
        });
        return res;
    }
}
@Entity()
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @ManyToOne(() => User, (user) => user.refresh_tokens)
    user: User;
    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    created_at: Date;
}
@Entity()
export class Role extends BaseEntity {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty({example: 'admin', description: 'Уникальное имя роли '})
    @Column({unique: true})
    name: string;
    @ApiProperty({example: 'Администратор', description: 'Описание роли'})
    @Column()
    description: string;
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
@Entity()
export class School extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @Column()
    name: string;
    @Column()
    director_id: number;
    @Column()
    auth_secret: string;
    @Column({default: 0})
    timezone_offset: number;
    @OneToMany(() => ClassRange, (class_range) => class_range.school)
    class_ranges: ClassRange[];
    @OneToMany(() => Announcement, (announcement) => announcement.school)
    announcements: Announcement[];
    @OneToMany(() => Sound, (sound) => sound.school)
    sounds: Sound[];
    @OneToMany(() => User, (user) => user.school)
    users: User[];
}
@Entity()
export class Sound extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @ManyToOne(() => School, (school) => school.sounds)
    school: School;
}
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;
    @Column({unique: true})
    email: string;
    @Column()
    passwordHash: string;
    @Column()
    fullName: string;
    @ManyToOne(() => School, (school) => school.users)
    @JoinTable()
    school: School;
    @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
    refresh_tokens: RefreshToken[];
    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles: Role[];
}
const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: 5432,
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
    synchronize: true,
    logging: false,
    entities: [School, Lesson, Sound, ClassRange, User, RefreshToken, Role, Announcement, Device],
    migrations: [],
    subscribers: [],
};
const dataSource = new DataSource(typeOrmConfig);
class VKCloudVoice {
    readonly CLOUD_VOICE_ENDPOINT = 'https://voice.mcs.mail.ru/tts';
    private readonly __CLOUD_VOICE_API_KEY = process.env.CLOUD_VOICE_API_KEY;
    constructor() {
        if (!this.__CLOUD_VOICE_API_KEY) {
            throw new Error('CLOUD_VOICE_API_KEY is not defined');
        }
        console.log('VKCloudVoice started');
    }
    // get mp3 from text (TTS by VK Cloud) and download it to temp folder
    async streamTTS(text: string, model_name: SpeechModel = SpeechModel.PAVEL_HIFIGAN, tempo: number = 1) {
        const urlKeys = new URLSearchParams({
            model_name,
            tempo: tempo.toString(),
            encoder: 'mp3',
        }).toString();
        const url = this.CLOUD_VOICE_ENDPOINT + '?' + urlKeys;
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                Authorization: 'Bearer ' + this.__CLOUD_VOICE_API_KEY,
            },
            body: text,
            redirect: 'follow',
        });
        if (resp.ok && resp.body) {
            return await resp.arrayBuffer();
        } else {
            console.error('Error while TTS:', resp.status, resp.statusText);
        }
    }
}
class AnnouncementPusher {
    private __timer_id: NodeJS.Timeout;
    private __vkCloudVoice: VKCloudVoice;
    private __s3;
    private readonly __announcementRepository = dataSource.getRepository(Announcement);
    constructor() {
        if (!process.env.S3_ACCESS_KEY_ID) {
            throw new Error('S3_ACCESS_KEY_ID is not defined');
        }
        if (!process.env.S3_SECRET_ACCESS_KEY) {
            throw new Error('S3_SECRET_ACCESS_KEY is not defined');
        }
        if (!process.env.S3_REGION) {
            throw new Error('S3_REGION is not defined');
        }
        if (!process.env.S3_BUCKET) {
            throw new Error('S3_BUCKET is not defined');
        }
        if (!process.env.S3_ENDPOINT) {
            throw new Error('S3_ENDPOINT is not defined');
        }
        try {
            this.__timer_id = setInterval(async () => await this.__check(), 10000);
            this.__vkCloudVoice = new VKCloudVoice();
            this.__s3 = new S3({
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
                logger: console,
            });
            console.log('AnnouncementPusherInit successfull');
        } catch (e) {
            console.error('AnnouncementPusherInit error:', e);
        }
    }
    __uploadFile(buffer: ArrayBuffer, savePath: string) {
        return new Promise((resolve, reject) => {
            try {
                const params = {
                    Body: new Uint8Array(buffer),
                    Bucket: process.env.S3_BUCKET,
                    Key: savePath,
                };
                this.__s3.upload(params).send((err, data) => {
                    if (err) reject(err);
                    console.log('Успешно загружен файл по S3');
                    resolve(data);
                });
            } catch (err) {
                console.error('Невозможно загрузить файл. Ошика:', err);
                reject(err);
            }
        });
    }
    async __check() {
        const announcements = await this.__announcementRepository.find({
            where: {
                state: AnnouncementState.CREATED,
            },
            relations: {
                school: true,
            },
            select: {
                uuid: true,
                text: true,
                school: {
                    uuid: true,
                },
            },
        });
        announcements.map(async (announcement) => {
            const {uuid, text, school} = announcement;
            const filePath = 'schools/' + school.uuid + '/announcements/';
            const fileName = uuid + '.mp3';
            let announcementBuffer: ArrayBuffer;
            try {
                announcementBuffer = await this.__vkCloudVoice.streamTTS(text, announcement.speech_model);
                announcement.state = AnnouncementState.SAVED;
                await this.__announcementRepository.save(announcement);
                console.log('TTS файл сохранён:', filePath + fileName);
            } catch (e) {
                console.error('TTS ошибка сохранения:', e);
                announcement.state = AnnouncementState.ERROR;
                await this.__announcementRepository.save(announcement);
            }
            try {
                await this.__uploadFile(announcementBuffer, filePath + fileName);
                announcement.state = AnnouncementState.PUSHED;
                await this.__announcementRepository.save(announcement);
                console.log('Объявление загружено по S3 с UUID:', uuid);
            } catch (err) {
                console.error('Невозможно загрузить Объявление по S3. Ошибка:', err);
                announcement.state = AnnouncementState.ERROR;
                await this.__announcementRepository.save(announcement);
            }
        });
    }
}
class Connection {
    public uuid: string;
    public school_uuid: string;
    public device_uuid: string;
    public isAuthorized = false;
    private __connection: WebSocket;
    private readonly __auth_random: string;
    private readonly __connectionTimeout = 50000;
    private __onAuthorized: (deviceUUID: string) => void;
    constructor(connection: WebSocket) {
        this.uuid = genUUID();
        this.__auth_random = genUUID();
        this.__connection = connection;
        this.__connection.on('message', async (buf) => {
            try {
                const msg = buf.toString('utf8');
                const response = await this.msgHandler(msg);
                await this.send(response);
            } catch (e) {
                console.error('Ошибка в отправке сообщения:', e, 'DeviceUUID:', this.device_uuid);
                await this.send('ERROR Internal error, see console');
            }
        });
        console.log('WS UUID:', this.uuid, 'Новое подключение');
        this.authRequest()
            .then(() => console.log('WS UUID:', this.uuid, 'Отправил авторизационные данные'))
            .catch(async (e) => {
                console.error('Ошибка в отправке сообщения:', e, 'DeviceUUID:', this.device_uuid);
                await this.send('ERROR Internal error, see console');
            });
    }
    async msgHandler(msg: string): Promise<string> {
        const msg_sliced = msg.split(' ');
        if (msg_sliced.length === 0) return 'ERROR empty request';
        const cmd = msg_sliced[0];
        const args = msg_sliced.slice(1);
        if (!cmd) return 'ERROR empty request';
        switch (cmd) {
            case 'AUTH':
                return await this.onAuth(args);
            case 'PLAYED_ANNOUNCEMENT':
                if (args[0] === undefined) return 'ERROR announcement UUID is empty';
                const announcement = await Announcement.getByUUID(args[0]);
                if (announcement === null) return 'ERROR Announcement not found';
                announcement.state = AnnouncementState.PLAYED;
                await announcement.save();
                return 'OK';
            default:
                return 'ERROR Unknown command';
        }
    }
    async onAuth(args: string[]) {
        console.log('WS UUID:', this.uuid, 'Отправил авторизационные данные. Проверяю...');
        if (args[0] === undefined) return 'ERROR DEVICE_UUID is empty';
        if (args[1] === undefined) return 'ERROR auth token is empty';
        if (this.school_uuid !== undefined) return 'ERROR already authorized';
        const device = await Device.authorize(args[0], this.__auth_random, args[1]);
        if (device !== false) {
            this.device_uuid = args[0];
            this.school_uuid = device.school.uuid;
            this.isAuthorized = true;
            this.__onAuthorized(args[0]);
            console.log('WS UUID:', this.uuid, 'Проверил авторизационные данные. Успешно');
            return 'AUTHORIZED';
        } else {
            console.log('WS UUID:', this.uuid, 'Неверные авторизационные данные');
            await this.close('Invalid authorization data. Bye bye');
        }
    }
    async authRequest() {
        await this.send('AUTH_REQUEST ' + this.__auth_random);
        setTimeout(() => {
            if (!this.isAuthorized) this.close('Auth timeout');
        }, this.__connectionTimeout);
    }
    async send(msg) {
        this.__connection.send(msg);
    }
    async close(err: string | null) {
        if (err !== null) await this.send('ERROR ' + err);
        this.__connection.close();
    }
    onAuthorized(callback: (device_id: string) => void | Promise<void>) {
        this.__onAuthorized = callback;
    }
}
interface Connections {
    [key: string]: Connection;
}
class ConnectionManager {
    private __wsServer: WebSocketServer;
    private __connections: Connections = {};
    constructor(ws_server: WebSocketServer) {
        this.__wsServer = ws_server;
        this.__wsServer.on('connection', (ws_connection) => {
            const connection = this.__newConnection(ws_connection);
            connection.onAuthorized((device_uuid) => {
                const con_uuids = Object.keys(this.__connections);
                // Закрытие уже существующих подключений
                Object.values(this.__connections)
                    .map((con, key) => {
                        return con.device_uuid === device_uuid && con_uuids[key] !== connection.uuid ? key : -1;
                    })
                    .filter((index) => index !== -1)
                    .map((index) => {
                        this.__connections[con_uuids[index]].close('ERROR Another connection. Bye bye');
                    });
            });
            ws_connection.on('close', () => {
                delete this.__connections[connection.uuid];
            });
        });
    }
    getConnectionBySchoolUUID(uuid: string) {
        return Object.values(this.__connections).filter((e) => e.school_uuid === uuid && e.isAuthorized);
    }
    async sendToSchool(uuid: string, msg: string) {
        const schools = this.getConnectionBySchoolUUID(uuid);
        if (schools === undefined) {
            return false;
        }
        schools.map((school) => school.send(msg));
        return true;
    }
    private __newConnection(con: WebSocket) {
        const created_connection = new Connection(con);
        this.__connections[created_connection.uuid] = created_connection;
        return created_connection;
    }
}
enum RedidUpdateMessageType {
    SCHEDULE = 'SCHEDULE',
    CLASS_RANGE = 'CLASS_RANGE',
}
interface RedisUpdateMessage {
    school_uuid: string;
    type: RedidUpdateMessageType;
}
class Observer {
    private __wsServer: WebSocketServer;
    private __connectionManager: ConnectionManager;
    private __redisClient;
    constructor() {
        try {
            if (process.env.WS_SERVER_PORT == '') {
                throw new Error('WS_SERVER_PORT не указан');
            }
            this.__createWSServer();
            this.__initConnectionManager();
            this.__initRedisClient().then(() => console.log('Успешное подключение к кластеру Redis'));
            this.__subscribe().then(() => console.log('Успешная подписка на события Redis'));
        } catch (e) {
            console.error('Ошибка Observer:', e);
        }
    }
    private __createWSServer() {
        this.__wsServer = new WebSocketServer(
            {
                port: Number(process.env.WS_SERVER_PORT),
            },
            () => {
                console.log('WebSocket сервер успешно запущен на порту ', process.env.WS_SERVER_PORT);
            },
        );
    }
    private __initConnectionManager() {
        this.__connectionManager = new ConnectionManager(this.__wsServer);
    }
    private async __initRedisClient() {
        this.__redisClient = createClient({
            url: process.env.REDIS_URL,
        });
        this.__redisClient.on('error', (err) => console.log('Ошибка Observer: Ошибка Redis кластера:', err));
        await this.__redisClient.connect();
    }
    private async __subscribe() {
        await this.__redisClient.subscribe('UPDATE', (unparsed_message: string) => {
            let response = '';
            const message: RedisUpdateMessage = JSON.parse(unparsed_message);
            switch (message.type) {
                case RedidUpdateMessageType.CLASS_RANGE:
                    response = 'UPDATE_CLASS_RANGES';
                    break;
                case RedidUpdateMessageType.SCHEDULE:
                    response = 'UPDATE_SCHEDULE';
                    break;
            }
            this.__connectionManager.sendToSchool(message.school_uuid, response);
        });
    }
}
export class CreateUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    readonly email: string;
    @ApiProperty({example: '12345', description: 'пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;
}
@Injectable()
class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
    }
    async findAll(): Promise<User[]> {
        return [];
    }
    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({
            select: {
                uuid: true,
                fullName: true,
                email: true,
                passwordHash: true,
                school: {
                    uuid: true,
                },
                roles: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            where: {
                email,
            },
            relations: {
                school: true,
                roles: true,
            },
        });
    }
    async getUserRoles(userUUID: string) {
        return this.usersRepository.findOne({
            select: {
                roles: true,
            },
            where: {
                uuid: userUUID,
            },
            relations: {
                roles: true,
            },
        });
    }
}
@Controller('user')
class UserController {
    constructor(private userService: UserService) {
    }
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }
}
@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserService],
})
class UserModule {
}
@Injectable()
export class RedisService {
    private __cluster: RedisClientType;
    constructor() {
        this.__cluster = createClient({
            url: process.env.REDIS_URL,
        });
        this.__cluster.on('error', (err) => console.log('Ошибка Redis кластера:', err));
        this.__cluster.connect().then(() => console.log('Успешное подключение к кластеру Redis'));
    }
    pubUpdate(message: RedisUpdateMessage) {
        this.__cluster.publish('UPDATE', JSON.stringify(message));
    }
}
@Injectable()
export class AnnouncementService {
    constructor(
        @InjectRepository(Announcement)
        private announcementRepository: Repository<Announcement>,
        @InjectRepository(School)
        private schoolRepository: Repository<School>,
    ) {}
    async createAnnouncement(announcement: CreateAnnouncementDto) {
        const school = await this.schoolRepository.findOneBy({ uuid: announcement.schoolUuid });
        if (!school) throw new BadRequestException('Неизвестная школа');
        const announcementObj = new Announcement();
        announcementObj.text = announcement.text;
        announcementObj.school = school;
        const { text, uuid, state } = await announcementObj.save();
        return { text, uuid, state };
    }
}
interface AnnouncementCreateRequest extends RolesGuardRequest {}
@Controller('announcement')
export class AnnouncementController {
    constructor(private announcementService: AnnouncementService) {}
    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Post('/new')
    async update(@Req() req: AnnouncementCreateRequest) {
        const announcement = await this.announcementService.createAnnouncement({
            ...req.body,
            schoolUuid: req.user.school.uuid,
        });
        return {
            result: announcement,
        };
    }
}
@Module({
    providers: [AnnouncementService],
    controllers: [AnnouncementController],
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Announcement, School]),
        forwardRef(() => AuthModule),
    ],
    exports: [AnnouncementService],
})
export class AnnouncementModule {}
export class CreateAnnouncementDto {
    text: string;
    schoolUuid: string;
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export interface RolesGuardRequest extends Request {
    user: User;
}
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (!requiredRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            if (!authHeader) throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== 'Bearer' || !token)
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            const user = this.jwtService.verify(token);
            req.user = user;
            return user.roles.some((role: Role) => requiredRoles.includes(role.name));
        } catch (e) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }
    }
}
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }
            const user = this.jwtService.verify(token);
            req.user = user;
            return true;
        } catch (e) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
        }
    }
}
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshTokensRepository: Repository<RefreshToken>,
    ) {}
    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        const accessToken = await this.generateToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(oldRefreshToken: string) {
        const oldRefreshTokenObj = await this.getRefreshToken(oldRefreshToken);
        if (oldRefreshTokenObj === null) {
            return null;
        } else {
            const accessToken = await this.generateToken(oldRefreshTokenObj.user);
            const refreshToken = await this.generateRefreshToken(oldRefreshTokenObj.user);
            return { accessToken, refreshToken };
        }
    }
    private async getRefreshToken(refreshToken: string) {
        return await this.refreshTokensRepository.findOne({
            where: {
                uuid: refreshToken,
                created_at: MoreThan(new Date(new Date().getTime() - 86400000)),
            },
            relations: {
                user: {
                    roles: true,
                    school: true,
                },
            },
        });
    }
    private async generateToken(user: User) {
        const payload = {
            email: user.email,
            uuid: user.uuid,
            roles: user.roles.map((r) => r),
            school: {
                uuid: user.school.uuid,
            },
            fullname: user.fullName,
        };
        return this.jwtService.sign(payload);
    }
    private async generateRefreshToken(user: User) {
        await this.refreshTokensRepository
            .createQueryBuilder('')
            .delete()
            .where('userUuid = :uuid', { uuid: user.uuid })
            .execute();
        const refresh = new RefreshToken();
        refresh.user = user;
        await refresh.save();
        return refresh.uuid;
    }
    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (!user) throw new UnauthorizedException({ message: 'Неверные почта или пароль' });
        const passwordEquals = await bcrypt.compare(userDto.password, user.passwordHash);
        if (passwordEquals) return user;
        throw new UnauthorizedException({ message: 'Неверные почта или пароль' });
    }
}
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/login')
    async login(@Body() userDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken } = await this.authService.login(userDto);
        response.cookie('refreshToken', refreshToken, { httpOnly: true });
        return { accessToken };
    }
    @Post('/refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const newTokens = await this.authService.updateRefreshToken(req.cookies['refreshToken']);
        if (newTokens === null) {
            response.cookie('refreshToken', '', { httpOnly: true });
            throw new UnauthorizedException('Не найден refresh токен');
        }
        response.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true });
        return { accessToken: newTokens.accessToken };
    }
}
@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UserModule),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'SECRET',
            signOptions: {
                expiresIn: '10m',
            },
        }),
        TypeOrmModule.forFeature([RefreshToken]),
    ],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}
@Injectable()
export class ClassRangeService {
    constructor(
        private userService: UserService,
        @InjectRepository(ClassRange)
        private classRangesRepository: Repository<ClassRange>,
    ) {}
    async getList(schoolUUID: string) {
        return this.classRangesRepository.find({
            where: {
                school: {
                    uuid: schoolUUID,
                },
            },
            select: {
                uuid: true,
                name: true,
                start_sound: {
                    uuid: true,
                },
                end_sound: {
                    uuid: true,
                },
            },
        });
    }
    async getByUUID(uuid: string) {
        return await this.classRangesRepository.findOne({
            where: {
                uuid,
            },
            relations: {
                school: true,
            },
        });
    }
}
interface ClassRangeGetListRequest extends RolesGuardRequest {}
@Controller('class_range')
export class ClassRangeController {
    constructor(private classRangeService: ClassRangeService) {}
    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Get('/')
    async get(@Req() req: ClassRangeGetListRequest) {
        return await this.classRangeService.getList(req.user.school.uuid);
    }
}
@Module({
    providers: [ClassRangeService],
    controllers: [ClassRangeController],
    imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([ClassRange]), forwardRef(() => AuthModule)],
    exports: [ClassRangeService],
})
export class ClassRangeModule {}

export class LessonDto {
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
    start: string;
    end: string;
    class_range: string;
    day: number;
}
@Controller('schedule')
export class ScheduleController {
    constructor(private scheduleService: ScheduleService) {}
    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Get('/:class_range_uuid/:day')
    async get(@Param('class_range_uuid') class_range_uuid: string, @Param('day') day: number) {
        return this.scheduleService.getSchedule(class_range_uuid, day);
    }
    @Roles('headteacher')
    @UseGuards(RolesGuard)
    @Put('/:class_range_uuid/:day')
    async update(@Param('class_range_uuid') class_range_uuid: string, @Param('day') day: number, @Req() req: Request) {
        return this.scheduleService.updateSchedule(class_range_uuid, day, req.body);
    }
}

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Lesson)
        private lessonsRepository: Repository<Lesson>,
        private classRangesService: ClassRangeService,
        private redisService: RedisService,
    ) {}
    async getSchedule(classRange: string, dayOfWeek: number) {
        if (dayOfWeek < 0 || dayOfWeek > 6) throw new BadRequestException('Day must be from 0 to 6');
        const lessons = await this.lessonsRepository.find({
            where: {
                class_range: {
                    uuid: classRange,
                },
                day: dayOfWeek,
            },
        });
        const classRangeObj = await this.classRangesService.getByUUID(classRange);
        return lessons.map((lesson) => {
            return {
                ...lesson,
                start: this.timeToLocal(lesson.start_hour, lesson.start_minute, classRangeObj.school.timezone_offset),
                end: this.timeToLocal(lesson.end_hour, lesson.end_minute, classRangeObj.school.timezone_offset),
            };
        });
    }
    // dow = (date.getDate() || 7) - 1
    // Пн - 0 Вс - 6
    async updateSchedule(classRange: string, dayOfWeek: number, newSchedule: LessonDto[]) {
        if (dayOfWeek < 0 || dayOfWeek > 6) throw new BadRequestException('dayOfWeek must be from 0 yo 6');
        return await this.lessonsRepository.manager.transaction(async (transManager) => {
            await transManager
                .createQueryBuilder()
                .delete()
                .from(Lesson)
                .where('class_range = :cr', { cr: classRange })
                .andWhere('day = :day', { day: Number(dayOfWeek) })
                .execute();
            const classRangeObj = await this.classRangesService.getByUUID(classRange);
            await transManager
                .createQueryBuilder()
                .insert()
                .into(Lesson)
                .values(
                    newSchedule.map((lesson) => {
                        const startAfterRegex = /(\d{2})\:(\d{2})/gm.exec(lesson.start);
                        const endAfterRegex = /(\d{2})\:(\d{2})/gm.exec(lesson.end);
                        if (startAfterRegex === null) throw new BadRequestException('Неверный формат start (HH:MM) ');
                        if (endAfterRegex === null) throw new BadRequestException('Неверный формат end (HH:MM)');
                        const utcStart = this.timeFromLocal(
                            Number(startAfterRegex[1]),
                            Number(startAfterRegex[2]),
                            classRangeObj.school.timezone_offset,
                        );
                        const utcEnd = this.timeFromLocal(
                            Number(endAfterRegex[1]),
                            Number(endAfterRegex[2]),
                            classRangeObj.school.timezone_offset,
                        );
                        return {
                            start_hour: utcStart[0],
                            start_minute: utcStart[1],
                            end_hour: utcEnd[0],
                            end_minute: utcEnd[1],
                            day: dayOfWeek,
                            class_range: {
                                uuid: classRange,
                            },
                        };
                    }),
                )
                .execute();
            this.redisService.pubUpdate({
                type: RedidUpdateMessageType.SCHEDULE,
                school_uuid: classRangeObj.school.uuid,
            });
            return this.getSchedule(classRange, dayOfWeek);
        });
    }
    timeFromLocal(localHours: number, localMinutes: number, offset: number) {
        const localTimeMinutes = localHours * 60 + localMinutes;
        const utcTimeMinutes = localTimeMinutes - offset;
        let utcHours = Math.floor(utcTimeMinutes / 60);
        let utcMinutes = utcTimeMinutes % 60;
        utcHours = (utcHours < 0 ? 24 : 0) + utcHours;
        utcMinutes = (utcMinutes < 0 ? 60 : 0) + utcMinutes;
        return [utcHours, utcMinutes];
    }
    timeToLocal(utcHours: number, utcMinutes: number, offset: number) {
        if (typeof utcMinutes != 'number' || typeof utcHours != 'number')
            throw new Error('Неправильный формат времени');
        const utcTimeMinutes = utcHours * 60 + utcMinutes;
        const localTimeMinutes = utcTimeMinutes + offset;
        let localHours = Math.floor(localTimeMinutes / 60);
        let localMinutes = utcTimeMinutes % 60;
        localHours = (localHours > 23 ? -24 : 0) + localHours;
        localMinutes = (localMinutes > 60 ? -60 : 0) + localMinutes;
        return this.pad2num(localHours) + ':' + this.pad2num(localMinutes);
    }
    pad2num(num: number) {
        return (num < 10 ? '0' : '') + num;
    }
}
@Module({
    providers: [ScheduleService, RedisService],
    controllers: [ScheduleController],
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Lesson]),
        forwardRef(() => AuthModule),
        ClassRangeModule,
    ],
    exports: [ScheduleService],
})
export class ScheduleModule {}

@Module({
    controllers: [AuthController, UserController, ScheduleController, ClassRangeController, AnnouncementController],
    imports: [
        UserModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule,
        ScheduleModule,
        ClassRangeModule,
        AnnouncementModule,
    ],
    providers: [],
})
class AppModule {
}

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
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    await app.listen(SERVER_PORT, () => {
        console.log(`HTTP Сервер запущен на порту ${SERVER_PORT}`);
    });
    await dataSource.initialize().catch(console.error);
    new Observer(); // Запуск Observer для проверки времени и отправки звуков
    new AnnouncementPusher(); // Запуск AnnouncementPusher для отправки объявлений
}
runServer()
    .then(() => console.log('Успешный запуск'))
    .catch((e) => console.error('Ошибка запуска:', e));
