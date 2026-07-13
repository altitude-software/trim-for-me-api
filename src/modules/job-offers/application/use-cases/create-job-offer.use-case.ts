import { Injectable, Inject } from '@nestjs/common';
import { JobOffer } from '../../domain/entities/job-offer.entity';
import { Material } from '../../domain/entities/material.entity';
import { Compensation } from '../../domain/entities/compensation.entity';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CreateJobOfferDto } from '../dtos/create-job-offer.dto';
import { JobOfferResponseDto } from '../dtos/job-offer-response.dto';

import type { IJobOfferRepository } from '../../domain/repositories/job-offer.repository';

@Injectable()
export class CreateJobOfferUseCase {
    constructor(
        @Inject('IJobOfferRepository')
        private readonly jobOfferRepository: IJobOfferRepository,
    ) { }

    async execute(creatorId: string, dto: CreateJobOfferDto): Promise<JobOfferResponseDto> {
        const jobOffer = JobOffer.create({
            creatorId: new Uuid(creatorId),
            name: dto.name,
            description: dto.description ?? null,
            orientation: dto.orientation,
            length: dto.length,
            level: dto.level,
            compensation: dto.compensationType
                ? Compensation.create({
                    type: dto.compensationType,
                    durationInMinutes: dto.durationInMinutes ?? null,
                    amount: dto.amount ?? null,
                    currency: dto.currency ?? null,
                })
                : null,
        });

        // Materials
        const materials = (dto.materials ?? []).map((m) =>
            Material.create({
                url: m.url ?? null,
                type: m.type ? new Uuid(m.type) : null,
                description: m.description ?? null,
                duration: m.duration ?? null,
                quantity: m.quantity ?? null,
            }),
        );
        materials.forEach((m) => jobOffer.addMaterial(m));

        await this.jobOfferRepository.save(jobOffer);

        return this.toResponse(jobOffer);
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
