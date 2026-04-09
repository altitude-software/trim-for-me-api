import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.getOrThrow<string>('DB_HOST'),
                port: config.getOrThrow<number>('DB_PORT'),
                username: config.getOrThrow<string>('DB_USER'),
                password: config.getOrThrow<string>('DB_PASSWORD'),
                database: config.getOrThrow<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: false,
            }),
        }),
    ],
})
export class DatabaseModule { }