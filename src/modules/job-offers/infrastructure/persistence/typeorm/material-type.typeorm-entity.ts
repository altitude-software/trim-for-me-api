import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MaterialEntity } from './material.typeorm-entity';

@Entity('MATERIAL_TYPE')
export class MaterialTypeEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @OneToMany(() => MaterialEntity, (material) => material.type)
    materials!: MaterialEntity[];
}
