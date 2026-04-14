import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/entities/user.entity';

export class UserResponseDto {
    @ApiProperty({ example: 'uuid-here' })
    id!: string;

    @ApiProperty({ example: 'jose@email.com' })
    email!: string;

    @ApiProperty({ enum: UserRole, example: UserRole.CREATOR })
    role!: UserRole;

    @ApiProperty({ example: 'José Manuel', nullable: true })
    name!: string | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}