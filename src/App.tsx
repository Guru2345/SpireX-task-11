import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Compass, ExternalLink } from 'lucide-react';
import { LocationInfo, WeatherData, Unit } from './types';
import {
  fetchWeather,
  reverseGeocode,
  DEFAULT_LOCATIONS,
  getFallbackWeatherData,
} from './services/weatherService';
import { getSafeItem, setSafeItem } from './utils/storage';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherMetrics } from './components/WeatherMetrics';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    const saved = getSafeItem('weather_saved_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore fallback
      }
    }
    return DEFAULT_LOCATIONS[0];
  });

  const [unit, setUnit] = useState<Unit>(() => {
    const saved = getSafeItem('weather_unit');
    return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  });

  // Initialize with fallback weather data so the UI renders immediately without waiting
  const [weatherData, setWeatherData] = useState<WeatherData>(() => getFallbackWeatherData());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => new Date());

  // Load weather data
  const loadWeatherData = useCallback(async (location: LocationInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(location.latitude, location.longitude);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching weather data:', err);
      // Keep existing data, show warning banner
      setError(
        err instanceof Error
          ? `${err.message} (Showing cached/estimated conditions)`
          : 'Unable to refresh live weather data. Showing cached data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when location changes
  useEffect(() => {
    loadWeatherData(currentLocation);
    setSafeItem('weather_saved_location', JSON.stringify(currentLocation));
  }, [currentLocation, loadWeatherData]);

  // Save unit
  const handleToggleUnit = (newUnit: Unit) => {
    setUnit(newUnit);
    setSafeItem('weather_unit', newUnit);
  };

  // Location select handler
  const handleSelectLocation = (loc: LocationInfo) => {
    setCurrentLocation(loc);
  };

  // Browser Geolocation
  const handleDetectLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await reverseGeocode(latitude, longitude);
          setCurrentLocation({
            name: locDetails.name || 'Current Location',
            country: locDetails.country,
            countryCode: locDetails.countryCode,
            admin1: locDetails.admin1,
            latitude,
            longitude,
          });
        } catch {
          setCurrentLocation({
            name: 'Current Location',
            latitude,
            longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setError('Location access was denied or timed out. You can still search for any city.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const deployUrl =
    typeof window !== 'undefined' && window.location.href.includes('ais-dev')
      ? 'https://ais-dev-g3f7pwn2vu6vmjtdtubd6z-550408133837.asia-southeast1.run.app'
      : 'https://ais-pre-g3f7pwn2vu6vmjtdtubd6z-550408133837.asia-southeast1.run.app';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Deployment Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium truncate">Live Weather App</span>
          </div>
          <a
            id="deploy-link-btn"
            href={deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-md font-medium text-[11px] transition-colors whitespace-nowrap"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Header bar */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => loadWeatherData(currentLocation)}
        onDetectLocation={handleDetectLocation}
        isLocating={isLocating}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Error / Warning Notification */}
        {error && (
          <div
            id="weather-error-banner"
            className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-sm animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Weather Notice</p>
              <p className="text-amber-700 text-xs mt-0.5">{error}</p>
            </div>
            <button
              id="retry-fetch-btn"
              type="button"
              onClick={() => loadWeatherData(currentLocation)}
              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Weather Dashboard */}
        <div className="space-y-6">
          {/* 1. Hero Current Weather Card */}
          <CurrentWeather
            weather={weatherData}
            location={currentLocation}
            unit={unit}
          />

          {/* 2. Key Atmospheric Metrics (Humidity, Wind, UV, Pressure) */}
          <WeatherMetrics
            weather={weatherData}
            unit={unit}
          />

          {/* 3. Hourly Forecast (24 Hours) */}
          <HourlyForecast
            items={weatherData.hourly}
            unit={unit}
          />

          {/* 4. Daily Extended Forecast (7 Days) */}
          <DailyForecast
            items={weatherData.daily}
            unit={unit}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-slate-700">Weather Dashboard</span>
            <span>— Real-time meteorology</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              id="footer-deploy-link"
              href={deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Deploy Link <ExternalLink className="w-3 h-3 inline" />
            </a>
            <span>•</span>
            <span>Powered by Open-Meteo API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
