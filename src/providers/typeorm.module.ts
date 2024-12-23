import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Weather } from '../modules/weather/weather.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: undefined,
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [Weather],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        migrationsTableName: 'typeorm_migrations',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeOrmProviderModule {}
