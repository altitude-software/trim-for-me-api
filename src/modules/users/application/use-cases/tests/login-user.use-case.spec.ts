import { LoginUserUseCase, InvalidCredentialsException } from '../login-user.use-case';
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

describe('LoginUserUseCase', () => {
    let useCase: LoginUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new LoginUserUseCase(mockUserRepository, mockPasswordHasher);
    });

    it('should return a UserResponseDto on valid credentials', async () => {
        const user = makeUser();
        mockUserRepository.findByEmail.mockResolvedValue(user);
        mockPasswordHasher.compare.mockResolvedValue(true);

        const result = await useCase.execute({ email: 'jose@example.com', password: 'plainPassword' });

        expect(result.email).toBe(user.email.value);
        expect(result.id).toBe(user.id.value);
    });

    it('should throw InvalidCredentialsException if email not found', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute({ email: 'wrong@example.com', password: 'any' }))
            .rejects.toThrow(InvalidCredentialsException);
        expect(mockPasswordHasher.compare).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsException if password does not match', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(makeUser());
        mockPasswordHasher.compare.mockResolvedValue(false);

        await expect(useCase.execute({ email: 'jose@example.com', password: 'wrongPassword' }))
            .rejects.toThrow(InvalidCredentialsException);
    });

    it('should not distinguish between wrong email and wrong password', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        const error1 = await useCase.execute({ email: 'x@x.com', password: 'any' }).catch(e => e);

        mockUserRepository.findByEmail.mockResolvedValue(makeUser());
        mockPasswordHasher.compare.mockResolvedValue(false);
        const error2 = await useCase.execute({ email: 'jose@example.com', password: 'wrong' }).catch(e => e);

        expect(error1.constructor).toBe(error2.constructor);
        expect(error1.message).toBe(error2.message);
    });
});