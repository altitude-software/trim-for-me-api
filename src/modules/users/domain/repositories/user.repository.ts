import { User } from '../entities/user.entity';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Email } from '..//value-objects/email.vo';

export interface IUserRepository {
    save(user: User): Promise<void>;
    findById(id: Uuid): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    delete(id: Uuid): Promise<void>;
}