# Weather Dashboard

A modern, responsive real-time weather web application that fetches live weather data via an open API and displays it in a clean, intuitive dashboard.

---

## 🌐 Live Deployment Links

- **Shared / Preview URL**: [https://ais-pre-g3f7pwn2vu6vmjtdtubd6z-550408133837.asia-southeast1.run.app](https://ais-pre-g3f7pwn2vu6vmjtdtubd6z-550408133837.asia-southeast1.run.app)
- **Development App URL**: [https://ais-dev-g3f7pwn2vu6vmjtdtubd6z-550408133837.asia-southeast1.run.app](https://ais-dev-g3f7pwn2vu6vmjtdtubd6z-550408133837.asia-southeast1.run.app)

---

## ✨ Features

- **Real-Time Weather Data**: Live temperature, apparent ("feels like") temperature, relative humidity, atmospheric pressure, wind speed, wind direction, and UV index.
- **WMO Condition Mapping**: Accurate weather condition descriptions (Sunny, Clear, Partly Cloudy, Rain Showers, Drizzle, Thunderstorm, Snow, Fog) paired with weather icons.
- **24-Hour Hourly Forecast**: Scrollable timeline showing hour-by-hour temperature progression and precipitation probability percentages.
- **7-Day Extended Forecast**: Daily high and low temperatures with color gradient range bars and precipitation chance indicators.
- **Global Search & Autocomplete**: Search for any city or town worldwide using debounced geocoding search with region and country tags.
- **One-Click Geolocation**: Detect current location using browser GPS.
- **Quick City Shortcuts**: Instantly switch between popular metropolitan locations (New York, London, Tokyo, Paris, Sydney, Mumbai).
- **Unit Conversion**: Toggle between Celsius (°C) and Fahrenheit (°F) with persistent preferences.
- **Resilient Offline Fallback**: Guarantees instant UI rendering with fallback state if network latency or strict sandboxed browser settings are encountered.

---

## 🛠️ Technology Stack

- **HTML5 & CSS3**: Semantic layouts styled with **Tailwind CSS v4**
- **JavaScript & TypeScript**: Type-safe frontend logic with TypeScript 5.8
- **UI Framework**: React 19 with functional components and modern React hooks
- **Icons**: Lucide React (`lucide-react`)
- **Weather API**: [Open-Meteo Weather Forecast API](https://open-meteo.com) & [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (No API keys required, open access)
- **Build Tool**: Vite 6

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone or extract repository:
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📡 API Details

- **Forecast API**: `https://api.open-meteo.com/v1/forecast`
  - Parameters: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `precipitation`, `weather_code`, `surface_pressure`, `wind_speed_10m`, `wind_direction_10m`, `hourly`, `daily`
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`
  - Supports searching worldwide cities by name.
