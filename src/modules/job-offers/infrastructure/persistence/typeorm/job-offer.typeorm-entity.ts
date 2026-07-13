import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../../../users/infrastructure/persistence/typeorm/user.typeorm-entity';
import { MaterialEntity } from './material.typeorm-entity';
import { CompensationEntity } from './compensation.typeorm-entity';

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

@Entity('JOB_OFFER')
export class JobOfferEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'creator_id' })
    creatorId!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ nullable: true, type: 'varchar', default: null })
    description!: string | null;

    @ManyToOne(() => UserEntity, (user) => user.jobOffers)
    @JoinColumn({ name: 'creator_id' })
    creator!: UserEntity;

    @OneToMany(() => MaterialEntity, (material) => material.jobOffer, { cascade: true, eager: true })
    materials!: MaterialEntity[];

    @Column({ type: 'enum', enum: VideoOrientationORM, default: VideoOrientationORM.HORIZONTAL })
    orientation!: VideoOrientationORM;

    @Column({ type: 'enum', enum: VideoLengthORM, default: VideoLengthORM.LONG })
    length!: VideoLengthORM;

    @Column({ type: 'enum', enum: EditLevelORM, default: EditLevelORM.INTERMEDIATE })
    level!: EditLevelORM;

    @OneToOne(() => CompensationEntity, (c) => c.jobOffer, { cascade: true, eager: true, nullable: true })
    @JoinColumn({ name: 'compensation_id' })
    compensation!: CompensationEntity | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}