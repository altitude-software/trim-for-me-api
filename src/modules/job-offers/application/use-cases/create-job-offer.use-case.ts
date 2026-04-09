import { Injectable, Inject } from '@nestjs/common';
import { JobOffer } from '../../domain/entities/job-offer.entity';
import { Material } from '../../domain/entities/material.entity';
import { VideoFormat } from '../../domain/entities/video-format.entity';
import { EditLevel } from '../../domain/entities/edit-level.entity';
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
            description: dto.description ?? null,
        });

        // Materials
        const materials = (dto.materials ?? []).map((m) =>
            Material.create({
                url: m.url ?? null,
                type: m.type ?? null,
                description: m.description ?? null,
            }),
        );
        materials.forEach((m) => jobOffer.addMaterial(m));

        // VideoFormat
        jobOffer.setVideoFormat(
            VideoFormat.create({
                orientation: dto.orientation,
                length: dto.length,
                technicalFormat: dto.technicalFormat ?? null,
            }),
        );

        // EditLevel
        jobOffer.setEditLevel(
            EditLevel.create({ level: dto.level }),
        );

        // Compensation
        jobOffer.setCompensation(
            Compensation.create({
                type: dto.compensationType,
                durationInMinutes: dto.durationInMinutes ?? null,
                amount: dto.amount ?? null,
                currency: dto.currency ?? null,
            }),
        );

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
            editLevel: {
                level: jobOffer.editLevel!.level,
            },
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