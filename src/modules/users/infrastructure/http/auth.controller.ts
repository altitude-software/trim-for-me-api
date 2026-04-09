import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { LoginUserDto } from '../../application/dtos/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly loginUserUseCase: LoginUserUseCase) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginUserDto) {
        return this.loginUserUseCase.execute(dto);
    }
}