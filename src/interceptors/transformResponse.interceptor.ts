import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Weather } from '../modules/weather/weather.entity';
import { WeatherResponse } from '../modules/weather/dto/weather.response.dto';

@Injectable()
export class TransformWeather implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((weather: Weather) => {
        if (!weather) return null;

        return {
          sunrise: weather.data.current.sunrise,
          sunset: weather.data.current.sunset,
          temp: weather.data.current.temp,
          feels_like: weather.data.current.feels_like,
          pressure: weather.data.current.pressure,
          humidity: weather.data.current.humidity,
          uvi: weather.data.current.uvi,
          wind_speed: weather.data.current.wind_speed,
        } as WeatherResponse;
      }),
    );
  }
}