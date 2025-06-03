// src/app/(main)/weather/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useWeatherStore,
  requestLocationPermission,
} from '@/store/weatherStore';
import { useSensitivityStore } from '@/store/sensitivityStore';
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherDetails from '@/components/weather/WeatherDetails';
import HourlyForecast from '@/components/weather/HourlyForecast';
import { Button } from '@/components/ui/Button';
import { MapPin, Settings, RefreshCw, ArrowLeft } from 'lucide-react';

export default function WeatherPage() {
  const router = useRouter();
  const {
    location,
    currentWeather,
    isLoading,
    error,
    setLocation,
    refreshData,
    clearError,
  } = useWeatherStore();
  const { isCompleted } = useSensitivityStore();

  // 초기 위치 권한 요청 및 데이터 로드
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (!location) {
          const locationInfo = await requestLocationPermission();
          setLocation(locationInfo);
        }
      } catch (error) {
        console.error('위치 초기화 실패:', error);
        // 기본 위치 설정 (부산)
        setLocation({
          lat: 35.1796,
          lon: 129.0756,
          name: '부산 (기본 위치)',
          permission: 'denied',
        });
      }
    };

    initializeApp();
  }, [location, setLocation]);

  // 민감도 설정이 완료되지 않았으면 설정 페이지로 이동
  useEffect(() => {
    if (!isCompleted) {
      router.push('/sensitivity-setup');
    }
  }, [isCompleted, router]);

  const handleLocationRequest = async () => {
    try {
      clearError();
      const locationInfo = await requestLocationPermission();
      setLocation(locationInfo);
    } catch (error) {
      console.error('위치 권한 요청 실패:', error);
    }
  };

  const handleRefresh = () => {
    refreshData();
  };

  const handleSettings = () => {
    router.push('/sensitivity-setup');
  };

  const handleBack = () => {
    router.back();
  };

  // 로딩 중일 때 표시할 화면
  if (isLoading && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🌤️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                날씨 정보를 불러오는 중...
              </h2>
              <p className="text-gray-600">잠시만 기다려주세요</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={16} />
              </Button>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                상세 날씨
              </div>
              {location && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{location.name || '현재 위치'}</span>
                  {location.permission === 'denied' && (
                    <span className="text-xs text-orange-600">(기본)</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 새로고침 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-800"
              >
                <RefreshCw
                  size={16}
                  className={isLoading ? 'animate-spin' : ''}
                />
              </Button>

              {/* 위치 권한 요청 버튼 */}
              {location?.permission === 'denied' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLocationRequest}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <MapPin size={16} className="mr-1" />
                  위치 허용
                </Button>
              )}

              {/* 설정 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettings}
                className="text-gray-600 hover:text-gray-800"
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 첫 번째 행: 상세 날씨 정보 */}
          <div>
            <WeatherDetails />
          </div>

          {/* 두 번째 행: 시간별 예보 */}
          <div>
            <HourlyForecast />
          </div>

          {/* 추가 날씨 정보 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 일주일 예보 (향후 추가 예정) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📅</span>
                일주일 예보
              </h3>
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🔜</div>
                <p className="text-sm">일주일 예보 기능 준비 중입니다</p>
              </div>
            </div>

            {/* 날씨 지도 (향후 추가 예정) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🗺️</span>
                날씨 지도
              </h3>
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">🔜</div>
                <p className="text-sm">날씨 지도 기능 준비 중입니다</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 에러 메시지 */}
      {error && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
