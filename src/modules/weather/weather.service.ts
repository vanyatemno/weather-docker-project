import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExcludeOptions } from '../../common/enums/exclude-options.enum';
import { Weather } from './weather.entity';
import { WeatherRepository } from './weather.repository';
import axios from 'axios';
import { FetchWeatherForecast } from './dto/weather.request.dto';
import { Raw } from 'typeorm';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly weatherRepository: WeatherRepository,
  ) {
    this.apiKey = configService.get('WEATHER_API_KEY');
  }

  async fetchData(data: { lat: number; lon: number; part?: ExcludeOptions[] }): Promise<Weather> {
    const { lat, lon, part } = data;

    try {
      const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
        params: {
          lat,
          lon,
          exclude: part,
          appid: this.apiKey,
        },
        paramsSerializer: (params) => new URLSearchParams(params).toString(),
      });

      console.log(response);

      return this.weatherRepository.save({
        lat,
        lon,
        part: part.sort(),
        data: response.data,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new ServiceUnavailableException();
      } else {
        throw error;
      }
    }
  }

  async getData(query: FetchWeatherForecast) {
    const { lat, lon, part } = query;

    const weather = await this.weatherRepository.findOne({
      where: {
        lat,
        lon,
        ...(part && { part: Raw((alias) => `${alias} = :arr`, { arr: part.sort() }) }),
      },
      order: { createdAt: 'desc' },
    });

    if (!weather) {
      throw new NotFoundException('Could not find record with provided parameters');
    }

    return weather;
  }
}
