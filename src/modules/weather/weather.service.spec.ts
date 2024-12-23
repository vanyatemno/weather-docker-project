import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';
import { WeatherRepository } from './weather.repository';
import { ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import { ExcludeOptions } from '../../common/enums/exclude-options.enum';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService - fetchData', () => {
  let weatherService: WeatherService;
  let weatherRepository: WeatherRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mockAPIKey'),
          },
        },
        {
          provide: WeatherRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
    weatherRepository = module.get<WeatherRepository>(WeatherRepository);
  });

  it('should fetch weather data and save it to the repository', async () => {
    const mockData = {
      lat: 10,
      lon: 20,
      part: [ExcludeOptions.MINUTELY],
    };
    const mockApiResponse = { data: { mockKey: 'mockValue' } };
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    weatherRepository.save = jest.fn().mockResolvedValue({
      ...mockData,
      data: mockApiResponse.data,
    });

    const result = await weatherService.fetchData(mockData);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat: mockData.lat,
        lon: mockData.lon,
        exclude: mockData.part,
        appid: 'mockAPIKey',
      },
      paramsSerializer: expect.any(Function),
    });

    expect(weatherRepository.save).toHaveBeenCalledWith({
      lat: mockData.lat,
      lon: mockData.lon,
      part: mockData.part.sort(),
      data: mockApiResponse.data,
    });

    expect(result).toEqual({
      lat: mockData.lat,
      lon: mockData.lon,
      part: mockData.part,
      data: mockApiResponse.data,
    });
  });

  it('should throw ServiceUnavailableException when an AxiosError is caught', async () => {
    const mockData = {
      lat: 10,
      lon: 20,
      part: [ExcludeOptions.HOURLY],
    };

    const mockError = {
      isAxiosError: true,
      response: undefined,
      config: {},
      code: 'ERR_NETWORK',
      request: {},
      message: 'Axios error',
    };

    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAxios.get.mockRejectedValue(mockError);

    await expect(weatherService.fetchData(mockData)).rejects.toThrow(ServiceUnavailableException);
  });

  it('should rethrow non-Axios errors', async () => {
    const mockData = {
      lat: 10,
      lon: 20,
      part: [ExcludeOptions.DAILY],
    };
    const mockError = new Error('Non-Axios error');
    mockedAxios.get.mockRejectedValue(mockError);

    await expect(weatherService.fetchData(mockData)).rejects.toThrow(mockError);
  });
});
