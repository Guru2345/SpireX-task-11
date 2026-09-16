import React from 'react';
import { Droplets, Wind, SunMedium, Gauge, CloudRain, Navigation } from 'lucide-react';
import { WeatherData, Unit } from '../types';
import {
  formatWindSpeed,
  getWindDirection,
  getHumidityDescription,
  getUVDescription,
} from '../utils/weatherUtils';

interface WeatherMetricsProps {
  weather: WeatherData;
  unit: Unit;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather, unit }) => {
  const { current, daily } = weather;
  const humidityInfo = getHumidityDescription(current.relativeHumidity);
  const uvIndexMax = daily[0]?.uvIndexMax ?? 0;
  const uvInfo = getUVDescription(uvIndexMax);
  const windDir = getWindDirection(current.windDirection);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* Humidity Metric */}
      <div
        id="metric-humidity-card"
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Humidity
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Droplets className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {Math.round(current.relativeHumidity)}%
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">{humidityInfo.text}</span>
          </div>
          {/* Visual bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, current.relativeHumidity))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Wind Metric */}
      <div
        id="metric-wind-card"
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Wind
          </span>
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Wind className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {formatWindSpeed(current.windSpeed, unit)}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Navigation
              className="w-3.5 h-3.5 text-slate-400"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
            <span>
              {windDir} ({Math.round(current.windDirection)}°)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (current.windSpeed / 50) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* UV Index Metric */}
      <div
        id="metric-uv-card"
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            UV Index
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <SunMedium className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {Math.round(uvIndexMax)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {uvInfo.level}
            </span>
          </div>
          <div className="mt-2.5 text-xs text-slate-600 font-medium truncate">
            {uvInfo.text}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (uvIndexMax / 11) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pressure & Precipitation Metric */}
      <div
        id="metric-pressure-card"
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-colors"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Air Pressure
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Gauge className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {Math.round(current.surfacePressure)}{' '}
            <span className="text-sm font-normal text-slate-500">hPa</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-500" />
              Precip: {current.precipitation} mm
            </span>
            <span>
              {current.surfacePressure >= 1013 ? 'Normal/High' : 'Low Pressure'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, ((current.surfacePressure - 960) / 80) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
