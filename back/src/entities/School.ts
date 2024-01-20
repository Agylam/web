import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { createHash } from 'crypto';
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

    @Column()
    director_id: number;

    @Column()
    auth_secret: string;

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

    // sha256(UUID+SECRET+random)
    static async authorizate(uuid: string, random: string, token: string): Promise<boolean> {
        const school = await this.findOneBy({ uuid: uuid });

        if (school === null) return false;

        const unhash = school.uuid + school.auth_secret + random;
        const hash = createHash('sha256').update(unhash).digest('hex');
        return hash === token;
    }
}
