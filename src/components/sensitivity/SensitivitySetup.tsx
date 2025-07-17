'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { useMemberStore } from '@/store/memberStore';
import NavigationButtons from './NavigationButtons';
import SensitivityStep1 from './steps/SensitivityStep1';
import SensitivityStep2 from './steps/SensitivityStep2';
import SensitivityStep3 from './steps/SensitivityStep3';
import type { WeatherPreferenceSetupRequest } from '@/types/member';

export default function SensitivitySetup() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  const {
    currentStep,
    step1,
    step2,
    step3,
    isLoading: sensitivityLoading,
    setCurrentStep,
  } = useSensitivityStore();

  const {
    setupWithPreference,
    updateWeatherPreference,
    isLoading: memberLoading,
  } = useMemberStore();

  const isLoading = sensitivityLoading || memberLoading;

  // 수정 모드 진입 시 1단계로 강제 초기화
  useEffect(() => {
    if (isEditMode) {
      setCurrentStep(1);
    }
  }, [isEditMode, setCurrentStep]);

  // 가중치 1-100 → 25-75 변환 함수
  const convertWeight = (frontendWeight: number): number => {
    const min = 25;
    const max = 75;
    const converted = min + ((frontendWeight - 1) * (max - min)) / 99;
    return Math.round(Math.max(min, Math.min(max, converted)));
  };

  const handleSetupComplete = async (): Promise<boolean> => {
    try {
      // ✅ 필수값 검증
      if (step3.importanceCold === undefined || step3.importanceCold === null) {
        throw new Error('온도 가중치는 필수입니다');
      }
      if (step3.importanceHeat === undefined || step3.importanceHeat === null) {
        throw new Error('습도 가중치는 필수입니다');
      }
      if (step3.importanceUv === undefined || step3.importanceUv === null) {
        throw new Error('자외선 가중치는 필수입니다');
      }
      if (step3.importanceAir === undefined || step3.importanceAir === null) {
        throw new Error('대기질 가중치는 필수입니다');
      }

      const request: WeatherPreferenceSetupRequest = {
        reactionCold: step1.reactionCold || 'medium',
        reactionHeat: step1.reactionHeat || 'medium',
        reactionHumidity: step1.reactionHumidity || 'medium',
        reactionUv: step1.reactionUv || 'medium',
        reactionAir: step1.reactionAir || 'medium',
        importanceCold: convertWeight(step3.importanceCold),
        importanceHeat: convertWeight(step3.importanceHeat),
        importanceHumidity: convertWeight(step3.importanceHumidity),
        importanceUv: convertWeight(step3.importanceUv),
        importanceAir: convertWeight(step3.importanceAir),
        comfortTemperature: Math.max(
          10,
          Math.min(30, step2.comfortTemperature),
        ),
      };

      // API 호출
      let success: boolean;
      if (isEditMode) {
        success = await updateWeatherPreference(request);
      } else {
        success = await setupWithPreference(request);
      }

      return success;
    } catch (error) {
      console.error('검증 실패:', error);
      return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SensitivityStep1
            onNext={() => setCurrentStep(2)}
            onPrev={() => setCurrentStep(1)}
          />
        );
      case 2:
        return (
          <SensitivityStep2
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(2)}
          />
        );
      case 3:
        return (
          <SensitivityStep3
            onComplete={handleSetupComplete}
            onPrev={() => setCurrentStep(2)}
          />
        );
      default:
        return (
          <SensitivityStep1
            onNext={() => setCurrentStep(2)}
            onPrev={() => setCurrentStep(1)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary text-white relative overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* 헤더 - 수정/신규 모드 구분 */}
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {isEditMode ? '민감도 재조정' : '날씨 민감도 설정'}
          </h1>
          <p className="text-blue-100">
            {isEditMode
              ? '개인 맞춤 추천을 위해 설정을 업데이트해요'
              : '개인 맞춤 추천을 위해 5단계 설정이 필요해요'}
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-100">{currentStep}/5 단계</span>
            <span className="text-sm text-blue-100">
              {Math.round((currentStep / 5) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 단계별 콘텐츠 */}
        <div className="flex-1 px-6 pb-6">
          <div className="bg-white rounded-xl p-6 text-gray-800 h-full flex flex-col">
            {renderCurrentStep()}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="px-6 pb-6">
          <NavigationButtons onComplete={handleSetupComplete} />
        </div>
      </div>

      {/* 로딩 오버레이 - 텍스트 구분 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-800 font-medium">
              {isEditMode ? '설정을 수정하는 중...' : '설정을 저장하는 중...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
