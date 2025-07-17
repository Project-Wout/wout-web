import { ReactionLevel } from '@/types/common';

/* ------------------------------------------------------------------ */
/* 👝  STEP-WISE “파우치” 구조                                          */
/* ------------------------------------------------------------------ */

/** ① 요소별 반응(민감도) */
export interface Step1State {
  reactionCold: ReactionLevel | null;
  reactionHeat: ReactionLevel | null;
  reactionHumidity: ReactionLevel | null;
  reactionUv: ReactionLevel | null;
  reactionAir: ReactionLevel | null;
}

/** ② 개인 쾌적 온도 */
export interface Step2State {
  comfortTemperature: number; // 10 ~ 30 °C 슬라이더 값
}

/** ③ 요소별 영향도 (0 ~ 1 값으로 노멀라이즈) */
export interface Step3State {
  importanceCold: number;
  importanceHeat: number;
  importanceHumidity: number;
  importanceUv: number;
  importanceAir: number;
}

/* ------------------------------------------------------------------ */
/* 🚀 전체 상태                         */
/* ------------------------------------------------------------------ */

export interface SensitivityState {
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;

  /** 진행 상황 */
  currentStep: 1 | 2 | 3;
  isLoading: boolean;
  error: string | null;
  isCompleted: boolean;
}

/* ------------------------------------------------------------------ */
/* (선택) 최종 DTO – 백엔드 전송용                                     */
/* ------------------------------------------------------------------ */

export interface SensitivityData {
  /* step1 + step2 + step3 필드 ↓ 한 번에 담아 전송 */
  reactionCold: ReactionLevel | null;
  reactionHeat: ReactionLevel | null;
  reactionHumidity: ReactionLevel | null;
  reactionUv: ReactionLevel | null;
  reactionAir: ReactionLevel | null;

  comfortTemperature: number;

  importanceCold: number;
  importanceHeat: number;
  importanceHumidity: number;
  importanceUv: number;
  importanceAir: number;

  /** 세부 조정(추후 확장) */
  adjustments: {
    temp: number;
    humidity: number;
    uv: number;
    airquality: number;
  };

  /** 완료 여부 */
  isCompleted: boolean;
}

/* ------------------------------------------------------------------ */
/* 🎁 초기값 헬퍼 – import 해서 사용하면 편함                           */
/* ------------------------------------------------------------------ */

export const initialSensitivityState: SensitivityState = {
  step1: {
    reactionCold: null,
    reactionHeat: null,
    reactionHumidity: null,
    reactionUv: null,
    reactionAir: null,
  },
  step2: { comfortTemperature: 19 },
  step3: {
    importanceCold: 0.2,
    importanceHeat: 0.2,
    importanceHumidity: 0.2,
    importanceUv: 0.2,
    importanceAir: 0.2,
  },
  currentStep: 1,
  isLoading: false,
  error: null,
  isCompleted: false,
};
