import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { School } from './School';
import { createHash } from 'crypto';

export enum DeviceType {
    BELLS_CLIENT,
    RFID_READER,
}

@Entity()
export class Device extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'enum', enum: DeviceType })
    type: DeviceType;

    @Column({ unique: true })
    name: string;

    @Column()
    secret: string;

    @ManyToOne(() => School, (school) => school.class_ranges)
    @JoinColumn()
    school: School;

    // sha256(UUID+SECRET+random)
    static async authorize(uuid: string, random: string, token: string): Promise<false | Device> {
        const device = await this.findOne({
            where: { uuid: uuid },
            select: {
                uuid: true,
                type: true,
                name: true,
                secret: true,
                school: {
                    uuid: true,
                },
            },
        });
        if (device === null) return false;

        const hash = createHash('sha256')
            .update(device.uuid + device.secret + random)
            .digest('hex');
        if (hash !== token) return false;

        return device;
    }
}
