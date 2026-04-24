import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { JobOfferEntity } from './job-offer.typeorm-entity';

export enum EditLevelORM {
    BASIC = 'basic',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

@Entity('EDIT_LEVEL')
export class EditLevelEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: EditLevelORM })
    level!: EditLevelORM;

    @OneToOne(() => JobOfferEntity, (jobOffer) => jobOffer.editLevel)
    jobOffer!: JobOfferEntity;
}