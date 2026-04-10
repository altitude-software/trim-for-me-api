import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';
import { DeleteUserDto } from '../dtos/delete-user.dto';

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(dto: DeleteUserDto): Promise<void> {
        const id = new Uuid(dto.userId);
        const user = await this.userRepository.findById(id);
        if (!user) throw new UserNotFoundException(dto.userId);

        await this.userRepository.delete(id);
    }
}