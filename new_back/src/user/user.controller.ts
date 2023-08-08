import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User } from '../entities/User.js';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }
}
