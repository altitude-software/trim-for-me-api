import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { JwtStrategy } from './infrastructure/http/guards/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/http/guards/jwt-auth.guard';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d') as StringValue,
                },
            }),
        }),
    ],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [JwtStrategy, JwtAuthGuard, JwtModule],
})
export class SharedModule { }