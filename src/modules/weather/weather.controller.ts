import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { FetchWeatherForecast } from './dto/weather.request.dto';
import { TransformWeather } from '../../interceptors/transformResponse.interceptor';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  @ApiOperation({ summary: 'Endpoint to fetch current weather forecast data from weather-API and save it to DB' })
  @ApiResponse({
    status: 200,
    description: 'Weather forecast data successfully fetched and saved.',
    schema: {
      example: {
        lat: 37.7749,
        lon: -122.4194,
        part: ['minutely', 'alerts'],
        data: {
          current: {
            temp: 290.15,
            weather: [{ description: 'clear sky', icon: '01d' }],
          },
          hourly: [
            {
              temp: 289.95,
              weather: [{ description: 'few clouds', icon: '02d' }],
            },
          ],
          daily: [
            {
              temp: { min: 283.15, max: 294.15 },
              weather: [{ description: 'light rain', icon: '10d' }],
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service Unavailable. The external weather API is unreachable.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  public async fetchData(@Body() dto: FetchWeatherForecast) {
    return this.weatherService.fetchData(dto);
  }

  @Get()
  @UseInterceptors(TransformWeather)
  @ApiResponse({
    status: 200,
    description: 'Weather record successfully retrieved from the database.',
    schema: {
      example: {
        sunrise: 1734933422,
        sunset: 1734962224,
        temp: 270.56,
        feels_like: 270.56,
        pressure: 1011,
        humidity: 93,
        uvi: 0,
        wind_speed: 0.45,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. No weather record found with the provided parameters.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid input parameters provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error. An unexpected error occurred.',
  })
  @ApiOperation({ summary: 'Endpoint to get present weather records in DB' })
  public async getWeatherRecord(@Query() dto: FetchWeatherForecast) {
    return this.weatherService.getData(dto);
  }
}
