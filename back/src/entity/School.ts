import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Sound } from './Sound';
import { ClassRange } from './ClassRange';
import { User } from './User.js';
import { Announcement } from './Announcement.js';

@Entity()
export class School extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string;

    @Column({ default: 0 })
    timezone_offset: number;

    @OneToMany(() => ClassRange, (class_range) => class_range.school)
    class_ranges: ClassRange[];

    @OneToMany(() => Announcement, (announcement) => announcement.school)
    announcements: Announcement[];

    @OneToMany(() => Sound, (sound) => sound.school)
    sounds: Sound[];

    @OneToMany(() => User, (user) => user.school)
    users: User[];

    static async getConfig(uuid: string) {
        return await this.findOneOrFail({
            where: { uuid },
            select: {
                uuid: true,
                name: true,
                timezone_offset: true,
                class_ranges: {
                    uuid: true,
                    start_sound: {
                        uuid: true,
                    },
                    end_sound: {
                        uuid: true,
                    },
                    lessons: {
                        day: true,
                        start_hour: true,
                        start_minute: true,
                        end_hour: true,
                        end_minute: true,
                    },
                },
            },
            relations: {
                class_ranges: {
                    start_sound: true,
                    end_sound: true,
                    lessons: true,
                },
            },
        });
    }
}
