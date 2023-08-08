import {BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {School} from "./School";
import {Lesson} from "./Lesson";
import {ClassRange} from "./ClassRange";

@Entity()
export class Sound extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @ManyToOne(() => School, (school) => school.sounds, {eager: true})
    school: School

    // @OneToMany(()=>ClassRange, (class_range) => class_range.sound)
    // class_ranges: ClassRange[]
}