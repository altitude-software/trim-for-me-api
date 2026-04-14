import { ApiPropertyOptional } from '@nestjs/swagger';
import { EditLevelType } from '../../domain/entities/edit-level.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';
import { VideoOrientation, VideoLength } from '../../domain/entities/video-format.entity';
import { MaterialDto } from './create-job-offer.dto';

export class UpdateJobOfferDto {
    @ApiPropertyOptional({ example: 'Descripción actualizada' })
    description?: string;

    @ApiPropertyOptional({ type: [MaterialDto] })
    materials?: MaterialDto[];

    @ApiPropertyOptional({ enum: VideoOrientation })
    orientation?: VideoOrientation;

    @ApiPropertyOptional({ enum: VideoLength })
    length?: VideoLength;

    @ApiPropertyOptional({ example: '16:33' })
    technicalFormat?: string;

    @ApiPropertyOptional({ enum: EditLevelType })
    level?: EditLevelType;

    @ApiPropertyOptional({ enum: CompensationType })
    compensationType?: CompensationType;

    @ApiPropertyOptional({ example: 10 })
    durationInMinutes?: number;

    @ApiPropertyOptional({ example: 50 })
    amount?: number;

    @ApiPropertyOptional({ example: 'USD' })
    currency?: string;
}