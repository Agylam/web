import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './School.js';

export enum AnnouncementState {
    CREATED,
    PUSHED,
    PLAYING,
    PLAYED,
    ERROR,
}

@Entity()
export class Announcement extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ length: 2000 })
    text: string;

    @Column({ type: 'enum', enum: AnnouncementState, default: AnnouncementState.CREATED })
    state: AnnouncementState;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @ManyToOne(() => School, (school) => school.announcements)
    school: School;
}
