import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IJobOfferRepository } from '../../../domain/repositories/job-offer.repository';
import { JobOffer } from '../../../domain/entities/job-offer.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { JobOfferEntity } from '../typeorm/job-offer.typeorm-entity';
import { JobOfferMapper } from '../mappers/job-offer.mapper';

@Injectable()
export class TypeOrmJobOfferRepository implements IJobOfferRepository {
    constructor(
        @InjectRepository(JobOfferEntity)
        private readonly repo: Repository<JobOfferEntity>,
    ) { }

    async save(jobOffer: JobOffer): Promise<void> {
        const entity = JobOfferMapper.toOrm(jobOffer);
        await this.repo.save(entity);
    }

    async findById(id: Uuid): Promise<JobOffer | null> {
        const entity = await this.repo.findOneBy({ id: id.value });
        if (!entity) return null;
        return JobOfferMapper.toDomain(entity);
    }

    async findAllByCreatorId(creatorId: Uuid): Promise<JobOffer[]> {
        const entities = await this.repo.findBy({ creatorId: creatorId.value });
        return entities.map(JobOfferMapper.toDomain);
    }

    async delete(id: Uuid): Promise<void> {
        await this.repo.delete({ id: id.value });
    }
}