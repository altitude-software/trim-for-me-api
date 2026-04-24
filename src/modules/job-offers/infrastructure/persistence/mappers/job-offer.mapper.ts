import { JobOffer } from '../../../domain/entities/job-offer.entity';
import { Material } from '../../../domain/entities/material.entity';
import { VideoFormat, VideoOrientation, VideoLength } from '../../../domain/entities/video-format.entity';
import { EditLevel, EditLevelType } from '../../../domain/entities/edit-level.entity';
import { Compensation, CompensationType } from '../../../domain/entities/compensation.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import {
    JobOfferEntity,
} from '../typeorm/job-offer.typeorm-entity';
import {
    MaterialEntity,
} from '../typeorm/material.typeorm-entity';
import {
    VideoFormatEntity,
    VideoOrientationORM,
    VideoLengthORM,
} from '../typeorm/video-format.typeorm-entity';
import {
    EditLevelEntity,
    EditLevelORM,
} from '../typeorm/edit-level.typeorm-entity';
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
            description: orm.description,
            materials: orm.materials.map(JobOfferMapper.materialToDomain),
            videoFormat: orm.videoFormat
                ? JobOfferMapper.videoFormatToDomain(orm.videoFormat)
                : null,
            editLevel: orm.editLevel
                ? JobOfferMapper.editLevelToDomain(orm.editLevel)
                : null,
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
            type: orm.type,
            description: orm.description,
        });
    }

    private static videoFormatToDomain(orm: VideoFormatEntity): VideoFormat {
        return VideoFormat.reconstitute({
            id: new Uuid(orm.id),
            orientation: orm.orientation as unknown as VideoOrientation,
            length: orm.length as unknown as VideoLength,
            technicalFormat: orm.technicalFormat,
        });
    }

    private static editLevelToDomain(orm: EditLevelEntity): EditLevel {
        return EditLevel.reconstitute({
            id: new Uuid(orm.id),
            level: orm.level as unknown as EditLevelType,
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
        entity.description = domain.description;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        entity.materials = domain.materials.map(JobOfferMapper.materialToOrm);

        entity.videoFormat = domain.videoFormat
            ? JobOfferMapper.videoFormatToOrm(domain.videoFormat)
            : (null as unknown as VideoFormatEntity);

        entity.editLevel = domain.editLevel
            ? JobOfferMapper.editLevelToOrm(domain.editLevel)
            : (null as unknown as EditLevelEntity);

        entity.compensation = domain.compensation
            ? JobOfferMapper.compensationToOrm(domain.compensation)
            : (null as unknown as CompensationEntity);

        return entity;
    }

    private static materialToOrm(domain: Material): MaterialEntity {
        const entity = new MaterialEntity();
        entity.id = domain.id.value;
        entity.url = domain.url ?? '';
        entity.type = domain.type ?? '';
        entity.description = domain.description;
        return entity;
    }

    private static videoFormatToOrm(domain: VideoFormat): VideoFormatEntity {
        const entity = new VideoFormatEntity();
        entity.id = domain.id.value;
        entity.orientation = domain.orientation as unknown as VideoOrientationORM;
        entity.length = domain.length as unknown as VideoLengthORM;
        entity.technicalFormat = domain.technicalFormat;
        return entity;
    }

    private static editLevelToOrm(domain: EditLevel): EditLevelEntity {
        const entity = new EditLevelEntity();
        entity.id = domain.id.value;
        entity.level = domain.level as unknown as EditLevelORM;
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