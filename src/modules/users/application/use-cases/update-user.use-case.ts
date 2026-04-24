import { Injectable, Inject } from '@nestjs/common';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher.interface';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IPasswordHasher')
        private readonly passwordHasher: IPasswordHasher,
    ) { }

    async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        const id = new Uuid(userId);

        const user = await this.userRepository.findById(id);
        if (!user) throw new UserNotFoundException(userId);

        if (dto.name !== undefined) {
            user.updateName(dto.name);
        }

        if (dto.password) {
            const hashedPassword = await this.passwordHasher.hash(dto.password);
            user.updatePassword(hashedPassword);
        }

        await this.userRepository.save(user);

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