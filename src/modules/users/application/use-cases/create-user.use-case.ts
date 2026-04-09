import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { EmailAlreadyInUseException } from '../../domain/exceptions/email-already-in-use.exception';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher.interface';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IPasswordHasher')
        private readonly passwordHasher: IPasswordHasher,
    ) { }

    async execute(dto: CreateUserDto): Promise<UserResponseDto> {
        const id = new Uuid();
        const email = new Email(dto.email);

        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new EmailAlreadyInUseException(dto.email);

        const hashedPassword = await this.passwordHasher.hash(dto.password);

        const user = User.create({
            id: id,
            email: email,
            password: hashedPassword,
            role: dto.role,
            name: dto.name ?? null,
        });

        await this.userRepository.save(user);

        return this.toResponse(user);
    }

    private toResponse(user: User): UserResponseDto {
        return {
            id: user.id.value,
            email: user.email.value,
            role: user.role,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}