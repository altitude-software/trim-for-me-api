import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    ForbiddenException,
} from '@nestjs/common';
import { CreateJobOfferUseCase } from '../../application/use-cases/create-job-offer.use-case';
import { UpdateJobOfferUseCase } from '../../application/use-cases/update-job-offer.use-case';
import { GetJobOffersByCreatorUseCase } from '../../application/use-cases/get-job-offers-by-creator.use-case';
import { DeleteJobOfferUseCase } from '../../application/use-cases/delete-job-offer.use-case';
import { CreateJobOfferDto } from '../../application/dtos/create-job-offer.dto';
import { UpdateJobOfferDto } from '../../application/dtos/update-job-offer.dto';
import { JwtAuthGuard, CurrentUser } from '../../../../shared/infrastructure/http/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../../shared/infrastructure/http/guards/jwt.strategy';

@Controller('job-offers')
@UseGuards(JwtAuthGuard)
export class JobOffersController {
    constructor(
        private readonly createJobOfferUseCase: CreateJobOfferUseCase,
        private readonly updateJobOfferUseCase: UpdateJobOfferUseCase,
        private readonly getJobOffersByCreatorUseCase: GetJobOffersByCreatorUseCase,
        private readonly deleteJobOfferUseCase: DeleteJobOfferUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() dto: CreateJobOfferDto,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        return this.createJobOfferUseCase.execute(currentUser.sub, dto);
    }

    @Get('my')
    async findMy(@CurrentUser() currentUser: JwtPayload) {
        return this.getJobOffersByCreatorUseCase.execute({ creatorId: currentUser.sub });
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateJobOfferDto,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        // creatorId viene del token — el use case valida ownership
        return this.updateJobOfferUseCase.execute(currentUser.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id') id: string,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        return this.deleteJobOfferUseCase.execute({
            jobOfferId: id,
            creatorId: currentUser.sub,
        });
    }
}