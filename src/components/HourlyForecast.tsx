import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyItem, Unit } from '../types';
import { formatTemperature } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  items: HourlyItem[];
  unit: Unit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ items, unit }) => {
  return (
    <div
      id="hourly-forecast-container"
      className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-blue-600" />
        <h3 className="text-base font-bold text-slate-900">24-Hour Forecast</h3>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1 flex gap-3 scrollbar-thin scrollbar-thumb-slate-200">
        {items.map((item, idx) => {
          const isCurrent = idx === 0;
          return (
            <div
              key={item.time}
              id={`hourly-item-${idx}`}
              className={`flex-shrink-0 w-20 sm:w-22 py-3 px-2 rounded-xl flex flex-col items-center justify-between text-center transition-all ${
                isCurrent
                  ? 'bg-blue-50/80 border border-blue-200 text-blue-950 font-medium'
                  : 'bg-slate-50/60 hover:bg-slate-100/70 border border-slate-200/60 text-slate-700'
              }`}
            >
              <span className={`text-xs ${isCurrent ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                {item.formattedTime}
              </span>

              <div className="my-2.5">
                <WeatherIcon weatherCode={item.weatherCode} className="w-7 h-7" />
              </div>

              <span className="text-sm font-bold text-slate-900">
                {formatTemperature(item.temperature, unit)}
              </span>

              <div className="mt-1 flex items-center justify-center gap-0.5 text-[10px] text-slate-500 min-h-[16px]">
                {item.precipitationProbability > 0 ? (
                  <>
                    <Droplets className="w-2.5 h-2.5 text-blue-500" />
                    <span>{item.precipitationProbability}%</span>
                  </>
                ) : (
                  <span className="text-transparent">0%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
