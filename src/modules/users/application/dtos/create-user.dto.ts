import { UserRole } from "../../domain/entities/user.entity";

export class CreateUserDto {
    email!: string;
    password!: string;
    role!: UserRole;
    name?: string;
}