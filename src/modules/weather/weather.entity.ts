import 'reflect-metadata';

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { WeatherApiResponse } from '../../common/types/weather-api.types';
import { ExcludeOptions } from '../../common/enums/exclude-options.enum';

@Entity('Weather')
export class Weather {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column('numeric')
  lat: number;

  @Column('numeric')
  lon: number;

  @Column({
    type: 'enum',
    enum: ExcludeOptions,
    array: true,
    nullable: true,
  })
  part: ExcludeOptions[];

  @Column('jsonb')
  data: WeatherApiResponse;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
