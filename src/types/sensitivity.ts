import { ReactionLevel } from '@/types/common';

// 기본 민감도 데이터 타입
export interface SensitivityData {
  // 우선순위 (2개 선택)
  priorities: string[];

  // 쾌적 온도
  comfortTemperature: number;

  // 반응 수준
  skinReaction: 'high' | 'medium' | 'low' | null;
  humidityReaction: 'high' | 'medium' | 'low' | null;

  // 세부 조정
  adjustments: {
    temp: number;
    humidity: number;
    uv: number;
    airquality: number;
  };

  // 완료 상태
  isCompleted: boolean;
}

export interface SensitivityState {
  // ✅ 1단계: 민감도
  reactionCold: ReactionLevel | null;
  reactionHeat: ReactionLevel | null;
  reactionHumidity: ReactionLevel | null;
  reactionUv: ReactionLevel | null;
  reactionAir: ReactionLevel | null;

  // ✅ 2단계: 체감온도
  comfortTemperature: number;

  // ✅ 3단계: 중요도
  importanceCold: number;
  importanceHeat: number;
  importanceHumidity: number;
  importanceUv: number;
  importanceAir: number;

  // ✅ 상태
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;

  // ✅ 액션
  setReactionLevel: (key: keyof Pick<SensitivityState, 'reactionCold' | 'reactionHeat' | 'reactionHumidity' | 'reactionUv' | 'reactionAir'>, value: ReactionLevel) => void;
  setComfortTemperature: (temp: number) => void;
  setImportance: (key: keyof Pick<SensitivityState, 'importanceCold' | 'importanceHeat' | 'importanceHumidity' | 'importanceUv' | 'importanceAir'>, value: number) => void;

  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  completeSetup: () => void;
  resetSetup: () => void;
}