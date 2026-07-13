import { ApiProperty } from '@nestjs/swagger';
import { VideoOrientation, VideoLength, EditLevelType } from '../../domain/entities/job-offer.entity';
import { CompensationType } from '../../domain/entities/compensation.entity';

export class MaterialResponseDto {
    @ApiProperty() id!: string;
    @ApiProperty({ nullable: true }) url!: string | null;
    @ApiProperty({ nullable: true }) type!: string | null;
    @ApiProperty({ nullable: true }) description!: string | null;
    @ApiProperty({ nullable: true }) duration!: number | null;
    @ApiProperty({ nullable: true }) quantity!: number | null;
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
    @ApiProperty() name!: string;
    @ApiProperty({ nullable: true }) description!: string | null;
    @ApiProperty({ type: [MaterialResponseDto] }) materials!: MaterialResponseDto[];
    @ApiProperty({ enum: VideoOrientation }) orientation!: VideoOrientation;
    @ApiProperty({ enum: VideoLength }) length!: VideoLength;
    @ApiProperty({ enum: EditLevelType }) level!: EditLevelType;
    @ApiProperty({ type: CompensationResponseDto, nullable: true }) compensation!: CompensationResponseDto | null;
    @ApiProperty() createdAt!: Date;
    @ApiProperty() updatedAt!: Date;
}
