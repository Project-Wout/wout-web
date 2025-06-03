import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  MemberCreateRequest,
  MemberWithPreferenceResponse,
  WeatherPreferenceSetupRequest,
  WeatherPreferenceResponse,
  WeatherPreferenceUpdateRequest,
  NicknameUpdateRequest,
  MemberResponse,
  LocationUpdateRequest,
  SetupStatusResponse,
} from '@/types/member';

export const memberApi = {
  // 앱 초기화 (회원 확인/생성)
  async initializeMember(
    deviceId: string,
    options?: {
      nickname?: string;
      latitude?: number;
      longitude?: number;
      cityName?: string;
    },
  ): Promise<ApiResponse<MemberWithPreferenceResponse>> {
    const request: MemberCreateRequest = {
      deviceId,
      ...options,
    };

    return apiClient.post<ApiResponse<MemberWithPreferenceResponse>>(
      '/api/members/init',
      request,
    );
  },

  // 5단계 날씨 선호도 설정
  async setupWeatherPreference(
    deviceId: string,
    request: WeatherPreferenceSetupRequest,
  ): Promise<ApiResponse<WeatherPreferenceResponse>> {
    return apiClient.post<ApiResponse<WeatherPreferenceResponse>>(
      `/api/members/${deviceId}/weather-preference`,
      request,
    );
  },

  // 날씨 선호도 수정
  async updateWeatherPreference(
    deviceId: string,
    request: WeatherPreferenceUpdateRequest,
  ): Promise<ApiResponse<WeatherPreferenceResponse>> {
    return apiClient.put<ApiResponse<WeatherPreferenceResponse>>(
      `/api/members/${deviceId}/weather-preference`,
      request,
    );
  },

  // 닉네임 수정
  async updateNickname(
    deviceId: string,
    nickname: string,
  ): Promise<ApiResponse<MemberResponse>> {
    const request: NicknameUpdateRequest = { nickname };

    return apiClient.patch<ApiResponse<MemberResponse>>(
      `/api/members/${deviceId}/nickname`,
      request,
    );
  },

  // 위치 정보 수정
  async updateLocation(
    deviceId: string,
    request: LocationUpdateRequest,
  ): Promise<ApiResponse<MemberResponse>> {
    return apiClient.patch<ApiResponse<MemberResponse>>(
      `/api/members/${deviceId}/location`,
      request,
    );
  },

  // 설정 완료 여부 확인
  async checkSetupStatus(
    deviceId: string,
  ): Promise<ApiResponse<SetupStatusResponse>> {
    return apiClient.get<ApiResponse<SetupStatusResponse>>(
      `/api/members/${deviceId}/weather-preference/status`,
    );
  },

  // 회원 탈퇴 (비활성화)
  async deactivateMember(
    deviceId: string,
  ): Promise<ApiResponse<MemberResponse>> {
    return apiClient.delete<ApiResponse<MemberResponse>>(
      `/api/members/${deviceId}`,
    );
  },
};
