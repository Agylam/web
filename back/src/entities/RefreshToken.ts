import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.js';

@Entity()
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => User, (user) => user.refresh_tokens)
    user: User;

    @Column()
    active: boolean;
}
