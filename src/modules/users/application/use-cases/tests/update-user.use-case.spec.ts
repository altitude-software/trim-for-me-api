import { UpdateUserUseCase } from '../update-user.use-case';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import type { IUserRepository } from '../../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../../domain/services/password-hasher.interface';

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

const mockPasswordHasher: jest.Mocked<IPasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
};

const makeUser = () =>
    User.reconstitute({
        id: new Uuid(),
        email: new Email('jose@example.com'),
        password: 'hashedPassword',
        role: UserRole.CREATOR,
        name: 'Jose',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('UpdateUserUseCase', () => {
    let useCase: UpdateUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new UpdateUserUseCase(mockUserRepository, mockPasswordHasher);
    });

    it('should update name successfully', async () => {
        const user = makeUser();
        mockUserRepository.findById.mockResolvedValue(user);
        mockUserRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(user.id.value, { name: 'New Name' });

        expect(result.name).toBe('New Name');
        expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    });

    it('should hash and update password when provided', async () => {
        const user = makeUser();
        mockUserRepository.findById.mockResolvedValue(user);
        mockPasswordHasher.hash.mockResolvedValue('newHashedPassword');
        mockUserRepository.save.mockResolvedValue(undefined);

        await useCase.execute(user.id.value, { password: 'newPlainPassword' });

        expect(mockPasswordHasher.hash).toHaveBeenCalledWith('newPlainPassword');
        expect(mockUserRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({ password: 'newHashedPassword' }),
        );
    });

    it('should update both name and password when both provided', async () => {
        const user = makeUser();
        mockUserRepository.findById.mockResolvedValue(user);
        mockPasswordHasher.hash.mockResolvedValue('newHashedPassword');
        mockUserRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(user.id.value, { name: 'Updated', password: 'newPass' });

        expect(result.name).toBe('Updated');
        expect(mockPasswordHasher.hash).toHaveBeenCalled();
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(new Uuid().value, { name: 'x' })).rejects.toThrow(UserNotFoundException);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should not update password if not provided in dto', async () => {
        const user = makeUser();
        mockUserRepository.findById.mockResolvedValue(user);
        mockUserRepository.save.mockResolvedValue(undefined);

        await useCase.execute(user.id.value, { name: 'Only Name' });

        expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
    });
});