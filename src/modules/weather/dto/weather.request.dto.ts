import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExcludeOptions } from '../../../common/enums/exclude-options.enum';
import { Transform } from 'class-transformer';
import { toArray } from '../../../common/transformers/toArray';

export class FetchWeatherForecast {
  @ApiProperty({
    type: Number,
    example: 50.450001,
    description: 'Latitude of desired weather data',
    required: true,
  })
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    type: Number,
    example: 30.523333,
    description: 'Longitude of desired weather data',
    required: true,
  })
  @IsNotEmpty()
  lon: number;

  @ApiProperty({
    required: false,
    enum: ExcludeOptions,
    description: 'Array of options to exclude from response',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @Transform(toArray)
  @IsEnum(ExcludeOptions, { each: true })
  part: ExcludeOptions[];
}
