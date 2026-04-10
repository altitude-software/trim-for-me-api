import { User, UserRole } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { UserEntity, UserRoleORM } from '../typeorm/user.typeorm-entity';

export class UserMapper {
    static toDomain(orm: UserEntity): User {
        return User.reconstitute({
            id: new Uuid(orm.id),
            email: new Email(orm.email),
            password: orm.password,
            role: orm.role as unknown as UserRole,
            name: orm.name,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    static toOrm(domain: User): UserEntity {
        const entity = new UserEntity();
        entity.id = domain.id.value;
        entity.email = domain.email.value;
        entity.password = domain.password;
        entity.role = domain.role as unknown as UserRoleORM;
        entity.name = domain.name;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }
}