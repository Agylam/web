import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClassRange } from './ClassRange';

@Entity()
export class Lesson extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    day: number;

    // All time in UTC
    @Column()
    start_hour: number;

    @Column()
    start_minute: number;

    @Column()
    end_hour: number;

    @Column()
    end_minute: number;

    @ManyToOne(() => ClassRange, (class_range) => class_range.lessons)
    @JoinColumn()
    class_range: ClassRange;

    static async getLessonsByStartTime(hour, minute) {
        return await this.findBy({ start_hour: hour, start_minute: minute });
    }

    static async getLessonsByEndTime(hour, minute) {
        return await this.findBy({ end_hour: hour, end_minute: minute });
    }

    // static async getClassRange (uuid) {
    //     return await Lesson.createQueryBuilder("lesson")
    //         .leftJoinAndSelect("lesson.class_range", "class_range")
    //         .where("lesson.uuid = :uuid", { this })
    //         .getMany();
    // }
    //
    // getStartSound () {
    //     Lesson.getClassRange().then(console.log)
    //     return new Sound()//this.getClassRange()
    // }
    //
    // getEndSound () {
    //     return this.class_range.end_sound
    // }
    //
    // getSchool = () => {
    //     return this.class_range.school
    // }
}
