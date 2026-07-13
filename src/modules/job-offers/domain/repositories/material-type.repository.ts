import { MaterialType } from '../entities/material-type.entity';

export interface IMaterialTypeRepository {
    findAll(): Promise<MaterialType[]>;
}
