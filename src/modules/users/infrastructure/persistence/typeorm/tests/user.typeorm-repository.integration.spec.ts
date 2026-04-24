import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmUserRepository } from '../user.typeorm-repository';
import { UserEntity } from '../user.typeorm-entity';
import { User, UserRole } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Uuid } from '../../../../../../shared/domain/value-objects/uuid.vo';
import { EmailAlreadyInUseException } from '../../../../domain/exceptions/email-already-in-use.exception';
import { JobOfferEntity } from '../../../../../job-offers/infrastructure/persistence/typeorm/job-offer.typeorm-entity';
import { MaterialEntity } from '../../../../../job-offers/infrastructure/persistence/typeorm/material.typeorm-entity';
import { VideoFormatEntity } from '../../../../../job-offers/infrastructure/persistence/typeorm/video-format.typeorm-entity';
import { EditLevelEntity } from '../../../../../job-offers/infrastructure/persistence/typeorm/edit-level.typeorm-entity';
import { CompensationEntity } from '../../../../../job-offers/infrastructure/persistence/typeorm/compensation.typeorm-entity';
import * as dotenv from 'dotenv';

dotenv.config();

const makeUser = (overrides?: Partial<{ email: string; name: string | null }>) =>
    User.reconstitute({
        id: new Uuid(),
        email: new Email(overrides?.email ?? 'jose@example.com'),
        password: 'hashedPassword',
        role: UserRole.CREATOR,
        name: overrides?.name ?? 'Jose',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('TypeOrmUserRepository (integration)', () => {
    let module: TestingModule;
    let repository: TypeOrmUserRepository;
    let ormRepo: Repository<UserEntity>;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_TEST_PORT),
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_TEST_NAME,
                    entities: [
                        UserEntity,
                        JobOfferEntity,
                        MaterialEntity,
                        VideoFormatEntity,
                        EditLevelEntity,
                        CompensationEntity,
                    ],
                    synchronize: true, // solo en test
                }),
                TypeOrmModule.forFeature([UserEntity]),
            ],
            providers: [TypeOrmUserRepository],
        }).compile();

        repository = module.get(TypeOrmUserRepository);
        ormRepo = module.get(getRepositoryToken(UserEntity));
    }, 30000);

    afterAll(async () => {
        await module.close();
    });

    afterEach(async () => {
        await ormRepo.query('DELETE FROM "USER"');
    });

    describe('save', () => {
        it('should persist a user in the database', async () => {
            const user = makeUser();

            await repository.save(user);

            const found = await ormRepo.findOneBy({ id: user.id.value });
            expect(found).not.toBeNull();
            expect(found!.email).toBe(user.email.value);
            expect(found!.role).toBe(user.role);
            expect(found!.name).toBe(user.name);
        });

        it('should throw EmailAlreadyInUseException on duplicate email', async () => {
            const user1 = makeUser({ email: 'dup@example.com' });
            const user2 = makeUser({ email: 'dup@example.com' });

            await repository.save(user1);

            await expect(repository.save(user2)).rejects.toThrow(EmailAlreadyInUseException);
        });

        it('should update an existing user when saved with same id', async () => {
            const user = makeUser();
            await repository.save(user);

            user.updateName('Updated Name');
            await repository.save(user);

            const found = await ormRepo.findOneBy({ id: user.id.value });
            expect(found!.name).toBe('Updated Name');
        });
    });

    describe('findById', () => {
        it('should return a User domain entity when found', async () => {
            const user = makeUser();
            await repository.save(user);

            const result = await repository.findById(user.id);

            expect(result).not.toBeNull();
            expect(result!.id.value).toBe(user.id.value);
            expect(result!.email.value).toBe(user.email.value);
        });

        it('should return null if user does not exist', async () => {
            const result = await repository.findById(new Uuid());
            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should return a User domain entity when found', async () => {
            const user = makeUser({ email: 'find@example.com' });
            await repository.save(user);

            const result = await repository.findByEmail(new Email('find@example.com'));

            expect(result).not.toBeNull();
            expect(result!.email.value).toBe('find@example.com');
        });

        it('should return null if email does not exist', async () => {
            const result = await repository.findByEmail(new Email('ghost@example.com'));
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should remove the user from the database', async () => {
            const user = makeUser();
            await repository.save(user);

            await repository.delete(user.id);

            const found = await ormRepo.findOneBy({ id: user.id.value });
            expect(found).toBeNull();
        });

        it('should not throw if user does not exist', async () => {
            await expect(repository.delete(new Uuid())).resolves.toBeUndefined();
        });
    });
});