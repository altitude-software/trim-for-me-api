import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { LoginResponseDto } from '../../application/dtos/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly loginUserUseCase: LoginUserUseCase) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({ status: 200, description: 'Login exitoso. Retorna JWT.', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    async login(@Body() dto: LoginUserDto) {
        return this.loginUserUseCase.execute(dto);
    }
}