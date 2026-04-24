import { CreateJobOfferUseCase } from '../create-job-offer.use-case';
import { CreateJobOfferDto } from '../../dtos/create-job-offer.dto';
import { VideoOrientation, VideoLength } from '../../../domain/entities/video-format.entity';
import { EditLevelType } from '../../../domain/entities/edit-level.entity';
import { CompensationType } from '../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import type { IJobOfferRepository } from '../../../domain/repositories/job-offer.repository';

const mockJobOfferRepository: jest.Mocked<IJobOfferRepository> = {
    findById: jest.fn(),
    findAllByCreatorId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

const baseDto: CreateJobOfferDto = {
    description: 'Need a video editor',
    materials: [{ url: 'https://example.com/video.mp4', type: 'video', description: 'raw footage' }],
    orientation: VideoOrientation.HORIZONTAL,
    length: VideoLength.SHORT,
    technicalFormat: 'mp4',
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
        expect(result.description).toBe(baseDto.description);
        expect(result.materials).toHaveLength(1);
        expect(result.videoFormat.orientation).toBe(baseDto.orientation);
        expect(result.videoFormat.length).toBe(baseDto.length);
        expect(result.editLevel.level).toBe(baseDto.level);
        expect(result.compensation.type).toBe(baseDto.compensationType);
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