import { WeatherConditionInfo, Unit } from '../types';

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Sunny' : 'Clear',
        description: isDay ? 'Clear sunny sky' : 'Clear night sky',
        iconName: isDay ? 'sun' : 'moon',
        colorTheme: 'sunny',
      };
    case 1:
      return {
        label: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        description: 'Mostly clear skies with a few passing clouds',
        iconName: isDay ? 'sun' : 'moon',
        colorTheme: 'sunny',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds and pleasant weather',
        iconName: isDay ? 'cloud-sun' : 'cloud-moon',
        colorTheme: 'cloudy',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Cloud blanket across the sky',
        iconName: 'cloud',
        colorTheme: 'cloudy',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Foggy conditions with reduced visibility',
        iconName: 'cloud-fog',
        colorTheme: 'cloudy',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Light gentle drizzle',
        iconName: 'cloud-drizzle',
        colorTheme: 'rainy',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Freezing drizzle with cold road surfaces',
        iconName: 'cloud-drizzle',
        colorTheme: 'snowy',
      };
    case 61:
      return {
        label: 'Light Rain',
        description: 'Gentle raindrops falling',
        iconName: 'cloud-rain',
        colorTheme: 'rainy',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady rain throughout the area',
        iconName: 'cloud-rain',
        colorTheme: 'rainy',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Heavy precipitation, carry an umbrella',
        iconName: 'cloud-rain',
        colorTheme: 'rainy',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Freezing rain with icy conditions',
        iconName: 'cloud-snow',
        colorTheme: 'snowy',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snow',
        description: 'Snowfall in progress',
        iconName: 'snowflake',
        colorTheme: 'snowy',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Passing rain showers',
        iconName: 'cloud-rain',
        colorTheme: 'rainy',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Intermittent snow showers',
        iconName: 'cloud-snow',
        colorTheme: 'snowy',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Thunderstorms and possible lightning',
        iconName: 'cloud-lightning',
        colorTheme: 'stormy',
      };
    case 96:
    case 99:
      return {
        label: 'Hail Thunderstorm',
        description: 'Severe thunderstorm with hail',
        iconName: 'cloud-lightning',
        colorTheme: 'stormy',
      };
    default:
      return {
        label: 'Clear',
        description: 'Fair weather conditions',
        iconName: isDay ? 'sun' : 'moon',
        colorTheme: 'sunny',
      };
  }
}

export function formatTemperature(celsius: number, unit: Unit): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function getRawTemperature(celsius: number, unit: Unit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: Unit): string {
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getHumidityDescription(humidity: number): { text: string; status: 'low' | 'good' | 'high' } {
  if (humidity < 30) {
    return { text: 'Dry air', status: 'low' };
  }
  if (humidity <= 60) {
    return { text: 'Comfortable', status: 'good' };
  }
  if (humidity <= 75) {
    return { text: 'Moderately humid', status: 'high' };
  }
  return { text: 'Very humid', status: 'high' };
}

export function getUVDescription(uv: number): { text: string; level: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' } {
  if (uv <= 2) return { text: 'Low risk of harm', level: 'Low' };
  if (uv <= 5) return { text: 'Moderate protection advised', level: 'Moderate' };
  if (uv <= 7) return { text: 'High protection needed', level: 'High' };
  if (uv <= 10) return { text: 'Very high, avoid sun', level: 'Very High' };
  return { text: 'Extreme, take full protection', level: 'Extreme' };
}
