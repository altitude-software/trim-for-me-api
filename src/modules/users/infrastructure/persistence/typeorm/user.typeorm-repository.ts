import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserEntity } from '../typeorm/user.typeorm-entity';
import { UserMapper } from '../mappers/user.mapper';
import { EmailAlreadyInUseException } from '../../../domain/exceptions/email-already-in-use.exception';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repo: Repository<UserEntity>,
    ) { }

    async save(user: User): Promise<void> {
        try {
            const entity = UserMapper.toOrm(user);
            await this.repo.save(entity);
        } catch (error: any) {
            // PostgreSQL unique violation code
            if (error?.code === '23505') {
                throw new EmailAlreadyInUseException(user.email.value);
            }
            throw error;
        }
    }

    async findById(id: Uuid): Promise<User | null> {
        const entity = await this.repo.findOneBy({ id: id.value });
        if (!entity) return null;
        return UserMapper.toDomain(entity);
    }

    async findByEmail(email: Email): Promise<User | null> {
        const entity = await this.repo.findOneBy({ email: email.value });
        if (!entity) return null;
        return UserMapper.toDomain(entity);
    }

    async delete(id: Uuid): Promise<void> {
        await this.repo.delete({ id: id.value });
    }
}