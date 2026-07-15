import { CreateJobOfferUseCase } from '../create-job-offer.use-case';
import { CreateJobOfferDto } from '../../dtos/create-job-offer.dto';
import { VideoOrientation, VideoLength, EditLevelType } from '../../../domain/entities/job-offer.entity';
import { CompensationType } from '../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import type { IJobOfferRepository } from '../../../domain/repositories/job-offer.repository';

const mockJobOfferRepository: jest.Mocked<IJobOfferRepository> = {
    findById: jest.fn(),
    findAll: jest.fn(),
    findAllByCreatorId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

const baseDto: CreateJobOfferDto = {
    name: 'Editor para canal de YouTube',
    description: 'Need a video editor',
    materials: [{ url: 'https://example.com/video.mp4', type: new Uuid().value, description: 'raw footage' }],
    orientation: VideoOrientation.HORIZONTAL,
    length: VideoLength.SHORT,
    level: EditLevelType.BASIC,
    compensationType: CompensationType.PER_VIDEO,
    amount: 100,
    currency: 'USD',
};

describe('CreateJobOfferUseCase', () => {
    let useCase: CreateJobOfferUseCase;
    const creatorId = new Uuid().value;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new CreateJobOfferUseCase(mockJobOfferRepository);
    });

    it('should create a job offer and return a JobOfferResponseDto', async () => {
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId, baseDto);

        expect(result.id).toBeDefined();
        expect(result.creatorId).toBe(creatorId);
        expect(result.name).toBe(baseDto.name);
        expect(result.description).toBe(baseDto.description);
        expect(result.materials).toHaveLength(1);
        expect(result.orientation).toBe(baseDto.orientation);
        expect(result.length).toBe(baseDto.length);
        expect(result.level).toBe(baseDto.level);
        expect(result.compensation!.type).toBe(baseDto.compensationType);
    });

    it('should save the job offer to the repository', async () => {
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        await useCase.execute(creatorId, baseDto);

        expect(mockJobOfferRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create a job offer with empty materials when none provided', async () => {
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId, { ...baseDto, materials: [] });

        expect(result.materials).toHaveLength(0);
    });

    it('should create a job offer with null description when not provided', async () => {
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId, { ...baseDto, description: undefined });

        expect(result.description).toBeNull();
    });

    it('should create a job offer with null compensation when not provided', async () => {
        mockJobOfferRepository.save.mockResolvedValue(undefined);

        const result = await useCase.execute(creatorId, {
            ...baseDto,
            compensationType: undefined,
            amount: undefined,
            currency: undefined,
        });

        expect(result.compensation).toBeNull();
    });

    it('should throw when Compensation validation fails', async () => {
        await expect(
            useCase.execute(creatorId, {
                ...baseDto,
                compensationType: CompensationType.PER_VIDEO,
                amount: undefined, // PER_VIDEO requires amount
                currency: undefined,
            }),
        ).rejects.toThrow();

        expect(mockJobOfferRepository.save).not.toHaveBeenCalled();
    });
});
