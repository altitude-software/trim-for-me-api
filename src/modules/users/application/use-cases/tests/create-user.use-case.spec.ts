import { CreateUserUseCase } from '../create-user.use-case';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { EmailAlreadyInUseException } from '../../../domain/exceptions/email-already-in-use.exception';
import { UserRole } from '../../../domain/entities/user.entity';
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

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new CreateUserUseCase(mockUserRepository, mockPasswordHasher);
    });

    describe('execute', () => {
        const dto: CreateUserDto = {
            email: 'jose@example.com',
            password: 'plainPassword123',
            role: UserRole.CREATOR,
            name: 'Jose',
        };

        it('should create a user and return a UserResponseDto', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
            mockUserRepository.save.mockResolvedValue(undefined);

            const result = await useCase.execute(dto);

            expect(result.email).toBe(dto.email);
            expect(result.role).toBe(dto.role);
            expect(result.name).toBe(dto.name);
            expect(result.id).toBeDefined();
            expect(result.createdAt).toBeDefined();
            expect(result.updatedAt).toBeDefined();
        });

        it('should hash the password before saving', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
            mockUserRepository.save.mockResolvedValue(undefined);

            await useCase.execute(dto);

            expect(mockPasswordHasher.hash).toHaveBeenCalledWith(dto.password);
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: 'hashedPassword',
                }),
            );
        });

        it('should throw EmailAlreadyInUseException if email is taken', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({} as any);

            await expect(useCase.execute(dto)).rejects.toThrow(EmailAlreadyInUseException);
            expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });

        it('should create user with null name if not provided', async () => {
            const dtoWithoutName: CreateUserDto = { ...dto, name: undefined };
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockPasswordHasher.hash.mockResolvedValue('hashedPassword');
            mockUserRepository.save.mockResolvedValue(undefined);

            const result = await useCase.execute(dtoWithoutName);

            expect(result.name).toBeNull();
        });
    });
});