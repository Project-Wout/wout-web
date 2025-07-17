import { ReactionLevel } from '@/types/common';

// 민감도 관련 공통 타입
export interface ReactionLevels {
  reactionCold: ReactionLevel;
  reactionHeat: ReactionLevel;
  reactionHumidity: ReactionLevel;
  reactionUv: ReactionLevel;
  reactionAir: ReactionLevel;
}

// 중요도 관련 공통 타입
export interface ImportanceLevels {
  importanceCold: number;
  importanceHeat: number;
  importanceHumidity: number;
  importanceUv: number;
  importanceAir: number;
}

// types/member.ts
// 회원 생성 요청
export interface MemberCreateRequest {
  deviceId: string;
  nickname?: string;
  latitude?: number;
  longitude?: number;
  cityName?: string;
}

// 회원 상태 응답 (스플래시용)
export interface MemberStatusResponse {
  isSetupCompleted: boolean;
}

// 회원 응답
export interface MemberResponse {
  id: number;
  deviceId: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

// 닉네임 수정 요청
export interface NicknameUpdateRequest {
  nickname: string;
}

// 위치 수정 요청
export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
  cityName?: string;
}

// types/weather-preference.ts
// 날씨 선호도 설정 요청
export interface WeatherPreferenceSetupRequest
  extends ReactionLevels,
    ImportanceLevels {
  // 체감 온도 기준 (10-30℃)
  comfortTemperature: number;
}

// 날씨 선호도 응답
export interface WeatherPreferenceResponse
  extends ReactionLevels,
    ImportanceLevels {
  id: number;
  memberId: number;

  // 체감 온도 기준
  comfortTemperature: number;

  // 계산된 개인 보정치
  personalTempCorrection: number;

  // 생성/수정 시간
  createdAt: string;
  updatedAt: string;
}

// 날씨 선호도 수정 요청 (모든 필드 optional)
export interface WeatherPreferenceUpdateRequest
  extends Partial<ReactionLevels>,
    Partial<ImportanceLevels> {
  comfortTemperature?: number;
}

// 회원 + 선호도 통합 응답
export interface MemberWithPreferenceResponse {
  member: MemberResponse;
  weatherPreference?: WeatherPreferenceResponse;
}

// 설정 완료 상태 응답
export interface SetupStatusResponse {
  isSetupCompleted: boolean;
}

// types/constants.ts
// 우선순위 타입
export type WeatherPriority =
  | 'heat'
  | 'cold'
  | 'humidity'
  | 'wind'
  | 'uv'
  | 'pollution';
