import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { JobOfferEntity } from '../../../../job-offers/infrastructure/persistence/typeorm/job-offer.typeorm-entity';

export enum UserRoleORM {
    CREATOR = 'creator',
    EDITOR = 'editor',
}

@Entity('USER')
export class UserEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'enum', enum: UserRoleORM })
    role!: UserRoleORM;

    @Column({ nullable: true, type: 'varchar' })
    name!: string | null;

    @OneToMany(() => JobOfferEntity, (jobOffer) => jobOffer.creator)
    jobOffers!: JobOfferEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}