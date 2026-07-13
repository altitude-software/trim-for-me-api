import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VideoOrientation, VideoLength, EditLevelType } from '../../domain/entities/job-offer.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';

export class MaterialDto {
    @ApiPropertyOptional({ example: 'https://storage.com/video.mp4' })
    url?: string | null;

    @ApiPropertyOptional({ example: 'b3f1c2d4-...' })
    type?: string | null;

    @ApiPropertyOptional({ example: 'Video de referencia de estilo' })
    description?: string | null;

    @ApiPropertyOptional({ example: 120 })
    duration?: number | null;

    @ApiPropertyOptional({ example: 3 })
    quantity?: number | null;
}

export class CreateJobOfferDto {
    @ApiProperty({ example: 'Editor para canal de YouTube' })
    name!: string;

    @ApiPropertyOptional({ example: 'Necesito editor para canal de YouTube' })
    description?: string;

    @ApiProperty({ type: [MaterialDto] })
    materials!: MaterialDto[];

    @ApiProperty({ enum: VideoOrientation, example: VideoOrientation.HORIZONTAL })
    orientation!: VideoOrientation;

    @ApiProperty({ enum: VideoLength, example: VideoLength.LONG })
    length!: VideoLength;

    @ApiProperty({ enum: EditLevelType, example: EditLevelType.INTERMEDIATE })
    level!: EditLevelType;

    @ApiPropertyOptional({ enum: CompensationType, example: CompensationType.PER_VIDEO })
    compensationType?: CompensationType;

    @ApiPropertyOptional({ example: 10 })
    durationInMinutes?: number;

    @ApiPropertyOptional({ example: 50 })
    amount?: number;

    @ApiPropertyOptional({ example: 'USD' })
    currency?: string;
}
