import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type { WeatherScoreResponse } from '@/types/weather';

export const weatherApi = {
  // 위치 기반 날씨 점수 조회
  async getWeatherScoreByLocation(
    deviceId: string,
    lat: number,
    lon: number,
  ): Promise<ApiResponse<WeatherScoreResponse>> {
    return apiClient.get<ApiResponse<WeatherScoreResponse>>(
      '/api/weather-score/location',
      {
        deviceId,
        latitude: lat,
        longitude: lon,
      },
    );
  },

  // 도시 기반 날씨 점수 조회
  async getWeatherScoreByCity(
    deviceId: string,
    city: string,
  ): Promise<ApiResponse<WeatherScoreResponse>> {
    return apiClient.get<ApiResponse<WeatherScoreResponse>>(
      '/api/weather-score/city',
      {
        deviceId,
        cityName: city,
      },
    );
  },

  // 현재 날씨 조회 (아직 백엔드에 없음)
  async getCurrentWeather(lat: number, lon: number) {
    return apiClient.get(`/api/weather/current`, {
      lat,
      lon,
    });
  },
};
