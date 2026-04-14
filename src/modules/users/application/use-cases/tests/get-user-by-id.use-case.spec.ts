import { GetUserByIdUseCase } from '../get-user-by-id.use-case';
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

describe('GetUserByIdUseCase', () => {
    let useCase: GetUserByIdUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetUserByIdUseCase(mockUserRepository);
    });

    it('should return a UserResponseDto when user exists', async () => {
        const user = makeUser();
        mockUserRepository.findById.mockResolvedValue(user);

        const result = await useCase.execute({ userId: user.id.value });

        expect(result.id).toBe(user.id.value);
        expect(result.email).toBe(user.email.value);
        expect(result.role).toBe(user.role);
        expect(result.name).toBe(user.name);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute({ userId: new Uuid().value })).rejects.toThrow(UserNotFoundException);
    });
});