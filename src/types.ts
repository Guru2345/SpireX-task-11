export type Unit = 'celsius' | 'fahrenheit';

export interface LocationInfo {
  id?: number;
  name: string;
  country?: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  precipitation: number;
  isDay: boolean;
}

export interface HourlyItem {
  time: string;
  formattedTime: string;
  temperature: number;
  weatherCode: number;
  humidity: number;
  precipitationProbability: number;
}

export interface DailyItem {
  date: string;
  dayName: string;
  formattedDate: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherData {
  current: CurrentWeatherData;
  hourly: HourlyItem[];
  daily: DailyItem[];
  timezone: string;
  elevation?: number;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: 'sun' | 'moon' | 'cloud-sun' | 'cloud-moon' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-snow' | 'cloud-lightning' | 'snowflake';
  colorTheme: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
}
