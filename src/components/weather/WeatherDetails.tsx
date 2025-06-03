'use client';

import { Card } from '@/components/ui/Card';
import { useWeatherStore } from '@/store/weatherStore';
import { Eye, Thermometer, Gauge, Compass } from 'lucide-react';

export default function WeatherDetails() {
  const { currentWeather, isLoading } = useWeatherStore();

  if (isLoading || !currentWeather) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const getWindDirection = (degree: number): string => {
    const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const getVisibilityText = (visibility: number): string => {
    if (visibility >= 10) return '매우 좋음';
    if (visibility >= 5) return '좋음';
    if (visibility >= 2) return '보통';
    if (visibility >= 1) return '나쁨';
    return '매우 나쁨';
  };

  const getPressureText = (pressure: number): string => {
    if (pressure >= 1020) return '높음';
    if (pressure >= 1010) return '보통';
    return '낮음';
  };

  const getUVText = (uvIndex: number): string => {
    if (uvIndex <= 2) return '낮음';
    if (uvIndex <= 5) return '보통';
    if (uvIndex <= 7) return '높음';
    if (uvIndex <= 10) return '매우 높음';
    return '위험';
  };

  const getUVColor = (uvIndex: number): string => {
    if (uvIndex <= 2) return 'text-green-600 bg-green-50';
    if (uvIndex <= 5) return 'text-yellow-600 bg-yellow-50';
    if (uvIndex <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAirQualityColor = (quality: string): string => {
    switch (quality) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'unhealthy':
        return 'text-orange-600 bg-orange-50';
      case 'hazardous':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAirQualityText = (quality: string): string => {
    switch (quality) {
      case 'good':
        return '좋음';
      case 'moderate':
        return '보통';
      case 'unhealthy':
        return '나쁨';
      case 'hazardous':
        return '매우 나쁨';
      default:
        return '정보 없음';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <Eye size={20} className="mr-2 text-blue-500" />
        상세 날씨 정보
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* 기압 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Gauge size={16} className="mr-2" />
            기압
          </div>
          <div className="space-y-1">
            <div className="text-xl font-semibold text-gray-800">
              {currentWeather.current.pressure} hPa
            </div>
            <div className="text-xs text-gray-500">
              {getPressureText(currentWeather.current.pressure)}
            </div>
          </div>
        </div>

        {/* 가시거리 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Eye size={16} className="mr-2" />
            가시거리
          </div>
          <div className="space-y-1">
            <div className="text-xl font-semibold text-gray-800">
              {currentWeather.current.visibility} km
            </div>
            <div className="text-xs text-gray-500">
              {getVisibilityText(currentWeather.current.visibility)}
            </div>
          </div>
        </div>

        {/* 바람 방향 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Compass size={16} className="mr-2" />
            바람 방향
          </div>
          <div className="space-y-1">
            <div className="text-xl font-semibold text-gray-800">
              {getWindDirection(currentWeather.current.windDirection)}풍
            </div>
            <div className="text-xs text-gray-500">
              {currentWeather.current.windDirection}°
            </div>
          </div>
        </div>

        {/* 체감온도 상세 */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Thermometer size={16} className="mr-2" />
            체감온도
          </div>
          <div className="space-y-1">
            <div className="text-xl font-semibold text-gray-800">
              {Math.round(currentWeather.current.feelsLike)}°C
            </div>
            <div className="text-xs text-gray-500">
              실제 {currentWeather.current.temperature}°C
            </div>
          </div>
        </div>

        {/* 자외선 지수 (전체 너비) */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-lg mr-2">☀️</span>
            자외선 지수
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-gray-800">
                {currentWeather.current.uvIndex}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getUVColor(currentWeather.current.uvIndex)}`}
              >
                {getUVText(currentWeather.current.uvIndex)}
              </div>
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full"
                style={{
                  width: `${Math.min(currentWeather.current.uvIndex * 10, 100)}%`,
                }}
              ></div>
            </div>
          </div>
          {currentWeather.current.uvIndex > 5 && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
              💡 자외선이 강합니다. 선크림과 모자 착용을 권장해요.
            </div>
          )}
        </div>

        {/* 대기질 (전체 너비) */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-lg mr-2">🌫️</span>
            대기질
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getAirQualityColor(currentWeather.airQuality.quality)}`}
                >
                  {getAirQualityText(currentWeather.airQuality.quality)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">미세먼지 (PM2.5)</span>
                <span className="font-medium">
                  {currentWeather.airQuality.pm25} μg/m³
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">초미세먼지 (PM10)</span>
                <span className="font-medium">
                  {currentWeather.airQuality.pm10} μg/m³
                </span>
              </div>
            </div>

            {currentWeather.airQuality.quality !== 'good' && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                💡 실외 활동 시 마스크 착용을 고려해보세요.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 업데이트 시간 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          마지막 업데이트:{' '}
          {new Date(currentWeather.timestamp).toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </Card>
  );
}
