import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmProviderModule } from './providers/typeorm.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmProviderModule,
    WeatherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
