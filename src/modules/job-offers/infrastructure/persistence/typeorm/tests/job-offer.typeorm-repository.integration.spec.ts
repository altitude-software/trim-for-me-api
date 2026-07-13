import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import { TypeOrmJobOfferRepository } from '../job-offer.typeorm-repository';
import { JobOfferEntity } from '../job-offer.typeorm-entity';
import { MaterialEntity } from '../material.typeorm-entity';
import { MaterialTypeEntity } from '../material-type.typeorm-entity';
import { CompensationEntity } from '../compensation.typeorm-entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/typeorm/user.typeorm-entity';
import { JobOffer, VideoOrientation, VideoLength, EditLevelType } from '../../../../domain/entities/job-offer.entity';
import { Material } from '../../../../domain/entities/material.entity';
import { Compensation, CompensationType } from '../../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../../shared/domain/value-objects/uuid.vo';
import { UserRoleORM } from '../../../../../users/infrastructure/persistence/typeorm/user.typeorm-entity';

dotenv.config();

const makeUser = (): UserEntity => {
    const user = new UserEntity();
    user.id = new Uuid().value;
    user.email = `user-${Date.now()}@example.com`;
    user.password = 'hashedPassword';
    user.role = UserRoleORM.CREATOR;
    user.name = 'Jose';
    return user;
};

const makeJobOffer = (creatorId: string, materialTypeId: string): JobOffer =>
    JobOffer.reconstitute({
        id: new Uuid(),
        creatorId: new Uuid(creatorId),
        name: 'Test job offer',
        description: 'Test job offer',
        materials: [
            Material.reconstitute({
                id: new Uuid(),
                url: 'https://example.com/video.mp4',
                type: new Uuid(materialTypeId),
                description: 'raw footage',
                duration: 120,
                quantity: 1,
            }),
        ],
        orientation: VideoOrientation.VERTICAL,
        length: VideoLength.SHORT,
        level: EditLevelType.BASIC,
        compensation: Compensation.reconstitute({
            id: new Uuid(),
            type: CompensationType.NEGOTIABLE,
            durationInMinutes: null,
            amount: null,
            currency: null,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('TypeOrmJobOfferRepository (integration)', () => {
    let module: TestingModule;
    let repository: TypeOrmJobOfferRepository;
    let jobOfferOrmRepo: Repository<JobOfferEntity>;
    let userOrmRepo: Repository<UserEntity>;
    let materialTypeOrmRepo: Repository<MaterialTypeEntity>;
    let testUser: UserEntity;
    let testMaterialType: MaterialTypeEntity;

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
                        MaterialTypeEntity,
                        CompensationEntity,
                    ],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([JobOfferEntity, UserEntity, MaterialTypeEntity]),
            ],
            providers: [TypeOrmJobOfferRepository],
        }).compile();

        repository = module.get(TypeOrmJobOfferRepository);
        jobOfferOrmRepo = module.get(getRepositoryToken(JobOfferEntity));
        userOrmRepo = module.get(getRepositoryToken(UserEntity));
        materialTypeOrmRepo = module.get(getRepositoryToken(MaterialTypeEntity));
    }, 30000);

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await jobOfferOrmRepo.query('DELETE FROM "JOB_OFFER"');
        await userOrmRepo.query('DELETE FROM "USER"');
        await materialTypeOrmRepo.query('DELETE FROM "MATERIAL_TYPE"');
        testUser = await userOrmRepo.save(makeUser());
        testMaterialType = await materialTypeOrmRepo.save(
            materialTypeOrmRepo.create({ id: new Uuid().value, name: 'video' }),
        );
    });

    describe('save', () => {
        it('should persist a job offer with all nested entities', async () => {
            const jobOffer = makeJobOffer(testUser.id, testMaterialType.id);

            await repository.save(jobOffer);

            const found = await jobOfferOrmRepo.findOneBy({ id: jobOffer.id.value });
            expect(found).not.toBeNull();
            expect(found!.creatorId).toBe(testUser.id);
            expect(found!.name).toBe('Test job offer');
            expect(found!.description).toBe('Test job offer');
            expect(found!.materials).toHaveLength(1);
            expect(found!.orientation).toBe(VideoOrientation.VERTICAL);
            expect(found!.level).toBe(EditLevelType.BASIC);
            expect(found!.compensation).not.toBeNull();
        });

        it('should update a job offer when saved with same id', async () => {
            const jobOffer = makeJobOffer(testUser.id, testMaterialType.id);
            await repository.save(jobOffer);

            jobOffer.setDescription('Updated description');
            await repository.save(jobOffer);

            const found = await jobOfferOrmRepo.findOneBy({ id: jobOffer.id.value });
            expect(found!.description).toBe('Updated description');
        });
    });

    describe('findById', () => {
        it('should return a JobOffer domain entity when found', async () => {
            const jobOffer = makeJobOffer(testUser.id, testMaterialType.id);
            await repository.save(jobOffer);

            const result = await repository.findById(jobOffer.id);

            expect(result).not.toBeNull();
            expect(result!.id.value).toBe(jobOffer.id.value);
            expect(result!.name).toBe('Test job offer');
            expect(result!.description).toBe('Test job offer');
            expect(result!.materials).toHaveLength(1);
            expect(result!.materials[0].type?.value).toBe(testMaterialType.id);
            expect(result!.compensation).not.toBeNull();
        });

        it('should return null when job offer does not exist', async () => {
            const result = await repository.findById(new Uuid());
            expect(result).toBeNull();
        });
    });

    describe('findAllByCreatorId', () => {
        it('should return all job offers for a creator', async () => {
            await repository.save(makeJobOffer(testUser.id, testMaterialType.id));
            await repository.save(makeJobOffer(testUser.id, testMaterialType.id));

            const result = await repository.findAllByCreatorId(new Uuid(testUser.id));

            expect(result).toHaveLength(2);
            result.forEach((jo) => expect(jo.creatorId.value).toBe(testUser.id));
        });

        it('should return empty array when creator has no job offers', async () => {
            const result = await repository.findAllByCreatorId(new Uuid());
            expect(result).toHaveLength(0);
        });

        it('should not return job offers from other creators', async () => {
            const otherUser = await userOrmRepo.save(makeUser());
            await repository.save(makeJobOffer(testUser.id, testMaterialType.id));
            await repository.save(makeJobOffer(otherUser.id, testMaterialType.id));

            const result = await repository.findAllByCreatorId(new Uuid(testUser.id));

            expect(result).toHaveLength(1);
            expect(result[0].creatorId.value).toBe(testUser.id);
        });
    });

    describe('delete', () => {
        it('should remove the job offer from the database', async () => {
            const jobOffer = makeJobOffer(testUser.id, testMaterialType.id);
            await repository.save(jobOffer);

            await repository.delete(jobOffer.id);

            const found = await jobOfferOrmRepo.findOneBy({ id: jobOffer.id.value });
            expect(found).toBeNull();
        });

        it('should not throw if job offer does not exist', async () => {
            await expect(repository.delete(new Uuid())).resolves.toBeUndefined();
        });
    });
});
