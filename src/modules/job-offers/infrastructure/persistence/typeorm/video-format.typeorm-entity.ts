import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { JobOfferEntity } from './job-offer.typeorm-entity';

export enum VideoOrientationORM {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
}

export enum VideoLengthORM {
    SHORT = 'short',
    LONG = 'long',
}

@Entity('VIDEO_FORMAT')
export class VideoFormatEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: VideoOrientationORM })
    orientation!: VideoOrientationORM;

    @Column({ type: 'enum', enum: VideoLengthORM })
    length!: VideoLengthORM;

    @Column({ nullable: true, type: 'varchar', name: 'technical_format' })
    technicalFormat!: string | null;

    @OneToOne(() => JobOfferEntity, (jobOffer) => jobOffer.videoFormat)
    jobOffer!: JobOfferEntity;
}