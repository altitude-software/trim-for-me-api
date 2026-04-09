import { Injectable, Inject } from '@nestjs/common';
import type { IJobOfferRepository } from '../../domain/repositories/job-offer.repository';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { GetJobOffersByCreatorDto } from '../dtos/get-job-offers-by-creator.dto';
import { JobOfferResponseDto } from '../dtos/job-offer-response.dto';
import { JobOffer } from '../../domain/entities/job-offer.entity';

@Injectable()
export class GetJobOffersByCreatorUseCase {
    constructor(
        @Inject('IJobOfferRepository')
        private readonly jobOfferRepository: IJobOfferRepository,
    ) { }

    async execute(dto: GetJobOffersByCreatorDto): Promise<JobOfferResponseDto[]> {
        const creatorId = new Uuid(dto.creatorId);
        const jobOffers = await this.jobOfferRepository.findAllByCreatorId(creatorId);
        return jobOffers.map((jobOffer) => this.toResponse(jobOffer));
    }

    private toResponse(jobOffer: JobOffer): JobOfferResponseDto {
        return {
            id: jobOffer.id.value,
            creatorId: jobOffer.creatorId.value,
            description: jobOffer.description,
            materials: jobOffer.materials.map((m) => ({
                id: m.id.value,
                url: m.url,
                type: m.type,
                description: m.description,
            })),
            videoFormat: jobOffer.videoFormat
                ? {
                    orientation: jobOffer.videoFormat.orientation,
                    length: jobOffer.videoFormat.length,
                    technicalFormat: jobOffer.videoFormat.technicalFormat,
                }
                : null!,
            editLevel: jobOffer.editLevel
                ? { level: jobOffer.editLevel.level }
                : null!,
            compensation: jobOffer.compensation
                ? {
                    type: jobOffer.compensation.type,
                    durationInMinutes: jobOffer.compensation.durationInMinutes,
                    amount: jobOffer.compensation.amount,
                    currency: jobOffer.compensation.currency,
                }
                : null!,
            createdAt: jobOffer.createdAt,
            updatedAt: jobOffer.updatedAt,
        };
    }
}