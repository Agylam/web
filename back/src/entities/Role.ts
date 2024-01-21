import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.js';

@Entity()
export class Role extends BaseEntity {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'admin', description: 'Уникальное имя роли ' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ example: 'Администратор', description: 'Описание роли' })
    @Column()
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}
