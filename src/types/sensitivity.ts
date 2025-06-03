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

// 상태 관리용 인터페이스
export interface SensitivityState {
  // 현재 설정 단계
  currentStep: number;

  // 설정 데이터 (SensitivityData 확장)
  priorities: string[];
  comfortTemperature: number;
  skinReaction: 'high' | 'medium' | 'low' | null;
  humidityReaction: 'high' | 'medium' | 'low' | null;
  adjustments: {
    temp: number;
    humidity: number;
    uv: number;
    airquality: number;
  };
  isCompleted: boolean;

  // UI 상태
  isLoading: boolean;
  error: string | null;

  // 액션들
  setCurrentStep: (step: number) => void;
  setPriorities: (priorities: string[]) => void;
  setComfortTemperature: (temp: number) => void;
  setSkinReaction: (reaction: 'high' | 'medium' | 'low') => void;
  setHumidityReaction: (reaction: 'high' | 'medium' | 'low') => void;
  setAdjustments: (
    adjustments: Partial<SensitivityState['adjustments']>,
  ) => void;
  completeSetup: () => void;
  resetSetup: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
