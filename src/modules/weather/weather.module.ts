import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherRepository } from './weather.repository';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, WeatherRepository],
  exports: [],
})
export class WeatherModule {}
