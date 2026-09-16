import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
} from 'lucide-react';
import { getWeatherCondition } from '../utils/weatherUtils';

interface WeatherIconProps {
  weatherCode: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  isDay = true,
  className = 'w-6 h-6',
  size,
}) => {
  const condition = getWeatherCondition(weatherCode, isDay);

  const iconProps = {
    className,
    size,
    'aria-label': condition.label,
  };

  switch (condition.iconName) {
    case 'sun':
      return <Sun {...iconProps} className={`${className} text-amber-500`} />;
    case 'moon':
      return <Moon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'cloud-sun':
      return <CloudSun {...iconProps} className={`${className} text-amber-500`} />;
    case 'cloud-moon':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-400`} />;
    case 'cloud-fog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-sky-400`} />;
    case 'cloud-rain':
      return <CloudRain {...iconProps} className={`${className} text-blue-500`} />;
    case 'snowflake':
    case 'cloud-snow':
      return <Snowflake {...iconProps} className={`${className} text-sky-300`} />;
    case 'cloud-lightning':
      return <CloudLightning {...iconProps} className={`${className} text-amber-400`} />;
    default:
      return isDay ? (
        <Sun {...iconProps} className={`${className} text-amber-500`} />
      ) : (
        <Moon {...iconProps} className={`${className} text-indigo-300`} />
      );
  }
};
