import { Injectable, Inject } from '@nestjs/common';
import type { IJobOfferRepository } from '../../domain/repositories/job-offer.repository';
import { Material } from '../../domain/entities/material.entity';
import { Compensation } from '../../domain/entities/compensation.entity';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { JobOfferNotFoundException } from '../../domain/exceptions/job-offer-not-found.exception';
import { UpdateJobOfferDto } from '../dtos/update-job-offer.dto';
import { JobOfferResponseDto } from '../dtos/job-offer-response.dto';
import { JobOffer } from '../../domain/entities/job-offer.entity';

@Injectable()
export class UpdateJobOfferUseCase {
    constructor(
        @Inject('IJobOfferRepository')
        private readonly jobOfferRepository: IJobOfferRepository,
    ) { }

    async execute(
        creatorId: string,
        jobOfferId: string,
        dto: UpdateJobOfferDto,
    ): Promise<JobOfferResponseDto> {
        const jobOffer = await this.jobOfferRepository.findById(new Uuid(jobOfferId));
        if (!jobOffer) throw new JobOfferNotFoundException(jobOfferId);

        // Verificar que quien actualiza es el creador
        if (!jobOffer.creatorId.equals(new Uuid(creatorId))) {
            throw new Error('Unauthorized: only the creator can update this job offer');
        }

        if (dto.name !== undefined) {
            jobOffer.setName(dto.name);
        }

        if (dto.description !== undefined) {
            jobOffer.setDescription(dto.description);
        }

        if (dto.materials !== undefined) {
            jobOffer.materials.forEach((m) => jobOffer.removeMaterial(m.id));
            dto.materials.forEach((m) =>
                jobOffer.addMaterial(
                    Material.create({
                        url: m.url ?? null,
                        type: m.type ? new Uuid(m.type) : null,
                        description: m.description ?? null,
                        duration: m.duration ?? null,
                        quantity: m.quantity ?? null,
                    }),
                ),
            );
        }

        if (dto.orientation !== undefined) {
            jobOffer.setOrientation(dto.orientation);
        }

        if (dto.length !== undefined) {
            jobOffer.setLength(dto.length);
        }

        if (dto.level !== undefined) {
            jobOffer.setLevel(dto.level);
        }

        if (dto.compensationType !== undefined) {
            jobOffer.setCompensation(
                Compensation.create({
                    type: dto.compensationType,
                    durationInMinutes: dto.durationInMinutes ?? jobOffer.compensation?.durationInMinutes ?? null,
                    amount: dto.amount ?? jobOffer.compensation?.amount ?? null,
                    currency: dto.currency ?? jobOffer.compensation?.currency ?? null,
                }),
            );
        }

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
