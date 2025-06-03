import { create } from 'zustand';
import { SensitivityData } from '@/types/sensitivity';
import {
  WeatherData,
  WeatherState,
  HourlyWeather,
  LocationInfo,
  WeatherScore,
  PersonalFeelsLike,
  WeatherScoreResponse,
} from '@/types/weather';
import {
  calculatePersonalFeelsLike,
  calculateWeatherScore,
} from '@/lib/weather-utils';
import { useSensitivityStore } from './sensitivityStore';
import { weatherApi } from '@/lib/api/weather';
import { deviceUtils } from '@/lib/device-utils';

export const useWeatherStore = create<WeatherState>((set, get) => ({
  // 상태
  currentWeather: null,
  hourlyForecast: [],
  location: null,
  personalScore: null,
  personalFeelsLike: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // 위치 설정
  setLocation: (location: LocationInfo) => {
    set({ location });

    // 위치가 설정되면 자동으로 날씨 데이터 fetch
    if (location.permission === 'granted') {
      get().fetchWeatherData(location.lat, location.lon);
    }
  },

  // 🔥 실제 백엔드 API 호출로 변경
  fetchWeatherData: async (lat: number, lon: number) => {
    set({ isLoading: true, error: null });

    try {
      const deviceId = deviceUtils.getDeviceId();
      console.log('API 호출 시작:', { deviceId, lat, lon });

      // 실제 백엔드 API 호출
      const response = await weatherApi.getWeatherScoreByLocation(
        deviceId,
        lat,
        lon,
      );
      console.log('백엔드 응답:', response);

      if (!response.success) {
        throw new Error(response.message || 'API 호출 실패');
      }

      const backendData = response.data;

      // 백엔드 데이터를 기존 WeatherData 타입으로 변환
      const weatherData: WeatherData = {
        id: '1',
        location: {
          name: backendData.location.cityName,
          lat: backendData.location.latitude,
          lon: backendData.location.longitude,
        },
        current: {
          temperature: backendData.weatherInfo.temperature,
          feelsLike: backendData.weatherInfo.feelsLikeTemperature,
          humidity: backendData.weatherInfo.humidity,
          windSpeed: backendData.weatherInfo.windSpeed,
          windDirection: 0, // 백엔드에서 제공되지 않음
          pressure: 1013, // 백엔드에서 제공되지 않음
          visibility: 10, // 백엔드에서 제공되지 않음
          uvIndex: backendData.weatherInfo.uvIndex,
          condition: 'clear', // 기본값 (나중에 온도 기반으로 계산 가능)
          description: backendData.message,
        },
        airQuality: {
          pm25: backendData.weatherInfo.pm25,
          pm10: backendData.weatherInfo.pm10,
          quality: getAirQualityGrade(backendData.weatherInfo.pm25),
        },
        timestamp: new Date().toISOString(),
      };

      // 백엔드에서 받은 개인화 점수
      const personalScore: WeatherScore = {
        total: backendData.totalScore,
        emoji: getGradeEmoji(backendData.grade),
        grade: convertGradeToLowercase(backendData.grade),
        message: backendData.message,
        breakdown: {
          temperature: backendData.elementScores.temperature,
          humidity: backendData.elementScores.humidity,
          windSpeed: backendData.elementScores.wind,
          airQuality: backendData.elementScores.airQuality,
          uvIndex: backendData.elementScores.uv,
        },
      };

      // 개인별 체감온도
      const personalFeelsLike: PersonalFeelsLike = {
        calculated: backendData.weatherInfo.feelsLikeTemperature,
        adjustment:
          backendData.weatherInfo.feelsLikeTemperature -
          backendData.weatherInfo.temperature,
        reason: '개인 민감도 반영',
      };

      // 시간별 예보는 목업 유지 (백엔드에 아직 없음)
      const mockHourlyForecast: HourlyWeather[] = [
        {
          time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          temperature: weatherData.current.temperature + 2,
          feelsLike: weatherData.current.feelsLike + 2,
          humidity: Math.max(0, weatherData.current.humidity - 5),
          windSpeed: weatherData.current.windSpeed,
          condition: 'clear',
          precipitationChance: 0,
        },
        {
          time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          temperature: weatherData.current.temperature + 3,
          feelsLike: weatherData.current.feelsLike + 3,
          humidity: Math.max(0, weatherData.current.humidity - 8),
          windSpeed: Math.max(0, weatherData.current.windSpeed - 0.5),
          condition: 'clear',
          precipitationChance: 0,
        },
        {
          time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          temperature: weatherData.current.temperature + 4,
          feelsLike: weatherData.current.feelsLike + 4,
          humidity: Math.max(0, weatherData.current.humidity - 10),
          windSpeed: Math.max(0, weatherData.current.windSpeed - 0.8),
          condition: 'cloudy',
          precipitationChance: 10,
        },
        {
          time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          temperature: weatherData.current.temperature + 5,
          feelsLike: weatherData.current.feelsLike + 5,
          humidity: Math.max(0, weatherData.current.humidity - 12),
          windSpeed: Math.max(0, weatherData.current.windSpeed - 1.0),
          condition: 'cloudy',
          precipitationChance: 15,
        },
        {
          time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          temperature: weatherData.current.temperature + 1,
          feelsLike: weatherData.current.feelsLike + 1,
          humidity: Math.min(100, weatherData.current.humidity + 5),
          windSpeed: weatherData.current.windSpeed + 0.5,
          condition: 'rainy',
          precipitationChance: 70,
        },
      ];

      set({
        currentWeather: weatherData,
        personalScore,
        personalFeelsLike,
        hourlyForecast: mockHourlyForecast,
        lastUpdated: new Date().toISOString(),
        isLoading: false,
      });

      console.log('날씨 데이터 로드 완료:', {
        weather: weatherData,
        score: personalScore,
        feelsLike: personalFeelsLike,
      });
    } catch (error) {
      console.error('날씨 API 호출 실패:', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : '날씨 데이터를 가져오는데 실패했습니다',
        isLoading: false,
      });
    }
  },

  // 개인화 점수 계산 (백엔드에서 이미 계산되므로 사용하지 않음)
  calculatePersonalScore: () => {
    console.log('개인화 점수는 이미 백엔드에서 계산되었습니다.');
  },

  // 데이터 새로고침
  refreshData: async () => {
    const { location } = get();
    if (location && location.permission === 'granted') {
      await get().fetchWeatherData(location.lat, location.lon);
    }
  },

  // 에러 클리어
  clearError: () => {
    set({ error: null });
  },
}));

