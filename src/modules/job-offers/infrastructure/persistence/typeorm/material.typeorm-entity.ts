import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { JobOfferEntity } from './job-offer.typeorm-entity';
import { MaterialTypeEntity } from './material-type.typeorm-entity';

@Entity('MATERIAL')
@Check(`"quantity" >= 0`)
@Check(`"duration" >= 0`)
export class MaterialEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    url!: string;

    @Column({ nullable: true, type: 'varchar' })
    description!: string | null;

    @Column({ nullable: true, type: 'int' })
    duration!: number | null;

    @Column({ nullable: true, type: 'int' })
    quantity!: number | null;

    @ManyToOne(() => JobOfferEntity, (jobOffer) => jobOffer.materials, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_offer_id' })
    jobOffer!: JobOfferEntity;

    @ManyToOne(() => MaterialTypeEntity, (materialType) => materialType.materials, { nullable: true, eager: true })
    @JoinColumn({ name: 'type' })
    type!: MaterialTypeEntity | null;
}