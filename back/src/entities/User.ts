import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './School.js';
import { RefreshToken } from './RefreshToken.js';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @ManyToOne(() => School, (school) => school.users)
    school: School;

    @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
    refresh_tokens: RefreshToken[];
}
