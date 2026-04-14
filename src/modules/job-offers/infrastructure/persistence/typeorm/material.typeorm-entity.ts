import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { JobOfferEntity } from './job-offer.typeorm-entity';

@Entity('MATERIAL')
export class MaterialEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    url!: string;

    @Column()
    type!: string;

    @Column({ nullable: true, type: 'varchar' })
    description!: string | null;

    @ManyToOne(() => JobOfferEntity, (jobOffer) => jobOffer.materials, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_offer_id' })
    jobOffer!: JobOfferEntity;
}