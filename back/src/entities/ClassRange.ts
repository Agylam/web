import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    OneToOne,
    JoinColumn,
    BaseEntity,
    JoinTable
} from "typeorm";
import {School} from "./School";
import {Lesson} from "./Lesson";
import {Sound} from "./Sound";

@Entity()
export class ClassRange extends BaseEntity  {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @ManyToOne(() => School, (school) => school.class_ranges)
    school: School

    @OneToMany(()=>Lesson, (lesson) => lesson.class_range)
    @JoinColumn()
    lessons: Lesson[]

    @ManyToOne(() => Sound, {eager: true})
    start_sound: Sound

    @ManyToOne(() => Sound, {eager: true})
    end_sound: Sound
}