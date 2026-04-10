import { EditLevelType } from '../../domain/entities/edit-level.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';
import { VideoOrientation, VideoLength } from '../../domain/entities/video-format.entity';
import { MaterialDto } from './create-job-offer.dto';

export class UpdateJobOfferDto {
    description?: string;
    materials?: MaterialDto[];
    orientation?: VideoOrientation;
    length?: VideoLength;
    technicalFormat?: string;
    level?: EditLevelType;
    compensationType?: CompensationType;
    durationInMinutes?: number;
    amount?: number;
    currency?: string;
}