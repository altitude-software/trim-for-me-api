import { ApiProperty } from '@nestjs/swagger';

export class MaterialTypeResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() name!: string;
}
