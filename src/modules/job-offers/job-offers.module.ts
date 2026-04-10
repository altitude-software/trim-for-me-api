import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Shared
import { SharedModule } from '../../shared/shared.module';

// Infraestructura — TypeORM
import {
    JobOfferEntity,
    MaterialEntity,
    VideoFormatEntity,
    EditLevelEntity,
    CompensationEntity,
} from './infrastructure/persistence/typeorm/job-offer.typeorm-entity';
import { TypeOrmJobOfferRepository } from './infrastructure/persistence/typeorm/job-offer.typeorm-repository';

// Infraestructura — HTTP
import { JobOffersController } from './infrastructure/http/job-offers.controller';

// Aplicación — Use cases
import { CreateJobOfferUseCase } from './application/use-cases/create-job-offer.use-case';
import { UpdateJobOfferUseCase } from './application/use-cases/update-job-offer.use-case';
import { GetJobOffersByCreatorUseCase } from './application/use-cases/get-job-offers-by-creator.use-case';
import { DeleteJobOfferUseCase } from './application/use-cases/delete-job-offer.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobOfferEntity,
            MaterialEntity,
            VideoFormatEntity,
            EditLevelEntity,
            CompensationEntity,
        ]),
        SharedModule,
    ],
    controllers: [JobOffersController],
    providers: [
        { provide: 'IJobOfferRepository', useClass: TypeOrmJobOfferRepository },
        CreateJobOfferUseCase,
        UpdateJobOfferUseCase,
        GetJobOffersByCreatorUseCase,
        DeleteJobOfferUseCase,
    ],
})
export class JobOffersModule { }