import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { JobOffersModule } from './modules/job-offers/job-offers.module';

@Module({
  imports: [
    // 1.Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 2. Base de datos
    DatabaseModule,
    // 3. Módulos de dominio
    UsersModule,
    JobOffersModule,
  ],
})
export class AppModule { }