import { UserRole } from '../../domain/entities/user.entity';

export class UserResponseDto {
    id!: string;
    email!: string;
    role!: UserRole;
    name!: string | null;
    createdAt!: Date;
    updatedAt!: Date;
}