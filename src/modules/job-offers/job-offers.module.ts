import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Shared
import { SharedModule } from '../../shared/shared.module';

// Infraestructura — TypeORM
import {
    JobOfferEntity
} from './infrastructure/persistence/typeorm/job-offer.typeorm-entity';
import { TypeOrmJobOfferRepository } from './infrastructure/persistence/typeorm/job-offer.typeorm-repository';
import { MaterialEntity } from './infrastructure/persistence/typeorm/material.typeorm-entity';
import { MaterialTypeEntity } from './infrastructure/persistence/typeorm/material-type.typeorm-entity';
import { TypeOrmMaterialTypeRepository } from './infrastructure/persistence/typeorm/material-type.typeorm-repository';
import { CompensationEntity } from './infrastructure/persistence/typeorm/compensation.typeorm-entity';

// Infraestructura — HTTP
import { JobOffersController } from './infrastructure/http/job-offers.controller';
import { MaterialTypesController } from './infrastructure/http/material-types.controller';

// Aplicación — Use cases
import { CreateJobOfferUseCase } from './application/use-cases/create-job-offer.use-case';
import { UpdateJobOfferUseCase } from './application/use-cases/update-job-offer.use-case';
import { GetJobOffersByCreatorUseCase } from './application/use-cases/get-job-offers-by-creator.use-case';
import { GetAllJobOffersUseCase } from './application/use-cases/get-all-job-offers.use-case';
import { DeleteJobOfferUseCase } from './application/use-cases/delete-job-offer.use-case';
import { GetMaterialTypesUseCase } from './application/use-cases/get-material-types.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobOfferEntity,
            MaterialEntity,
            MaterialTypeEntity,
            CompensationEntity,
        ]),
        SharedModule,
    ],
    controllers: [JobOffersController, MaterialTypesController],
    providers: [
        { provide: 'IJobOfferRepository', useClass: TypeOrmJobOfferRepository },
        { provide: 'IMaterialTypeRepository', useClass: TypeOrmMaterialTypeRepository },
        CreateJobOfferUseCase,
        UpdateJobOfferUseCase,
        GetJobOffersByCreatorUseCase,
        GetAllJobOffersUseCase,
        DeleteJobOfferUseCase,
        GetMaterialTypesUseCase,
    ],
})
export class JobOffersModule { }