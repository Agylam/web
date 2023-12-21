import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.js';

@Entity()
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => User, (user) => user.refresh_tokens)
    user: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;
}
