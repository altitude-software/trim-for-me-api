import { EditLevelType } from '../../domain/entities/edit-level.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';
import { VideoOrientation, VideoLength } from '../../domain/entities/video-format.entity';

export class JobOfferResponseDto {
    id!: string;
    creatorId!: string;
    description!: string | null;

    materials!: {
        id: string;
        url: string | null;
        type: string | null;
        description: string | null;
    }[];

    videoFormat!: {
        orientation: VideoOrientation;
        length: VideoLength;
        technicalFormat: string | null;
    };

    editLevel!: {
        level: EditLevelType;
    };

    compensation!: {
        type: CompensationType;
        durationInMinutes: number | null;
        amount: number | null;
        currency: string | null;
    };

    createdAt!: Date;
    updatedAt!: Date;
}