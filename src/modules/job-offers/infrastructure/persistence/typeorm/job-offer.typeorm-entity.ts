import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../../users/infrastructure/persistence/typeorm/user.typeorm-entity';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum VideoOrientationORM {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
}

export enum VideoLengthORM {
    SHORT = 'short',
    LONG = 'long',
}

export enum EditLevelORM {
    BASIC = 'basic',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}

export enum CompensationTypeORM {
    NEGOTIABLE = 'negotiable',
    PER_MINUTE = 'per_minute',
    PER_VIDEO = 'per_video',
}

// ─── Entidades relacionadas ───────────────────────────────────────────────────

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

    @ManyToOne(() => JobOfferEntity, (jobOffer) => jobOffer.materials, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'job_offer_id' })
    jobOffer!: JobOfferEntity;
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

@Entity('EDIT_LEVEL')
export class EditLevelEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'enum', enum: EditLevelORM })
    level!: EditLevelORM;

    @OneToOne(() => JobOfferEntity, (jobOffer) => jobOffer.editLevel)
    jobOffer!: JobOfferEntity;
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

// ─── Aggregate Root ───────────────────────────────────────────────────────────

@Entity('JOB_OFFER')
export class JobOfferEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'creator_id' })
    creatorId!: string;

    @Column({ nullable: true, type: 'varchar' })
    description!: string | null;

    @ManyToOne(() => UserEntity, (user) => user.jobOffers)
    @JoinColumn({ name: 'creator_id' })
    creator!: UserEntity;

    @OneToMany(() => MaterialEntity, (material) => material.jobOffer, {
        cascade: true,
        eager: true,
    })
    materials!: MaterialEntity[];

    @OneToOne(() => VideoFormatEntity, (vf) => vf.jobOffer, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({ name: 'video_format_id' })
    videoFormat!: VideoFormatEntity;

    @OneToOne(() => EditLevelEntity, (el) => el.jobOffer, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({ name: 'edit_level_id' })
    editLevel!: EditLevelEntity;

    @OneToOne(() => CompensationEntity, (c) => c.jobOffer, {
        cascade: true,
        eager: true,
    })
    @JoinColumn({ name: 'compensation_id' })
    compensation!: CompensationEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}