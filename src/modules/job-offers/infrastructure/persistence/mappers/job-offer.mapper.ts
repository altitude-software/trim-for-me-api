import { JobOffer } from '../../../domain/entities/job-offer.entity';
import { Material } from '../../../domain/entities/material.entity';
import { Compensation, CompensationType } from '../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import {
    JobOfferEntity,
} from '../typeorm/job-offer.typeorm-entity';
import {
    MaterialEntity,
} from '../typeorm/material.typeorm-entity';
import {
    CompensationEntity,
    CompensationTypeORM,
} from '../typeorm/compensation.typeorm-entity';

export class JobOfferMapper {
    // ─── ORM → Dominio ──────────────────────────────────────────────────────────

    static toDomain(orm: JobOfferEntity): JobOffer {
        return JobOffer.reconstitute({
            id: new Uuid(orm.id),
            creatorId: new Uuid(orm.creatorId),
            name: orm.name,
            description: orm.description,
            materials: orm.materials.map(JobOfferMapper.materialToDomain),
            orientation: orm.orientation as unknown as JobOffer['orientation'],
            length: orm.length as unknown as JobOffer['length'],
            level: orm.level as unknown as JobOffer['level'],
            compensation: orm.compensation
                ? JobOfferMapper.compensationToDomain(orm.compensation)
                : null,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    private static materialToDomain(orm: MaterialEntity): Material {
        return Material.reconstitute({
            id: new Uuid(orm.id),
            url: orm.url,
            type: orm.type ? new Uuid(orm.type.id) : null,
            description: orm.description,
            duration: orm.duration,
            quantity: orm.quantity,
        });
    }

    private static compensationToDomain(orm: CompensationEntity): Compensation {
        return Compensation.reconstitute({
            id: new Uuid(orm.id),
            type: orm.type as unknown as CompensationType,
            durationInMinutes: orm.durationInMinutes,
            amount: orm.amount,
            currency: orm.currency,
        });
    }

    // ─── Dominio → ORM ──────────────────────────────────────────────────────────

    static toOrm(domain: JobOffer): JobOfferEntity {
        const entity = new JobOfferEntity();
        entity.id = domain.id.value;
        entity.creatorId = domain.creatorId.value;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.orientation = domain.orientation as unknown as JobOfferEntity['orientation'];
        entity.length = domain.length as unknown as JobOfferEntity['length'];
        entity.level = domain.level as unknown as JobOfferEntity['level'];
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        entity.materials = domain.materials.map(JobOfferMapper.materialToOrm);

        entity.compensation = domain.compensation
            ? JobOfferMapper.compensationToOrm(domain.compensation)
            : null;

        return entity;
    }

    private static materialToOrm(domain: Material): MaterialEntity {
        const entity = new MaterialEntity();
        entity.id = domain.id.value;
        entity.url = domain.url ?? '';
        entity.description = domain.description;
        entity.duration = domain.duration;
        entity.quantity = domain.quantity;
        if (domain.type) {
            entity.type = { id: domain.type.value } as MaterialEntity['type'];
        } else {
            entity.type = null;
        }
        return entity;
    }

    private static compensationToOrm(domain: Compensation): CompensationEntity {
        const entity = new CompensationEntity();
        entity.id = domain.id.value;
        entity.type = domain.type as unknown as CompensationTypeORM;
        entity.durationInMinutes = domain.durationInMinutes;
        entity.amount = domain.amount;
        entity.currency = domain.currency;
        return entity;
    }
}
