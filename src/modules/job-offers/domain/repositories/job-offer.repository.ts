import { JobOffer } from '../entities/job-offer.entity';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';

export interface IJobOfferRepository {
    save(jobOffer: JobOffer): Promise<void>;
    findById(id: Uuid): Promise<JobOffer | null>;
    findAllByCreatorId(creatorId: Uuid): Promise<JobOffer[]>;
    delete(id: Uuid): Promise<void>;
}