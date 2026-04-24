import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'jose@email.com' })
    email!: string;

    @ApiProperty({ example: 'password123' })
    password!: string;
}