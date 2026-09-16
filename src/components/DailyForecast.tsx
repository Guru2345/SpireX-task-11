import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { DailyItem, Unit } from '../types';
import { formatTemperature, getWeatherCondition, getRawTemperature } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  items: DailyItem[];
  unit: Unit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ items, unit }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Find global min and max across all days to normalize the bar
  const minTemps = items.map((i) => getRawTemperature(i.tempMin, unit));
  const maxTemps = items.map((i) => getRawTemperature(i.tempMax, unit));
  const allMin = Math.min(...minTemps);
  const allMax = Math.max(...maxTemps);
  const range = Math.max(1, allMax - allMin);

  return (
    <div
      id="daily-forecast-container"
      className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-bold text-slate-900">7-Day Forecast</h3>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode, true);
          const rawMin = getRawTemperature(item.tempMin, unit);
          const rawMax = getRawTemperature(item.tempMax, unit);

          const leftPercent = Math.max(0, ((rawMin - allMin) / range) * 100);
          const barWidthPercent = Math.max(8, ((rawMax - rawMin) / range) * 100);

          return (
            <div
              key={item.date}
              id={`daily-item-${idx}`}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-sm hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
            >
              {/* Day info */}
              <div className="w-24 sm:w-28 flex-shrink-0">
                <span className="font-semibold text-slate-900 block">{item.dayName}</span>
                <span className="text-xs text-slate-400">{item.formattedDate}</span>
              </div>

              {/* Weather icon & condition */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <WeatherIcon weatherCode={item.weatherCode} className="w-6 h-6 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-600 truncate font-medium hidden sm:inline">
                  {condition.label}
                </span>

                {item.precipitationProbability > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-blue-600 font-medium ml-1">
                    <Droplets className="w-3 h-3" />
                    {item.precipitationProbability}%
                  </span>
                )}
              </div>

              {/* Min - Range bar - Max */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                <span className="text-xs font-semibold text-indigo-900 w-9 text-right">
                  {formatTemperature(item.tempMin, unit)}
                </span>

                {/* Visual temperature bar */}
                <div className="w-16 sm:w-28 bg-slate-100 h-2 rounded-full relative overflow-hidden hidden sm:block">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-indigo-400 via-amber-400 to-rose-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-semibold text-rose-900 w-9 text-left">
                  {formatTemperature(item.tempMax, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
