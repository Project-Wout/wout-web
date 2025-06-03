'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useWeatherStore,
  requestLocationPermission,
} from '@/store/weatherStore';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { useFeedbackStore } from '@/store/feedbackStore'; // 추가
import WeatherCard from '@/components/weather/WeatherCard';
import WeatherScore from '@/components/weather/WeatherScore';
import OutfitRecommendation from '@/components/outfit/OutfitRecommendation';
import FeedbackModal from '@/components/feedback/FeedbackModal'; // 추가
import { Button } from '@/components/ui/Button';
import { MapPin, Settings, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const {
    location,
    currentWeather,
    personalScore,
    personalFeelsLike,
    isLoading,
    error,
    setLocation,
    refreshData,
    clearError,
  } = useWeatherStore();
  const { isCompleted } = useSensitivityStore();

  // 피드백 스토어 추가
  const { isModalOpen, closeModal, openModal } = useFeedbackStore();

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

  // 피드백 모달 열기 핸들러 추가
  const handleOpenFeedback = () => {
    if (!currentWeather || !personalScore) {
      console.warn('날씨 데이터가 없어서 피드백을 열 수 없습니다.');
      return;
    }

    // 현재 추천 데이터 구성 (기존 타입 구조에 맞게)
    const recommendationData = {
      id: `rec_${Date.now()}`,
      weatherScore: personalScore.total, // total 속성 사용
      weatherData: {
        temperature: currentWeather.current.temperature,
        feelsLike:
          personalFeelsLike?.calculated || currentWeather.current.feelsLike, // calculated 속성 사용
        humidity: currentWeather.current.humidity,
        windSpeed: currentWeather.current.windSpeed,
      },
      outfitRecommendation: {
        top: '니트', // 실제로는 현재 추천에서 가져와야 함
        bottom: '긴바지',
        outer: '바람막이',
        accessories: ['목도리'],
      },
      createdAt: new Date().toISOString(),
    };

    openModal(recommendationData);
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
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                와웃
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
          {/* 첫 번째 행: 날씨 카드와 점수 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeatherCard />
            </div>
            <div className="lg:col-span-1">
              <WeatherScore />
            </div>
          </div>

          {/* 두 번째 행: 옷차림 추천 */}
          <div>
            <OutfitRecommendation />
          </div>

          {/* 피드백 섹션 - 수정된 부분 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                오늘 추천은 어떠셨나요?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                피드백을 주시면 더 정확한 추천을 받을 수 있어요
              </p>

              {/* 기존 간단 버튼들 제거하고 피드백 모달 버튼으로 교체 */}
              <Button
                onClick={handleOpenFeedback}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-base font-semibold hover:shadow-lg transition-all duration-200"
                disabled={!currentWeather || !personalScore}
              >
                💬 피드백 하기
              </Button>

              <div className="mt-3 text-xs text-gray-500">
                클릭해서 상세한 피드백을 남겨주세요
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 피드백 모달 추가 - 기존 FeedbackModal 사용 */}
      {currentWeather && personalScore && (
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={closeModal}
          weatherData={{
            temperature: currentWeather.current.temperature,
            feelsLike:
              personalFeelsLike?.calculated || currentWeather.current.feelsLike,
            humidity: currentWeather.current.humidity,
            windSpeed: currentWeather.current.windSpeed,
          }}
          recommendedOutfit="니트 + 긴바지 + 바람막이" // 실제 추천에서 가져와야 함
        />
      )}

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