// 🆕 헬퍼 함수들 추가
function getGradeEmoji(grade: string): string {
  const emojiMap: Record<string, string> = {
    EXCELLENT: '😊',
    GOOD: '🙂',
    FAIR: '😐',
    POOR: '😰',
    TERRIBLE: '😵',
  };
  return emojiMap[grade] || '😐';
}

function convertGradeToLowercase(
  grade: string,
): 'excellent' | 'good' | 'fair' | 'poor' | 'terrible' {
  const gradeMap: Record<
    string,
    'excellent' | 'good' | 'fair' | 'poor' | 'terrible'
  > = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    FAIR: 'fair',
    POOR: 'poor',
    TERRIBLE: 'terrible',
  };
  return gradeMap[grade] || 'fair';
}

function getAirQualityGrade(
  pm25: number,
): 'good' | 'moderate' | 'unhealthy' | 'hazardous' {
  if (pm25 <= 15) return 'good';
  if (pm25 <= 35) return 'moderate';
  if (pm25 <= 75) return 'unhealthy';
  return 'hazardous';
}

// 위치 권한 요청 헬퍼 함수 (기존과 동일)
export const requestLocationPermission = async (): Promise<LocationInfo> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 서비스가 지원되지 않습니다'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const location: LocationInfo = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          permission: 'granted',
        };
        resolve(location);
      },
      error => {
        const location: LocationInfo = {
          lat: 35.1796, // 부산 기본 좌표
          lon: 129.0756,
          name: '부산 (기본 위치)',
          permission: 'denied',
        };
        resolve(location); // 에러 대신 기본 위치 반환
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      },
    );
  });
};

// 날씨 데이터 자동 새로고침 (15분마다)
export const startWeatherRefreshInterval = () => {
  return setInterval(
    () => {
      const store = useWeatherStore.getState();
      if (store.location && !store.isLoading) {
        store.refreshData();
      }
    },
    15 * 60 * 1000,
  ); // 15분
};
