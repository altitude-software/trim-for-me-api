import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateJobOfferUseCase } from '../../application/use-cases/create-job-offer.use-case';
import { UpdateJobOfferUseCase } from '../../application/use-cases/update-job-offer.use-case';
import { GetJobOffersByCreatorUseCase } from '../../application/use-cases/get-job-offers-by-creator.use-case';
import { DeleteJobOfferUseCase } from '../../application/use-cases/delete-job-offer.use-case';
import { CreateJobOfferDto } from '../../application/dtos/create-job-offer.dto';
import { UpdateJobOfferDto } from '../../application/dtos/update-job-offer.dto';
import { JobOfferResponseDto } from '../../application/dtos/job-offer-response.dto';
import { JwtAuthGuard, CurrentUser } from '../../../../shared/infrastructure/http/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../../shared/infrastructure/http/guards/jwt.strategy';

@ApiTags('job-offers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('job-offers')
export class JobOffersController {
    constructor(
        private readonly createJobOfferUseCase: CreateJobOfferUseCase,
        private readonly updateJobOfferUseCase: UpdateJobOfferUseCase,
        private readonly getJobOffersByCreatorUseCase: GetJobOffersByCreatorUseCase,
        private readonly deleteJobOfferUseCase: DeleteJobOfferUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear una oferta de trabajo' })
    @ApiResponse({ status: 201, description: 'Oferta creada.', type: JobOfferResponseDto })
    async create(@Body() dto: CreateJobOfferDto, @CurrentUser() currentUser: JwtPayload) {
        return this.createJobOfferUseCase.execute(currentUser.sub, dto);
    }

    @Get('my')
    @ApiOperation({ summary: 'Obtener mis ofertas de trabajo' })
    @ApiResponse({ status: 200, description: 'Lista de ofertas.', type: [JobOfferResponseDto] })
    async findMy(@CurrentUser() currentUser: JwtPayload) {
        return this.getJobOffersByCreatorUseCase.execute({ creatorId: currentUser.sub });
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar una oferta de trabajo' })
    @ApiResponse({ status: 200, description: 'Oferta actualizada.', type: JobOfferResponseDto })
    @ApiResponse({ status: 403, description: 'No eres el creador de esta oferta.' })
    @ApiResponse({ status: 404, description: 'Oferta no encontrada.' })
    async update(@Param('id') id: string, @Body() dto: UpdateJobOfferDto, @CurrentUser() currentUser: JwtPayload) {
        return this.updateJobOfferUseCase.execute(currentUser.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar una oferta de trabajo' })
    @ApiResponse({ status: 204, description: 'Oferta eliminada.' })
    @ApiResponse({ status: 403, description: 'No eres el creador de esta oferta.' })
    @ApiResponse({ status: 404, description: 'Oferta no encontrada.' })
    async remove(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
        return this.deleteJobOfferUseCase.execute({ jobOfferId: id, creatorId: currentUser.sub });
    }
}