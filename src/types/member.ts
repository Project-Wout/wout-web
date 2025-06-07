// 회원 생성 요청
export interface MemberCreateRequest {
  deviceId: string;
  nickname?: string;
  latitude?: number;
  longitude?: number;
  cityName?: string;
}

// 🆕 회원 상태 응답 (스플래시용)
export interface MemberStatusResponse {
  memberExists: boolean;
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

// 날씨 선호도 설정 요청 (5단계)
export interface WeatherPreferenceSetupRequest {
  // 1단계: 우선순위 (괴로운 날씨 2개 선택)
  priorityFirst?: string;
  prioritySecond?: string;

  // 2단계: 체감온도 기준점
  comfortTemperature: number;

  // 3단계: 피부 반응
  skinReaction?: string;

  // 4단계: 습도 민감도
  humidityReaction?: string;

  // 5단계: 세부 조정 (선택사항)
  temperatureWeight?: number;
  humidityWeight?: number;
  windWeight?: number;
  uvWeight?: number;
  airQualityWeight?: number;
}

// 날씨 선호도 응답
export interface WeatherPreferenceResponse {
  id: number;
  memberId: number;
  priorityFirst?: string;
  prioritySecond?: string;
  comfortTemperature: number;
  skinReaction?: string;
  humidityReaction?: string;
  temperatureWeight: number;
  humidityWeight: number;
  windWeight: number;
  uvWeight: number;
  airQualityWeight: number;
  isSetupCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 회원 + 선호도 통합 응답
export interface MemberWithPreferenceResponse {
  member: MemberResponse;
  weatherPreference?: WeatherPreferenceResponse;
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

// 날씨 선호도 수정 요청
export interface WeatherPreferenceUpdateRequest {
  priorityFirst?: string;
  prioritySecond?: string;
  comfortTemperature?: number;
  skinReaction?: string;
  humidityReaction?: string;
  temperatureWeight?: number;
  humidityWeight?: number;
  windWeight?: number;
  uvWeight?: number;
  airQualityWeight?: number;
}

// 설정 완료 상태 응답
export interface SetupStatusResponse {
  isSetupCompleted: boolean;
}

// 우선순위 타입
export type WeatherPriority =
  | 'heat'
  | 'cold'
  | 'humidity'
  | 'wind'
  | 'uv'
  | 'pollution';

// 반응 수준 타입
export type ReactionLevel = 'high' | 'medium' | 'low';

// 우선순위 옵션 정의
export const PRIORITY_OPTIONS: Record<WeatherPriority, string> = {
  heat: '찜통더위',
  cold: '꽁꽁추위',
  humidity: '눅눅습함',
  wind: '바람쌩쌩',
  uv: '따가운햇빛',
  pollution: '뿌연공기',
};

// 반응 수준 옵션 정의
export const REACTION_LEVEL_OPTIONS: Record<ReactionLevel, string> = {
  high: '매우 민감함',
  medium: '보통',
  low: '둔감함',
};
