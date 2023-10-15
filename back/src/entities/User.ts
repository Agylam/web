import {
    BaseEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { School } from './School.js';
import { RefreshToken } from './RefreshToken.js';
import { Role } from './Role.js';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column()
    fullName: string;

    @ManyToOne(() => School, (school) => school.users)
    school: School;

    @OneToMany(() => RefreshToken, (refresh_token) => refresh_token.user)
    refresh_tokens: RefreshToken[];

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    roles: Role[];
}
