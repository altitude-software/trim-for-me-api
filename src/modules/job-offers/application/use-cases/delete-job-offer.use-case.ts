import { Injectable, Inject } from '@nestjs/common';
import type { IJobOfferRepository } from '../../domain/repositories/job-offer.repository';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { JobOfferNotFoundException } from '../../domain/exceptions/job-offer-not-found.exception';
import { DeleteJobOfferDto } from '../dtos/delete-job-offer.dto';

@Injectable()
export class DeleteJobOfferUseCase {
    constructor(
        @Inject('IJobOfferRepository')
        private readonly jobOfferRepository: IJobOfferRepository,
    ) { }

    async execute(dto: DeleteJobOfferDto): Promise<void> {
        const jobOfferId = new Uuid(dto.jobOfferId);
        const jobOffer = await this.jobOfferRepository.findById(jobOfferId);

        if (!jobOffer) throw new JobOfferNotFoundException(dto.jobOfferId);

        // Verificar que quien elimina es el creador
        if (!jobOffer.creatorId.equals(new Uuid(dto.creatorId))) {
            throw new Error('Unauthorized: only the creator can delete this job offer');
        }

        await this.jobOfferRepository.delete(jobOfferId);
    }
}