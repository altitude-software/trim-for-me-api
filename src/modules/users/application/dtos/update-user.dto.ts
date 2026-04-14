import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'José Manuel' })
    name?: string;

    @ApiPropertyOptional({ example: 'newpassword123' })
    password?: string;
}