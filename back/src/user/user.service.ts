import { Injectable } from '@nestjs/common';
import { User } from '../entities/User.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

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
