import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './School';

@Entity()
export class Sound extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => School, (school) => school.sounds, { eager: true })
    school: School;

    // @OneToMany(()=>ClassRange, (class_range) => class_range.sound)
    // class_ranges: ClassRange[]
}
