import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IMaterialTypeRepository } from '../../../domain/repositories/material-type.repository';
import { MaterialType } from '../../../domain/entities/material-type.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { MaterialTypeEntity } from './material-type.typeorm-entity';

@Injectable()
export class TypeOrmMaterialTypeRepository implements IMaterialTypeRepository {
    constructor(
        @InjectRepository(MaterialTypeEntity)
        private readonly repo: Repository<MaterialTypeEntity>,
    ) { }

    async findAll(): Promise<MaterialType[]> {
        const entities = await this.repo.find();
        return entities.map((entity) =>
            MaterialType.reconstitute({
                id: new Uuid(entity.id),
                name: entity.name,
            }),
        );
    }
}
