export type WeatherApiResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: any;
  minutely?: any[];
  hourly?: any[];
  daily?: any[];
  alerts?: any[];
};
