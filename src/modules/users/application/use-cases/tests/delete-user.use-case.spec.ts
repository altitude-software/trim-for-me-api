import { DeleteUserUseCase } from '../delete-user.use-case';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import type { IUserRepository } from '../../../domain/repositories/user.repository';

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
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

describe('DeleteUserUseCase', () => {
    let useCase: DeleteUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new DeleteUserUseCase(mockUserRepository);
    });

    it('should delete a user successfully', async () => {
        mockUserRepository.findById.mockResolvedValue(makeUser());
        mockUserRepository.delete.mockResolvedValue(undefined);

        await expect(useCase.execute({ userId: new Uuid().value })).resolves.toBeUndefined();
        expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute({ userId: new Uuid().value })).rejects.toThrow(UserNotFoundException);
        expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
});