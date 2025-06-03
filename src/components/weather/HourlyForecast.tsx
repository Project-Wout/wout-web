'use client';

import { Card } from '@/components/ui/Card';
import { useWeatherStore } from '@/store/weatherStore';
import {
  getWeatherIcon,
  formatTime,
  formatTemperature,
} from '@/lib/weather-utils';
import { Clock } from 'lucide-react';

export default function HourlyForecast() {
  const { hourlyForecast, isLoading } = useWeatherStore();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="flex space-x-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-20 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded-full w-8 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-10 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!hourlyForecast || hourlyForecast.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-gray-500">
          <Clock size={24} className="mx-auto mb-2" />
          <p className="text-sm">시간별 예보 정보를 불러올 수 없습니다</p>
        </div>
      </Card>
    );
  }

  const getPrecipitationColor = (chance: number): string => {
    if (chance >= 70) return 'text-blue-600';
    if (chance >= 30) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getPrecipitationText = (chance: number): string => {
    if (chance >= 70) return '높음';
    if (chance >= 30) return '보통';
    if (chance > 0) return '낮음';
    return '';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Clock size={20} className="mr-2 text-blue-500" />
        시간별 날씨
      </h3>

      <div className="overflow-x-auto">
        <div
          className="flex space-x-4 pb-2"
          style={{ minWidth: 'max-content' }}
        >
          {hourlyForecast.map((hour, index) => {
            const isNow = index === 0;
            const weatherIcon = getWeatherIcon(hour.condition);

            return (
              <div
                key={hour.time}
                className={`flex-shrink-0 text-center p-3 rounded-xl transition-all ${
                  isNow
                    ? 'bg-blue-500 text-white scale-105 shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                style={{ minWidth: '80px' }}
              >
                {/* 시간 */}
                <div
                  className={`text-sm font-medium mb-2 ${isNow ? 'text-white' : 'text-gray-600'}`}
                >
                  {isNow ? '지금' : formatTime(hour.time)}
                </div>

                {/* 날씨 아이콘 */}
                <div className="text-2xl mb-2">{weatherIcon}</div>

                {/* 온도 */}
                <div
                  className={`text-lg font-bold mb-1 ${isNow ? 'text-white' : 'text-gray-800'}`}
                >
                  {formatTemperature(hour.temperature)}
                </div>

                {/* 체감온도 */}
                <div
                  className={`text-xs mb-2 ${isNow ? 'text-blue-100' : 'text-gray-500'}`}
                >
                  체감 {formatTemperature(hour.feelsLike)}
                </div>

                {/* 습도 */}
                <div className="flex items-center justify-center mb-1">
                  <span className="text-xs mr-1">💧</span>
                  <span
                    className={`text-xs ${isNow ? 'text-blue-100' : 'text-gray-500'}`}
                  >
                    {hour.humidity}%
                  </span>
                </div>

                {/* 바람 */}
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xs mr-1">💨</span>
                  <span
                    className={`text-xs ${isNow ? 'text-blue-100' : 'text-gray-500'}`}
                  >
                    {hour.windSpeed}m/s
                  </span>
                </div>

                {/* 강수 확률 */}
                {hour.precipitationChance > 0 && (
                  <div className="flex items-center justify-center">
                    <span className="text-xs mr-1">☔</span>
                    <span
                      className={`text-xs font-medium ${
                        isNow
                          ? 'text-blue-100'
                          : getPrecipitationColor(hour.precipitationChance)
                      }`}
                    >
                      {hour.precipitationChance}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="mr-1">💧</span>
            <span>습도</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">💨</span>
            <span>풍속</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">☔</span>
            <span>강수확률</span>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      {hourlyForecast.some(hour => hour.precipitationChance >= 70) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">☔</span>
            <div>
              <div className="text-sm font-medium text-blue-800">비 예보</div>
              <div className="text-xs text-blue-600">
                우산을 챙기는 것을 잊지 마세요!
              </div>
            </div>
          </div>
        </div>
      )}

      {hourlyForecast.some(hour => hour.windSpeed >= 7) && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-lg mr-2">💨</span>
            <div>
              <div className="text-sm font-medium text-orange-800">
                강풍 주의
              </div>
              <div className="text-xs text-orange-600">
                외투를 단단히 챙기세요!
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
