import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../../../users/infrastructure/persistence/typeorm/user.typeorm-entity';
import { MaterialEntity } from './material.typeorm-entity';
import { VideoFormatEntity } from './video-format.typeorm-entity';
import { EditLevelEntity } from './edit-level.typeorm-entity';
import { CompensationEntity } from './compensation.typeorm-entity';

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

    @OneToMany(() => MaterialEntity, (material) => material.jobOffer, { cascade: true, eager: true })
    materials!: MaterialEntity[];

    @OneToOne(() => VideoFormatEntity, (vf) => vf.jobOffer, { cascade: true, eager: true })
    @JoinColumn({ name: 'video_format_id' })
    videoFormat!: VideoFormatEntity;

    @OneToOne(() => EditLevelEntity, (el) => el.jobOffer, { cascade: true, eager: true })
    @JoinColumn({ name: 'edit_level_id' })
    editLevel!: EditLevelEntity;

    @OneToOne(() => CompensationEntity, (c) => c.jobOffer, { cascade: true, eager: true })
    @JoinColumn({ name: 'compensation_id' })
    compensation!: CompensationEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}