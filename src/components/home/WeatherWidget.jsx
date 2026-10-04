import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Cloud,
  CloudRain,
  Droplets,
  Wind,
  MapPin,
  AlertTriangle
} from "lucide-react";

export default function WeatherWidget({ weather, userLocation }) {
  const getWeatherIcon = (condition) => {
    if (!condition) return Sun;
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) return CloudRain;
    if (cond.includes('cloud')) return Cloud;
    return Sun;
  };

  if (!weather) {
    return (
      <Card className="bg-gradient-to-r from-blue-500 to-sky-400 text-white border-none shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p>Weather data loading...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.current_weather?.condition);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-sky-400 text-white border-none shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-4 translate-y-4"></div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <CardTitle className="text-lg font-semibold">
              {weather.location?.city || userLocation?.address || "Current Location"}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
            Live Weather
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Weather */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <WeatherIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-bold">
                {weather.current_weather?.temperature_celsius || 25}°C
              </div>
              <div className="text-blue-100 capitalize">
                {weather.current_weather?.condition || "Partly Cloudy"}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-200" />
              <div>
                <div className="text-sm text-blue-200">Humidity</div>
                <div className="font-semibold">
                  {weather.current_weather?.humidity_percent || 65}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-blue-200" />
              <div>
                <div className="text-sm text-blue-200">Wind</div>
                <div className="font-semibold">
                  {weather.current_weather?.wind_speed_kmh || 12} km/h
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weather.alerts && weather.alerts.length > 0 && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-300/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-200" />
              <span className="font-semibold text-red-100">Weather Alert</span>
            </div>
            <p className="text-sm text-red-200">
              {weather.alerts[0].message || "Heavy rain expected in the next 24 hours"}
            </p>
          </div>
        )}

        {/* 7-Day Forecast Preview */}
        {weather.forecast_7_days && weather.forecast_7_days.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-blue-200 mb-2">3-Day Forecast</div>
            <div className="flex gap-3 overflow-x-auto">
              {weather.forecast_7_days.slice(0, 3).map((day, index) => (
                <div key={index} className="flex-shrink-0 text-center">
                  <div className="text-xs text-blue-200">
                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                  <div className="w-8 h-8 mx-auto my-1 bg-white/20 rounded-full flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold">{day.high_temp}°</div>
                  <div className="text-xs text-blue-200">{day.low_temp}°</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}