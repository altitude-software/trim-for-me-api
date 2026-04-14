import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { JobOfferEntity } from './job-offer.typeorm-entity';

export enum CompensationTypeORM {
    NEGOTIABLE = 'negotiable',
    PER_MINUTE = 'per_minute',
    PER_VIDEO = 'per_video',
}

@Entity('COMPENSATION')
export class CompensationEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: CompensationTypeORM })
    type!: CompensationTypeORM;

    @Column({ nullable: true, type: 'int', name: 'duration_in_minutes' })
    durationInMinutes!: number | null;

    @Column({ nullable: true, type: 'decimal' })
    amount!: number | null;

    @Column({ nullable: true, type: 'varchar' })
    currency!: string | null;

    @OneToOne(() => JobOfferEntity, (jobOffer) => jobOffer.compensation)
    jobOffer!: JobOfferEntity;
}