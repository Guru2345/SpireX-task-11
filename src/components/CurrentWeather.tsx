import React from 'react';
import { Sunrise, Sunset, ArrowDown, ArrowUp, MapPin } from 'lucide-react';
import { WeatherData, LocationInfo, Unit } from '../types';
import { formatTemperature, getWeatherCondition } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  weather: WeatherData;
  location: LocationInfo;
  unit: Unit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  location,
  unit,
}) => {
  const { current, daily } = weather;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);
  const todayForecast = daily[0];

  // Format sunrise / sunset times
  const formatSunTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return timeStr;
    }
  };

  // Format local current date safely
  const getFormattedLocalDate = () => {
    try {
      const d = current.time ? new Date(current.time) : new Date();
      if (isNaN(d.getTime())) {
        return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      }
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  const localDateFormatted = getFormattedLocalDate();

  return (
    <div
      id="current-weather-card"
      className="w-full bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all"
    >
      {/* Background visual highlight */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left Column: Location & Main Temp */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>
                {[location.name, location.admin1, location.country].filter(Boolean).join(', ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{localDateFormatted}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-6xl sm:text-7xl font-bold tracking-tighter text-slate-900">
              {formatTemperature(current.temperature, unit)}
            </span>
            <div className="flex flex-col text-sm text-slate-600">
              <span className="font-medium text-slate-700">
                Feels like {formatTemperature(current.apparentTemperature, unit)}
              </span>
              {todayForecast && (
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="inline-flex items-center text-emerald-700 font-semibold">
                    <ArrowUp className="w-3 h-3 text-emerald-600" />
                    {formatTemperature(todayForecast.tempMax, unit)}
                  </span>
                  <span className="inline-flex items-center text-indigo-700 font-semibold">
                    <ArrowDown className="w-3 h-3 text-indigo-600" />
                    {formatTemperature(todayForecast.tempMin, unit)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Condition & Sun Times */}
        <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="flex items-center md:flex-row-reverse gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/60 shadow-xs flex items-center justify-center">
              <WeatherIcon
                weatherCode={current.weatherCode}
                isDay={current.isDay}
                className="w-12 h-12"
              />
            </div>
            <div className="md:text-right">
              <h2 className="text-xl font-bold text-slate-800">{condition.label}</h2>
              <p className="text-xs text-slate-500 max-w-xs">{condition.description}</p>
            </div>
          </div>

          {/* Sunrise / Sunset Pills */}
          {todayForecast && (todayForecast.sunrise || todayForecast.sunset) && (
            <div className="flex items-center gap-3 text-xs bg-slate-100/70 py-1.5 px-3 rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Sunrise className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">{formatSunTime(todayForecast.sunrise)}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Sunset className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium">{formatSunTime(todayForecast.sunset)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
