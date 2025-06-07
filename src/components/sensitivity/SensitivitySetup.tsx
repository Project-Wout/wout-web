'use client';

import { useSensitivityStore } from '@/store/sensitivityStore';
import { useMemberStore } from '@/store/memberStore';
import NavigationButtons from './NavigationButtons';
import Step1PrioritySelection from './steps/Step1PrioritySelection';
import Step2TemperatureSlider from './steps/Step2TemperatureSlider';
import Step3SkinReaction from './steps/Step3SkinReaction';
import Step4HumidityReaction from './steps/Step4HumidityReaction';
import Step5AdjustmentSliders from './steps/Step5AdjustmentSliders';
import type { WeatherPreferenceSetupRequest } from '@/types/member';

export default function SensitivitySetup() {
  const {
    currentStep,
    priorities,
    comfortTemperature,
    skinReaction,
    humidityReaction,
    adjustments,
    isLoading: sensitivityLoading,
  } = useSensitivityStore();

  const { setupWithPreference, isLoading: memberLoading } = useMemberStore();

  const isLoading = sensitivityLoading || memberLoading;

  // 🔧 민감도 설정 완료 처리 (백엔드 API 호출)
  const handleSetupComplete = async (): Promise<boolean> => {
    try {
      console.log('민감도 설정 완료 → 백엔드 API 호출 시작');

      // 프론트엔드 데이터를 백엔드 형식으로 변환
      const request: WeatherPreferenceSetupRequest = {
        // 1단계: 우선순위 (최대 2개)
        priorityFirst: priorities[0] || undefined,
        prioritySecond: priorities[1] || undefined,

        // 2단계: 체감온도 (필수값)
        comfortTemperature: comfortTemperature,

        // 3단계: 피부 반응
        skinReaction: skinReaction || undefined,

        // 4단계: 습도 반응
        humidityReaction: humidityReaction || undefined,

        // 5단계: 세부 조정 (기본값 50 적용)
        temperatureWeight: adjustments.temp || 50,
        humidityWeight: adjustments.humidity || 50,
        windWeight: 50, // 프론트에서 설정하지 않으므로 기본값
        uvWeight: adjustments.uv || 50,
        airQualityWeight: adjustments.airquality || 50,
      };

      console.log('백엔드 전송 데이터:', request);

      // 백엔드 검증 규칙 확인
      if (request.comfortTemperature < 10 || request.comfortTemperature > 30) {
        throw new Error('체감온도는 10도에서 30도 사이여야 합니다');
      }

      // 🚀 백엔드에 민감도 설정 + 회원 생성 요청
      const success = await setupWithPreference(request);

      if (success) {
        console.log('백엔드 저장 완료');
        return true;
      } else {
        console.error('백엔드 저장 실패');
        return false;
      }
    } catch (error) {
      console.error('설정 완료 처리 오류:', error);
      return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PrioritySelection />;
      case 2:
        return <Step2TemperatureSlider />;
      case 3:
        return <Step3SkinReaction />;
      case 4:
        return <Step4HumidityReaction />;
      case 5:
        return <Step5AdjustmentSliders />;
      default:
        return <Step1PrioritySelection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-primary text-white relative overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">날씨 민감도 설정</h1>
          <p className="text-blue-100">
            개인 맞춤 추천을 위해 5단계 설정이 필요해요
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

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-800 font-medium">설정을 저장하는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
