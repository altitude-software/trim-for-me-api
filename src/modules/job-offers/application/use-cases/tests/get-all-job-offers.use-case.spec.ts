import { GetAllJobOffersUseCase } from '../get-all-job-offers.use-case';
import { JobOffer, VideoOrientation, VideoLength, EditLevelType } from '../../../domain/entities/job-offer.entity';
import { Compensation, CompensationType } from '../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import type { IJobOfferRepository } from '../../../domain/repositories/job-offer.repository';

const mockJobOfferRepository: jest.Mocked<IJobOfferRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllByCreatorId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

const makeJobOffer = (creatorId: Uuid) =>
    JobOffer.reconstitute({
        id: new Uuid(),
        creatorId,
        name: 'Test offer',
        materials: [],
        orientation: VideoOrientation.HORIZONTAL,
        length: VideoLength.SHORT,
        level: EditLevelType.BASIC,
        compensation: Compensation.create({ type: CompensationType.NEGOTIABLE }),
        description: 'Test offer',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

describe('GetAllJobOffersUseCase', () => {
    let useCase: GetAllJobOffersUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetAllJobOffersUseCase(mockJobOfferRepository);
    });

    it('should return a list of JobOfferResponseDto for all creators', async () => {
        const jobOffers = [makeJobOffer(new Uuid()), makeJobOffer(new Uuid())];
        mockJobOfferRepository.findAll.mockResolvedValue(jobOffers);

        const result = await useCase.execute();

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(jobOffers[0].id.value);
        expect(result[1].id).toBe(jobOffers[1].id.value);
    });

    it('should return an empty array when there are no job offers', async () => {
        mockJobOfferRepository.findAll.mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toHaveLength(0);
    });

    it('should map all fields correctly to JobOfferResponseDto', async () => {
        const creatorId = new Uuid();
        const jobOffer = makeJobOffer(creatorId);
        mockJobOfferRepository.findAll.mockResolvedValue([jobOffer]);

        const result = await useCase.execute();

        expect(result[0].id).toBe(jobOffer.id.value);
        expect(result[0].creatorId).toBe(creatorId.value);
        expect(result[0].name).toBe('Test offer');
        expect(result[0].description).toBe('Test offer');
        expect(result[0].orientation).toBe(VideoOrientation.HORIZONTAL);
        expect(result[0].level).toBe(EditLevelType.BASIC);
        expect(result[0].compensation!.type).toBe(CompensationType.NEGOTIABLE);
    });
});
