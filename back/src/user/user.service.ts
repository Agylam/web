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

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(uuid: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ uuid });
    }

    async remove(uuid: number): Promise<void> {
        await this.usersRepository.delete(uuid);
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOneBy({ email });
    }
}
