import { apiClient } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  MemberCreateRequest,
  MemberStatusResponse,
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
  // 🆕 회원 상태 확인 (스플래시용)
  async checkMemberStatus(
    deviceId: string,
  ): Promise<ApiResponse<MemberStatusResponse>> {
    return apiClient.get<ApiResponse<MemberStatusResponse>>(
      `/api/login/status/${deviceId}`,
    );
  },

  // 🆕 민감도 설정과 동시에 회원 생성 (신규 사용자용)
  async setupWithPreference(
    deviceId: string,
    request: WeatherPreferenceSetupRequest,
  ): Promise<ApiResponse<WeatherPreferenceResponse>> {
    return apiClient.post<ApiResponse<WeatherPreferenceResponse>>(
      `/api/login/${deviceId}/setup-with-preference`,
      request,
    );
  },

  // 🆕 회원 정보 조회 (기본 정보만)
  async getMemberInfo(deviceId: string): Promise<ApiResponse<MemberResponse>> {
    return apiClient.get<ApiResponse<MemberResponse>>(
      `/api/my/${deviceId}/info`,
    );
  },

  // 🆕 기존 회원 정보 + 선호도 조회 (대시보드용)
  async getMemberWithPreference(
    deviceId: string,
  ): Promise<ApiResponse<MemberWithPreferenceResponse>> {
    return apiClient.get<ApiResponse<MemberWithPreferenceResponse>>(
      `/api/dashboard/${deviceId}`,
    );
  },

  // 날씨 선호도 수정 (기존 회원용)
  async updateWeatherPreference(
    deviceId: string,
    request: WeatherPreferenceUpdateRequest,
  ): Promise<ApiResponse<WeatherPreferenceResponse>> {
    return apiClient.put<ApiResponse<WeatherPreferenceResponse>>(
      `/api/my/${deviceId}/weather-preference`,
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
      `/api/my/${deviceId}/nickname`,
      request,
    );
  },

  // 위치 정보 수정
  async updateLocation(
    deviceId: string,
    request: LocationUpdateRequest,
  ): Promise<ApiResponse<MemberResponse>> {
    return apiClient.patch<ApiResponse<MemberResponse>>(
      `/api/my/${deviceId}/location`,
      request,
    );
  },

  // 설정 완료 여부 확인
  async checkSetupStatus(
    deviceId: string,
  ): Promise<ApiResponse<SetupStatusResponse>> {
    return apiClient.get<ApiResponse<SetupStatusResponse>>(
      `/api/my/${deviceId}/weather-preference`,
    );
  },

  // 회원 탈퇴 (비활성화)
  async deactivateMember(
    deviceId: string,
  ): Promise<ApiResponse<MemberResponse>> {
    return apiClient.delete<ApiResponse<MemberResponse>>(`/api/my/${deviceId}`);
  },
};
