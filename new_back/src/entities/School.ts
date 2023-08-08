import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { createHash } from "crypto";
import {Lesson} from "./Lesson";
import {Sound} from "./Sound";
import {ClassRange} from "./ClassRange";

@Entity()
export class School extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column()
    name: string;

    @Column()
    director_id: number;

    @Column()
    auth_secret: string;

    @OneToMany(()=>ClassRange, (class_range) => class_range.school)
    class_ranges: ClassRange[]

    @OneToMany(()=>Sound, (sound) => sound.school)
    sounds: Sound[]

    // sha256(UUID+SECRET+random)
    static async authorizate(uuid : string, random : string, token : string) : Promise<boolean> {
        const school = await this.findOneBy({uuid:uuid});

        if (school === null) return false;

        const unhash = school.uuid + school.auth_secret + random
        const hash = createHash('sha256').update(unhash).digest('hex');
        return hash === token;
    }
}
