'use client';

import { Card } from '@/components/ui/Card';
import { useWeatherStore } from '@/store/weatherStore';
import { getWeatherIcon, formatTemperature } from '@/lib/weather-utils';
import { MapPin, RefreshCw } from 'lucide-react';

export default function WeatherCard() {
  const { currentWeather, personalFeelsLike, isLoading, error, refreshData } =
    useWeatherStore();

  const handleRefresh = () => {
    refreshData();
  };

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            날씨 정보를 불러올 수 없습니다
          </p>
          <p className="text-sm opacity-90 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </Card>
    );
  }

  if (isLoading || !currentWeather) {
    return (
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full"></div>
          </div>
          <div className="text-center space-y-2">
            <div className="h-8 bg-white/20 rounded w-32 mx-auto"></div>
            <div className="h-4 bg-white/20 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </Card>
    );
  }

  const weatherIcon = getWeatherIcon(currentWeather.current.condition);
  const displayFeelsLike =
    personalFeelsLike?.calculated || currentWeather.current.feelsLike;

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

      {/* 새로고침 버튼 */}
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
      >
        <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
      </button>

      <div className="relative z-10">
        {/* 위치 정보 */}
        <div className="flex items-center justify-center mb-6">
          <MapPin size={18} className="mr-2 opacity-90" />
          <span className="text-lg font-medium opacity-90">
            {currentWeather.location.name}
          </span>
        </div>

        {/* 메인 날씨 정보 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{weatherIcon}</div>
          <div className="text-5xl font-light mb-2">
            {formatTemperature(currentWeather.current.temperature)}
          </div>
          <div className="text-lg opacity-90 mb-1">
            {currentWeather.current.description}
          </div>
          <div className="text-sm opacity-75">
            나의 체감온도 {formatTemperature(displayFeelsLike)}
            {personalFeelsLike &&
              typeof personalFeelsLike.adjustment === 'number' &&
              Math.abs(personalFeelsLike.adjustment) > 0.5 && (
                <span className="ml-1 text-xs">
                  ({personalFeelsLike.adjustment > 0 ? '+' : ''}
                  {personalFeelsLike.adjustment.toFixed(1)}°)
                </span>
              )}
          </div>
        </div>

        {/* 상세 날씨 정보 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">💧</div>
            <div className="text-sm opacity-75">습도</div>
            <div className="text-lg font-semibold">
              {currentWeather.current.humidity}%
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">💨</div>
            <div className="text-sm opacity-75">풍속</div>
            <div className="text-lg font-semibold">
              {currentWeather.current.windSpeed}m/s
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">🌫️</div>
            <div className="text-sm opacity-75">공기질</div>
            <div className="text-lg font-semibold">
              {currentWeather.airQuality.quality === 'good' && '좋음'}
              {currentWeather.airQuality.quality === 'moderate' && '보통'}
              {currentWeather.airQuality.quality === 'unhealthy' && '나쁨'}
              {currentWeather.airQuality.quality === 'hazardous' && '매우나쁨'}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">☀️</div>
            <div className="text-sm opacity-75">자외선</div>
            <div className="text-lg font-semibold">
              {currentWeather.current.uvIndex <= 2 && '낮음'}
              {currentWeather.current.uvIndex <= 5 &&
                currentWeather.current.uvIndex > 2 &&
                '보통'}
              {currentWeather.current.uvIndex <= 7 &&
                currentWeather.current.uvIndex > 5 &&
                '높음'}
              {currentWeather.current.uvIndex > 7 && '매우높음'}
            </div>
          </div>
        </div>

        {/* 개인화 정보 표시 */}
        {personalFeelsLike?.reason &&
          personalFeelsLike.reason !== '표준 계산' && (
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="text-xs opacity-75 mb-1">개인 맞춤 보정</div>
              <div className="text-sm">{personalFeelsLike.reason}</div>
            </div>
          )}
      </div>
    </Card>
  );
}
