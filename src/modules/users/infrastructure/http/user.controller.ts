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
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { JwtAuthGuard, CurrentUser } from '../../../../shared/infrastructure/http/guards/jwt-auth.guard';
import type { JwtPayload } from '../../../../shared/infrastructure/http/guards/jwt.strategy';

@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly getUserById: GetUserByIdUseCase,
        private readonly deleteUser: DeleteUserUseCase,
    ) { }

    // Público — registro
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateUserDto) {
        return this.createUserUseCase.execute(dto);
    }

    // Protegido — solo el propio usuario puede ver su perfil
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @Param('id') id: string,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        if (currentUser.sub !== id) throw new ForbiddenException();
        return this.getUserById.execute({ userId: id });
    }

    // Protegido — solo el propio usuario puede actualizarse
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        if (currentUser.sub !== id) throw new ForbiddenException();
        return this.updateUserUseCase.execute(id, dto);
    }

    // Protegido — solo el propio usuario puede eliminarse
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id') id: string,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        if (currentUser.sub !== id) throw new ForbiddenException();
        return this.deleteUser.execute({ userId: id });
    }
}