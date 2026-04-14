import { DeleteJobOfferUseCase } from '../delete-job-offer.use-case';
import { JobOfferNotFoundException } from '../../../domain/exceptions/job-offer-not-found.exception';
import { JobOffer } from '../../../domain/entities/job-offer.entity';
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
        videoFormat: null,
        editLevel: null,
        compensation: null,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('DeleteJobOfferUseCase', () => {
    let useCase: DeleteJobOfferUseCase;
    const creatorId = new Uuid();

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new DeleteJobOfferUseCase(mockJobOfferRepository);
    });

    it('should delete a job offer successfully', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findById.mockResolvedValue(jobOffer);
        mockJobOfferRepository.delete.mockResolvedValue(undefined);

        await expect(
            useCase.execute({ jobOfferId: jobOffer.id.value, creatorId: creatorId.value }),
        ).resolves.toBeUndefined();

        expect(mockJobOfferRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw JobOfferNotFoundException when job offer does not exist', async () => {
        mockJobOfferRepository.findById.mockResolvedValue(null);

        await expect(
            useCase.execute({ jobOfferId: new Uuid().value, creatorId: creatorId.value }),
        ).rejects.toThrow(JobOfferNotFoundException);

        expect(mockJobOfferRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw when a different user tries to delete', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findById.mockResolvedValue(jobOffer);

        await expect(
            useCase.execute({ jobOfferId: jobOffer.id.value, creatorId: new Uuid().value }),
        ).rejects.toThrow('Unauthorized');

        expect(mockJobOfferRepository.delete).not.toHaveBeenCalled();
    });
});