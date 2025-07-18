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
    setStep1,
    setStep2,
    setStep3,
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

  // 가중치 1-100 → 1-100 변환 함수 (백엔드 요구사항에 맞춤)
  const convertWeight = (frontendWeight: number): number => {
    // 0~1 실수 값을 1~100 정수로 변환
    return Math.round(Math.max(1, Math.min(100, frontendWeight * 100)));
  };

  // 중요도 값들을 정규화(합계 100) 함수
  const normalizeTo100 = (values: Record<string, number>) => {
    const sum = Object.values(values).reduce((acc, v) => acc + v, 0);
    if (sum === 0) return values;
    let normalized: Record<string, number> = {};
    Object.entries(values).forEach(([key, value]) => {
      normalized[key] = Math.round((value / sum) * 100);
    });
    // 0을 1로 보정
    Object.keys(normalized).forEach(key => {
      if (normalized[key] < 1) normalized[key] = 1;
    });
    // 합계가 100이 넘으면 가장 큰 값에서 빼기
    let total = Object.values(normalized).reduce((a, b) => a + b, 0);
    while (total > 100) {
      const maxKey = Object.keys(normalized).reduce((a, b) =>
        normalized[a] > normalized[b] ? a : b,
      );
      normalized[maxKey] -= 1;
      total--;
    }
    // 합계가 100 미만이면 가장 큰 값에 더하기
    while (total < 100) {
      const maxKey = Object.keys(normalized).reduce((a, b) =>
        normalized[a] > normalized[b] ? a : b,
      );
      normalized[maxKey] += 1;
      total++;
    }
    return normalized;
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
      if (
        step3.importanceHumidity === undefined ||
        step3.importanceHumidity === null
      ) {
        throw new Error('습도 가중치는 필수입니다');
      }
      if (step3.importanceUv === undefined || step3.importanceUv === null) {
        throw new Error('자외선 가중치는 필수입니다');
      }
      if (step3.importanceAir === undefined || step3.importanceAir === null) {
        throw new Error('대기질 가중치는 필수입니다');
      }

      // 중요도 값들을 변환 및 정규화
      const normalized = normalizeTo100({
        importanceCold: step3.importanceCold,
        importanceHeat: step3.importanceHeat,
        importanceHumidity: step3.importanceHumidity,
        importanceUv: step3.importanceUv,
        importanceAir: step3.importanceAir,
      });
      const importanceCold = normalized.importanceCold;
      const importanceHeat = normalized.importanceHeat;
      const importanceHumidity = normalized.importanceHumidity;
      const importanceUv = normalized.importanceUv;
      const importanceAir = normalized.importanceAir;

      // 합계 검증 (98~102)
      const totalImportance =
        importanceCold +
        importanceHeat +
        importanceHumidity +
        importanceUv +
        importanceAir;
      if (totalImportance < 98 || totalImportance > 102) {
        throw new Error(
          `중요도 합계가 98~102 사이여야 합니다. 현재: ${totalImportance}`,
        );
      }

      const request: WeatherPreferenceSetupRequest = {
        reactionCold: step1.reactionCold || 'medium',
        reactionHeat: step1.reactionHeat || 'medium',
        reactionHumidity: step1.reactionHumidity || 'medium',
        reactionUv: step1.reactionUv || 'medium',
        reactionAir: step1.reactionAir || 'medium',
        importanceCold,
        importanceHeat,
        importanceHumidity,
        importanceUv,
        importanceAir,
        comfortTemperature: Math.max(
          10,
          Math.min(30, step2.comfortTemperature),
        ),
      };

      // 디버깅용 로그
      console.log('백엔드로 전송할 데이터:', request);
      console.log('중요도 합계:', totalImportance);
      console.log('step3:', step3);
      console.log('importanceCold:', step3.importanceCold);
      console.log('importanceHeat:', step3.importanceHeat);
      console.log('importanceHumidity:', step3.importanceHumidity);
      console.log('importanceUv:', step3.importanceUv);
      console.log('importanceAir:', step3.importanceAir);

      // API 호출
      let success: boolean;
      if (isEditMode) {
        console.log('수정 모드: updateWeatherPreference 호출');
        success = await updateWeatherPreference(request);
      } else {
        console.log(
          '신규 모드: setupWithPreference 호출 (회원 생성 + 민감도 설정)',
        );
        success = await setupWithPreference(request);
      }

      console.log('API 호출 결과:', success);
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
            onNext={data => {
              setStep1(data);
              setTimeout(() => setCurrentStep(2), 0);
            }}
            onPrev={() => setCurrentStep(1)}
          />
        );
      case 2:
        return (
          <SensitivityStep2
            onNext={data => {
              setStep2(data);
              setTimeout(() => setCurrentStep(3), 0);
            }}
            onPrev={() => setCurrentStep(2)}
          />
        );
      case 3:
        return (
          <SensitivityStep3
            onComplete={data => {
              setStep3(data);
              // 기존 handleSetupComplete는 NavigationButtons에서 호출됨
            }}
            onPrev={() => setCurrentStep(2)}
          />
        );
      default:
        return (
          <SensitivityStep1
            onNext={data => {
              setStep1(data);
              setTimeout(() => setCurrentStep(2), 0);
            }}
            onPrev={() => setCurrentStep(1)}
          />
        );
    }
  };

  useEffect(() => {
    console.log('currentStep:', currentStep);
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
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
              : '개인 맞춤 추천을 위해 3단계 설정이 필요해요'}
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-100">{currentStep}/3 단계</span>
            <span className="text-sm text-blue-100">
              {Math.round((currentStep / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
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
