import { Injectable, Inject } from '@nestjs/common';
import type { IJobOfferRepository } from '../../domain/repositories/job-offer.repository';
import { Material } from '../../domain/entities/material.entity';
import { VideoFormat } from '../../domain/entities/video-format.entity';
import { EditLevel } from '../../domain/entities/edit-level.entity';
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

        if (dto.description !== undefined) {
            jobOffer.setDescription(dto.description);
        }

        if (dto.materials !== undefined) {
            jobOffer.materials.forEach((m) => jobOffer.removeMaterial(m.id));
            dto.materials.forEach((m) =>
                jobOffer.addMaterial(
                    Material.create({
                        url: m.url ?? null,
                        type: m.type ?? null,
                        description: m.description ?? null,
                    }),
                ),
            );
        }

        if (dto.orientation !== undefined || dto.length !== undefined) {
            jobOffer.setVideoFormat(
                VideoFormat.create({
                    orientation: dto.orientation ?? jobOffer.videoFormat!.orientation,
                    length: dto.length ?? jobOffer.videoFormat!.length,
                    technicalFormat: dto.technicalFormat ?? jobOffer.videoFormat!.technicalFormat,
                }),
            );
        }

        if (dto.level !== undefined) {
            jobOffer.setEditLevel(EditLevel.create({ level: dto.level }));
        }

        if (dto.compensationType !== undefined) {
            jobOffer.setCompensation(
                Compensation.create({
                    type: dto.compensationType,
                    durationInMinutes: dto.durationInMinutes ?? jobOffer.compensation!.durationInMinutes,
                    amount: dto.amount ?? jobOffer.compensation!.amount,
                    currency: dto.currency ?? jobOffer.compensation!.currency,
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
            description: jobOffer.description,
            materials: jobOffer.materials.map((m) => ({
                id: m.id.value,
                url: m.url,
                type: m.type,
                description: m.description,
            })),
            videoFormat: {
                orientation: jobOffer.videoFormat!.orientation,
                length: jobOffer.videoFormat!.length,
                technicalFormat: jobOffer.videoFormat!.technicalFormat,
            },
            editLevel: { level: jobOffer.editLevel!.level },
            compensation: {
                type: jobOffer.compensation!.type,
                durationInMinutes: jobOffer.compensation!.durationInMinutes,
                amount: jobOffer.compensation!.amount,
                currency: jobOffer.compensation!.currency,
            },
            createdAt: jobOffer.createdAt,
            updatedAt: jobOffer.updatedAt,
        };
    }
}