import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Email } from '../../domain/value-objects/email.vo';
import { LoginUserDto } from '../dtos/login-user.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';

import type { IUserRepository } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher.interface';

export class InvalidCredentialsException extends Error {
    constructor() {
        super('Invalid credentials');
    }
}

@Injectable()
export class LoginUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('IPasswordHasher')
        private readonly passwordHasher: IPasswordHasher,
        private readonly jwtService: JwtService,
    ) { }

    async execute(dto: LoginUserDto): Promise<LoginResponseDto> {
        const email = new Email(dto.email);

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new InvalidCredentialsException();

        const passwordMatch = await this.passwordHasher.compare(dto.password, user.password);
        if (!passwordMatch) throw new InvalidCredentialsException();

        const payload = { sub: user.id.value, email: user.email.value, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }
}