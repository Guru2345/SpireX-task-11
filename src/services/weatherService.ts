import { LocationInfo, WeatherData } from '../types';

export const DEFAULT_LOCATIONS: LocationInfo[] = [
  { name: 'New York', country: 'United States', countryCode: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', admin1: 'England', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', countryCode: 'FR', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' },
];

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Location search failed: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: { id: number; name: string; country?: string; country_code?: string; admin1?: string; latitude: number; longitude: number; timezone?: string }) => ({
      id: item.id,
      name: item.name,
      country: item.country,
      countryCode: item.country_code,
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
    }));
  } catch (error) {
    console.error('Failed to search locations:', error);
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<Partial<LocationInfo>> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
      headers: {
        'Accept-Language': 'en',
      }
    });
    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Current Location';
      const country = addr.country;
      const countryCode = addr.country_code ? addr.country_code.toUpperCase() : undefined;
      const admin1 = addr.state;
      return { name, country, countryCode, admin1, latitude: lat, longitude: lon };
    }
  } catch {
    // Fallback if nominatim is unavailable
  }

  return {
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '8',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  const current = {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    relativeHumidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    surfacePressure: data.current.surface_pressure,
    precipitation: data.current.precipitation,
    isDay: Boolean(data.current.is_day),
  };

  // Find index of current hour or closest hour
  const hourlyTimes: string[] = data.hourly.time || [];
  const now = new Date(data.current.time).getTime();
  let startIndex = 0;
  for (let i = 0; i < hourlyTimes.length; i++) {
    const t = new Date(hourlyTimes[i]).getTime();
    if (t >= now - 30 * 60 * 1000) {
      startIndex = i;
      break;
    }
  }

  // Next 24 hours
  const hourly = [];
  const maxHourlyCount = Math.min(24, hourlyTimes.length - startIndex);
  for (let i = 0; i < maxHourlyCount; i++) {
    const idx = startIndex + i;
    const timeStr = hourlyTimes[idx];
    const dateObj = new Date(timeStr);
    const formattedTime = i === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    hourly.push({
      time: timeStr,
      formattedTime,
      temperature: data.hourly.temperature_2m[idx],
      weatherCode: data.hourly.weather_code[idx],
      humidity: data.hourly.relative_humidity_2m[idx],
      precipitationProbability: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[idx] ?? 0 : 0,
    });
  }

  // Next 7 days
  const dailyTimes: string[] = data.daily.time || [];
  const daily = [];
  const daysCount = Math.min(7, dailyTimes.length);
  for (let i = 0; i < daysCount; i++) {
    const dateStr = dailyTimes[i];
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString([], { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    daily.push({
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode: data.daily.weather_code[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      precipitationProbability: data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[i] ?? 0 : 0,
      sunrise: data.daily.sunrise ? data.daily.sunrise[i] : '',
      sunset: data.daily.sunset ? data.daily.sunset[i] : '',
      uvIndexMax: data.daily.uv_index_max ? data.daily.uv_index_max[i] ?? 0 : 0,
    });
  }

  return {
    current,
    hourly,
    daily,
    timezone: data.timezone || 'UTC',
    elevation: data.elevation,
  };
}

export function getFallbackWeatherData(): WeatherData {
  const now = new Date();
  const currentHour = now.getHours();

  const hourly = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    const hour = d.getHours();
    hourly.push({
      time: d.toISOString(),
      formattedTime: i === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      temperature: 20 + Math.sin((hour - 6) / 4) * 5,
      weatherCode: 1,
      humidity: 55 + Math.cos(hour / 3) * 10,
      precipitationProbability: Math.max(0, Math.round(Math.sin(i / 3) * 15)),
    });
  }

  const daily = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400 * 1000);
    daily.push({
      date: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short' }),
      formattedDate: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      weatherCode: [0, 1, 2, 61, 2, 1, 0][i % 7],
      tempMax: 24 - (i % 3),
      tempMin: 15 + (i % 2),
      precipitationProbability: [5, 10, 20, 45, 15, 5, 0][i % 7],
      sunrise: new Date(d.setHours(6, 30, 0)).toISOString(),
      sunset: new Date(d.setHours(19, 15, 0)).toISOString(),
      uvIndexMax: 6,
    });
  }

  return {
    current: {
      time: now.toISOString(),
      temperature: 22,
      apparentTemperature: 22.5,
      relativeHumidity: 58,
      weatherCode: 1,
      windSpeed: 14.5,
      windDirection: 135,
      surfacePressure: 1016,
      precipitation: 0,
      isDay: currentHour >= 6 && currentHour <= 19,
    },
    hourly,
    daily,
    timezone: 'UTC',
    elevation: 32,
  };
}
