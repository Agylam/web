import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './School.js';

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

    @Column({ length: 2000 })
    text: string;

    @Column({ type: 'enum', enum: AnnouncementState, default: AnnouncementState.CREATED })
    state: AnnouncementState;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @Column({ type: 'enum', enum: SpeechModel, default: SpeechModel.PAVEL_HIFIGAN })
    speech_model: SpeechModel;

    @ManyToOne(() => School, (school) => school.announcements)
    school: School;
}
