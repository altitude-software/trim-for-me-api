import { ApiProperty } from '@nestjs/swagger';
import { EditLevelType } from '../../domain/entities/edit-level.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';
import { VideoOrientation, VideoLength } from '../../domain/entities/video-format.entity';

export class MaterialResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty({ nullable: true }) url!: string | null;
    @ApiProperty({ nullable: true }) type!: string | null;
    @ApiProperty({ nullable: true }) description!: string | null;
}

export class VideoFormatResponseDto {
    @ApiProperty({ enum: VideoOrientation }) orientation!: VideoOrientation;
    @ApiProperty({ enum: VideoLength }) length!: VideoLength;
    @ApiProperty({ nullable: true }) technicalFormat!: string | null;
}

export class EditLevelResponseDto {
    @ApiProperty({ enum: EditLevelType }) level!: EditLevelType;
}

export class CompensationResponseDto {
    @ApiProperty({ enum: CompensationType }) type!: CompensationType;
    @ApiProperty({ nullable: true }) durationInMinutes!: number | null;
    @ApiProperty({ nullable: true }) amount!: number | null;
    @ApiProperty({ nullable: true }) currency!: string | null;
}

export class JobOfferResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty() creatorId!: string;
    @ApiProperty({ nullable: true }) description!: string | null;
    @ApiProperty({ type: [MaterialResponseDto] }) materials!: MaterialResponseDto[];
    @ApiProperty({ type: VideoFormatResponseDto }) videoFormat!: VideoFormatResponseDto;
    @ApiProperty({ type: EditLevelResponseDto }) editLevel!: EditLevelResponseDto;
    @ApiProperty({ type: CompensationResponseDto }) compensation!: CompensationResponseDto;
    @ApiProperty() createdAt!: Date;
    @ApiProperty() updatedAt!: Date;
}