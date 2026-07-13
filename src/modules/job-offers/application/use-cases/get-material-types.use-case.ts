import { Injectable, Inject } from '@nestjs/common';
import type { IMaterialTypeRepository } from '../../domain/repositories/material-type.repository';
import { MaterialTypeResponseDto } from '../dtos/material-type-response.dto';

@Injectable()
export class GetMaterialTypesUseCase {
    constructor(
        @Inject('IMaterialTypeRepository')
        private readonly materialTypeRepository: IMaterialTypeRepository,
    ) { }

    async execute(): Promise<MaterialTypeResponseDto[]> {
        const materialTypes = await this.materialTypeRepository.findAll();
        return materialTypes.map((materialType) => ({
            id: materialType.id.value,
            name: materialType.name,
        }));
    }
}
