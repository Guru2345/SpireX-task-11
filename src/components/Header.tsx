import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, RefreshCw, X, Compass, Loader2 } from 'lucide-react';
import { LocationInfo, Unit } from '../types';
import { searchLocations, DEFAULT_LOCATIONS } from '../services/weatherService';

interface HeaderProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  unit: Unit;
  onToggleUnit: (unit: Unit) => void;
  onRefresh: () => void;
  onDetectLocation: () => void;
  isLocating: boolean;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  unit,
  onToggleUnit,
  onRefresh,
  onDetectLocation,
  isLocating,
  isLoading,
  lastUpdated,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationInfo) => {
    onSelectLocation(loc);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-shadow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Live status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Weather
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                  : 'Live Forecast'}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls: Units and Refresh */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              id="mobile-unit-c-btn"
              type="button"
              onClick={() => onToggleUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
            <button
              id="mobile-refresh-btn"
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
              aria-label="Refresh weather data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar & Auto-suggestions */}
        <div className="flex-1 max-w-lg relative" ref={searchContainerRef}>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              id="search-city-input"
              type="text"
              placeholder="Search city, town, or region..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
                className="absolute right-10 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id="detect-location-btn"
              type="button"
              onClick={onDetectLocation}
              disabled={isLocating}
              title="Use current location"
              aria-label="Use current location"
              className="absolute right-2 p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-blue-600' : ''}`} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div
              id="search-suggestions-dropdown"
              className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {suggestions.map((item) => (
                <button
                  key={`${item.id}-${item.latitude}-${item.longitude}`}
                  type="button"
                  id={`suggestion-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between text-sm transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-xs text-slate-500">
                      {[item.admin1, item.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  {item.countryCode && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.countryCode}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Unit Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              id="toggle-unit-c-btn"
              type="button"
              onClick={() => onToggleUnit('celsius')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'celsius'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              id="toggle-unit-f-btn"
              type="button"
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'fahrenheit'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Data Button */}
          <button
            id="desktop-refresh-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs disabled:opacity-50"
            title="Fetch latest weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick City Navigation Chips */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-2.5 pt-0 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Quick:</span>
        {DEFAULT_LOCATIONS.map((loc) => {
          const isSelected =
            Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
            Math.abs(loc.longitude - currentLocation.longitude) < 0.05;

          return (
            <button
              key={loc.name}
              id={`quick-city-${loc.name.toLowerCase()}`}
              type="button"
              onClick={() => onSelectLocation(loc)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {loc.name}
            </button>
          );
        })}
      </div>
    </header>
  );
};
