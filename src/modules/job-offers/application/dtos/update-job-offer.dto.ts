import { ApiPropertyOptional } from '@nestjs/swagger';
import { VideoOrientation, VideoLength, EditLevelType } from '../../domain/entities/job-offer.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';
import { MaterialDto } from './create-job-offer.dto';

export class UpdateJobOfferDto {
    @ApiPropertyOptional({ example: 'Editor para canal de YouTube' })
    name?: string;

    @ApiPropertyOptional({ example: 'Descripción actualizada' })
    description?: string;

    @ApiPropertyOptional({ type: [MaterialDto] })
    materials?: MaterialDto[];

    @ApiPropertyOptional({ enum: VideoOrientation })
    orientation?: VideoOrientation;

    @ApiPropertyOptional({ enum: VideoLength })
    length?: VideoLength;

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
