import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Shared
import { SharedModule } from '../../shared/shared.module';

// Infraestructura — TypeORM
import { UserEntity } from './infrastructure/persistence/typeorm/user.typeorm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/user.typeorm-repository';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher';

// Infraestructura — HTTP
import { UsersController } from './infrastructure/http/user.controller';
import { AuthController } from './infrastructure/http/auth.controller';

// Aplicación — Use cases
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        SharedModule,
    ],
    controllers: [UsersController, AuthController],
    providers: [
        { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
        { provide: 'IPasswordHasher', useClass: BcryptPasswordHasher },
        CreateUserUseCase,
        LoginUserUseCase,
        UpdateUserUseCase,
    ],
    exports: ['IUserRepository'],
})
export class UsersModule { }