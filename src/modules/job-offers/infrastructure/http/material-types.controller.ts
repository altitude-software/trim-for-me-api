import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMaterialTypesUseCase } from '../../application/use-cases/get-material-types.use-case';
import { MaterialTypeResponseDto } from '../../application/dtos/material-type-response.dto';

@ApiTags('material-types')
@Controller('material-types')
export class MaterialTypesController {
    constructor(
        private readonly getMaterialTypesUseCase: GetMaterialTypesUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Obtener los tipos de material disponibles' })
    @ApiResponse({ status: 200, description: 'Lista de tipos de material.', type: [MaterialTypeResponseDto] })
    async findAll() {
        return this.getMaterialTypesUseCase.execute();
    }
}
