import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EditLevelType } from '../../domain/entities/edit-level.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';
import { VideoOrientation, VideoLength } from '../../domain/entities/video-format.entity';

export class MaterialDto {
    @ApiPropertyOptional({ example: 'https://storage.com/video.mp4' })
    url?: string | null;

    @ApiPropertyOptional({ example: 'reference' })
    type?: string | null;

    @ApiPropertyOptional({ example: 'Video de referencia de estilo' })
    description?: string | null;
}

export class CreateJobOfferDto {
    @ApiPropertyOptional({ example: 'Necesito editor para canal de YouTube' })
    description?: string;

    @ApiProperty({ type: [MaterialDto] })
    materials!: MaterialDto[];

    @ApiProperty({ enum: VideoOrientation, example: VideoOrientation.HORIZONTAL })
    orientation!: VideoOrientation;

    @ApiProperty({ enum: VideoLength, example: VideoLength.LONG })
    length!: VideoLength;

    @ApiPropertyOptional({ example: 'H.264' })
    technicalFormat?: string;

    @ApiProperty({ enum: EditLevelType, example: EditLevelType.INTERMEDIATE })
    level!: EditLevelType;

    @ApiProperty({ enum: CompensationType, example: CompensationType.PER_VIDEO })
    compensationType!: CompensationType;

    @ApiPropertyOptional({ example: 10 })
    durationInMinutes?: number;

    @ApiPropertyOptional({ example: 50 })
    amount?: number;

    @ApiPropertyOptional({ example: 'USD' })
    currency?: string;
}