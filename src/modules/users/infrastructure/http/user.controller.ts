import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { JwtAuthGuard, CurrentUser } from '../../../../shared/infrastructure/http/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../../shared/infrastructure/http/guards/jwt.strategy';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado.', type: UserResponseDto })
    @ApiResponse({ status: 409, description: 'El email ya está en uso.' })
    async create(@Body() dto: CreateUserDto) {
        return this.createUserUseCase.execute(dto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: UserResponseDto })
    @ApiResponse({ status: 403, description: 'No tienes permiso para ver este usuario.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async findOne(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
        if (currentUser.sub !== id) throw new ForbiddenException();
        return this.getUserByIdUseCase.execute({ userId: id });
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar usuario' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado.', type: UserResponseDto })
    @ApiResponse({ status: 403, description: 'No tienes permiso para editar este usuario.' })
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() currentUser: JwtPayload) {
        if (currentUser.sub !== id) throw new ForbiddenException();
        return this.updateUserUseCase.execute(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar usuario' })
    @ApiResponse({ status: 204, description: 'Usuario eliminado.' })
    @ApiResponse({ status: 403, description: 'No tienes permiso para eliminar este usuario.' })
    async remove(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
        if (currentUser.sub !== id) throw new ForbiddenException();
        return this.deleteUserUseCase.execute({ userId: id });
    }
}