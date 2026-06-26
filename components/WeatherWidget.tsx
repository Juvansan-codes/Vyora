'use client';

import { useState, useEffect } from 'react';

// Full WMO Weather interpretation codes (https://open-meteo.com/en/docs)
function getWeatherInfo(code: number): { description: string; icon: string } {
  switch (true) {
    case code === 0:
      return { description: 'Clear sky', icon: 'clear_day' };
    case code === 1:
      return { description: 'Mainly clear', icon: 'partly_cloudy_day' };
    case code === 2:
      return { description: 'Partly cloudy', icon: 'partly_cloudy_day' };
    case code === 3:
      return { description: 'Overcast', icon: 'cloud' };
    case code === 45 || code === 48:
      return { description: 'Fog', icon: 'foggy' };
    case code === 51 || code === 53 || code === 55:
      return { description: 'Drizzle', icon: 'rainy_light' };
    case code === 56 || code === 57:
      return { description: 'Freezing Drizzle', icon: 'weather_mix' };
    case code === 61 || code === 63 || code === 65:
      return { description: 'Rain', icon: 'rainy' };
    case code === 66 || code === 67:
      return { description: 'Freezing Rain', icon: 'weather_mix' };
    case code === 71 || code === 73 || code === 75:
      return { description: 'Snow fall', icon: 'snowing' };
    case code === 77:
      return { description: 'Snow grains', icon: 'snowing' };
    case code === 80 || code === 81 || code === 82:
      return { description: 'Rain showers', icon: 'rainy' };
    case code === 85 || code === 86:
      return { description: 'Snow showers', icon: 'snowing' };
    case code === 95:
      return { description: 'Thunderstorm', icon: 'thunderstorm' };
    case code === 96 || code === 99:
      return { description: 'Thunderstorm with hail', icon: 'thunderstorm' };
    default:
      return { description: 'Unknown', icon: 'cloud' };
  }
}

interface WeatherWidgetProps {
  destination: string;
}

interface WeatherData {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  current_weather: {
    temperature: number;
    weathercode: number;
  };
  city: string;
}

export default function WeatherWidget({ destination }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      if (!destination) {
        setFailed(true);
        setLoading(false);
        return;
      }

      // 1. Normalize destination string (remove brackets, dates, etc)
      // E.g. "Paris, France (Days 1-5)" -> "Paris, France"
      const normalizedDest = destination.replace(/\(.*?\)/g, '').split('-')[0].trim();
      
      if (!normalizedDest) {
        setFailed(true);
        setLoading(false);
        return;
      }

      // 2. Check SessionStorage Cache
      const cacheKey = `weather_${normalizedDest}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Simple expiration check (1 hour)
          if (Date.now() - parsed.timestamp < 3600000) {
            setWeatherData(parsed.data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore cache parse error
        }
      }

      try {
        // 3. Geocoding
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedDest)}&count=1&language=en&format=json`);
        if (!geoRes.ok) throw new Error('Geocoding failed');
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('Location not found');
        }

        const location = geoData.results[0];
        
        // 4. Forecast Fetch (7 days)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        if (!weatherRes.ok) throw new Error('Weather fetch failed');
        const data = await weatherRes.json();

        const finalData: WeatherData = {
          current_weather: data.current_weather,
          daily: data.daily,
          city: location.name
        };

        // Cache the result
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: finalData,
          timestamp: Date.now()
        }));

        setWeatherData(finalData);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [destination]);

  // Fallback: fail silently
  if (failed) return null;

  // Skeleton Loader
  if (loading || !weatherData) {
    return (
      <div className="w-full bg-white border border-surface-container rounded-2xl p-5 shadow-sm mb-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-surface-container rounded-md w-1/4"></div>
          <div className="h-8 bg-surface-container rounded-md w-1/6"></div>
        </div>
        <div className="flex gap-3 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex-1 min-w-[70px] h-24 bg-surface-container-low rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentInfo = getWeatherInfo(weatherData.current_weather.weathercode);

  return (
    <div className="w-full bg-white border border-surface-container rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-body-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">routine</span>
            7-Day Forecast for {weatherData.city}
          </h3>
          <p className="text-body-sm text-secondary mt-1">{currentInfo.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary">{currentInfo.icon}</span>
          <span className="text-headline-lg font-bold text-on-surface">{Math.round(weatherData.current_weather.temperature)}°</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {weatherData.daily.time.map((time, idx) => {
          const info = getWeatherInfo(weatherData.daily.weathercode[idx]);
          const date = new Date(time);
          const isToday = idx === 0;
          
          return (
            <div key={time} className={`flex flex-col items-center flex-shrink-0 min-w-[76px] p-3 rounded-xl border ${isToday ? 'bg-primary-container/10 border-primary/20' : 'bg-surface-container-lowest border-surface-container-low'}`}>
              <p className="text-label-sm font-semibold text-secondary uppercase tracking-wider mb-2">
                {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <span className="material-symbols-outlined text-2xl text-on-surface mb-2">{info.icon}</span>
              <div className="flex items-center gap-1.5 font-mono text-body-sm">
                <span className="font-bold text-on-surface">{Math.round(weatherData.daily.temperature_2m_max[idx])}°</span>
                <span className="text-secondary/60">{Math.round(weatherData.daily.temperature_2m_min[idx])}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
