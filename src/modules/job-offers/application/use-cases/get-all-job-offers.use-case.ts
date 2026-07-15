import { Injectable, Inject } from '@nestjs/common';
import type { IJobOfferRepository } from '../../domain/repositories/job-offer.repository';
import { JobOfferResponseDto } from '../dtos/job-offer-response.dto';
import { JobOffer } from '../../domain/entities/job-offer.entity';

@Injectable()
export class GetAllJobOffersUseCase {
    constructor(
        @Inject('IJobOfferRepository')
        private readonly jobOfferRepository: IJobOfferRepository,
    ) { }

    async execute(): Promise<JobOfferResponseDto[]> {
        const jobOffers = await this.jobOfferRepository.findAll();
        return jobOffers.map((jobOffer) => this.toResponse(jobOffer));
    }

    private toResponse(jobOffer: JobOffer): JobOfferResponseDto {
        return {
            id: jobOffer.id.value,
            creatorId: jobOffer.creatorId.value,
            name: jobOffer.name,
            description: jobOffer.description,
            materials: jobOffer.materials.map((m) => ({
                id: m.id.value,
                url: m.url,
                type: m.type?.value ?? null,
                description: m.description,
                duration: m.duration,
                quantity: m.quantity,
            })),
            orientation: jobOffer.orientation,
            length: jobOffer.length,
            level: jobOffer.level,
            compensation: jobOffer.compensation
                ? {
                    type: jobOffer.compensation.type,
                    durationInMinutes: jobOffer.compensation.durationInMinutes,
                    amount: jobOffer.compensation.amount,
                    currency: jobOffer.compensation.currency,
                }
                : null,
            createdAt: jobOffer.createdAt,
            updatedAt: jobOffer.updatedAt,
        };
    }
}
