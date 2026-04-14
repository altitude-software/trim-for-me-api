import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'jose@email.com' })
    email!: string;

    @ApiProperty({ example: 'password123' })
    password!: string;

    @ApiProperty({ enum: UserRole, example: UserRole.CREATOR })
    role!: UserRole;

    @ApiPropertyOptional({ example: 'José Manuel' })
    name?: string;
}