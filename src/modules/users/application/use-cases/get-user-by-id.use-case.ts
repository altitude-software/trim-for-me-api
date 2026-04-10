import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { GetUserByIdDto } from '../dtos/get-user-by-id.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(dto: GetUserByIdDto): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(new Uuid(dto.userId));
        if (!user) throw new UserNotFoundException(dto.userId);

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