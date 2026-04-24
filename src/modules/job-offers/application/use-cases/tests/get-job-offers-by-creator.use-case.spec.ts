import { GetJobOffersByCreatorUseCase } from '../get-job-offers-by-creator.use-case';
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
        description: 'Test offer',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('GetJobOffersByCreatorUseCase', () => {
    let useCase: GetJobOffersByCreatorUseCase;
    const creatorId = new Uuid();

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetJobOffersByCreatorUseCase(mockJobOfferRepository);
    });

    it('should return a list of JobOfferResponseDto for a creator', async () => {
        const jobOffers = [makeJobOffer(creatorId), makeJobOffer(creatorId)];
        mockJobOfferRepository.findAllByCreatorId.mockResolvedValue(jobOffers);

        const result = await useCase.execute({ creatorId: creatorId.value });

        expect(result).toHaveLength(2);
        expect(result[0].creatorId).toBe(creatorId.value);
        expect(result[1].creatorId).toBe(creatorId.value);
    });

    it('should return an empty array when creator has no job offers', async () => {
        mockJobOfferRepository.findAllByCreatorId.mockResolvedValue([]);

        const result = await useCase.execute({ creatorId: creatorId.value });

        expect(result).toHaveLength(0);
    });

    it('should map all fields correctly to JobOfferResponseDto', async () => {
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findAllByCreatorId.mockResolvedValue([jobOffer]);

        const result = await useCase.execute({ creatorId: creatorId.value });

        expect(result[0].id).toBe(jobOffer.id.value);
        expect(result[0].description).toBe('Test offer');
        expect(result[0].videoFormat.orientation).toBe(VideoOrientation.HORIZONTAL);
        expect(result[0].editLevel.level).toBe(EditLevelType.BASIC);
        expect(result[0].compensation.type).toBe(CompensationType.NEGOTIABLE);
    });
});