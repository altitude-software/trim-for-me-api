// update-job-offer.use-case.spec.ts
import { UpdateJobOfferUseCase } from '../update-job-offer.use-case';
import { JobOfferNotFoundException } from '../../../domain/exceptions/job-offer-not-found.exception';
import { JobOffer } from '../../../domain/entities/job-offer.entity';
import { VideoFormat, VideoOrientation, VideoLength } from '../../../domain/entities/video-format.entity';
import { EditLevel, EditLevelType } from '../../../domain/entities/edit-level.entity';
import { Compensation, CompensationType } from '../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import type { IJobOfferRepository } from '../../../domain/repositories/job-offer.repository';

const mockJobOfferRepository: jest.Mocked<IJobOfferRepository> = {
    findById: jest.fn(),
    findAllByCreatorId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

const makeJobOffer = (creatorId: Uuid) =>
    JobOffer.reconstitute({
        id: new Uuid(),
        creatorId,
        materials: [],
        videoFormat: VideoFormat.create({ orientation: VideoOrientation.HORIZONTAL, length: VideoLength.SHORT }),
        editLevel: EditLevel.create({ level: EditLevelType.BASIC }),
        compensation: Compensation.create({ type: CompensationType.NEGOTIABLE }),
        description: 'Original description',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('UpdateJobOfferUseCase', () => {
    let useCase: UpdateJobOfferUseCase;
    const creatorId = new Uuid();

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new UpdateJobOfferUseCase(mockJobOfferRepository);
    });

    it('should update description successfully', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findById.mockResolvedValue(jobOffer);
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId.value, jobOffer.id.value, {
            description: 'Updated description',
        });

        expect(result.description).toBe('Updated description');
    });

    it('should update edit level successfully', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findById.mockResolvedValue(jobOffer);
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId.value, jobOffer.id.value, {
            level: EditLevelType.ADVANCED,
        });

        expect(result.editLevel.level).toBe(EditLevelType.ADVANCED);
    });

    it('should update compensation successfully', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findById.mockResolvedValue(jobOffer);
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId.value, jobOffer.id.value, {
            compensationType: CompensationType.PER_VIDEO,
            amount: 200,
            currency: 'USD',
        });

        expect(result.compensation.type).toBe(CompensationType.PER_VIDEO);
        expect(result.compensation.amount).toBe(200);
    });

    it('should throw JobOfferNotFoundException when job offer does not exist', async () => {
        mockJobOfferRepository.findById.mockResolvedValue(null);

        await expect(
            useCase.execute(creatorId.value, new Uuid().value, { description: 'x' }),
        ).rejects.toThrow(JobOfferNotFoundException);

        expect(mockJobOfferRepository.save).not.toHaveBeenCalled();
    });

    it('should throw Unauthorized when a different user tries to update', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findById.mockResolvedValue(jobOffer);

        await expect(
            useCase.execute(new Uuid().value, jobOffer.id.value, { description: 'x' }),
        ).rejects.toThrow('Unauthorized');

        expect(mockJobOfferRepository.save).not.toHaveBeenCalled();
    });
});