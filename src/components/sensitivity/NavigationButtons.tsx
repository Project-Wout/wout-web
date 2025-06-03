'use client';

import { useSensitivityStore } from '@/store/sensitivityStore';
import { Button } from '@/components/ui/Button';

export default function NavigationButtons() {
  const {
    currentStep,
    priorities,
    comfortTemperature,
    skinReaction,
    humidityReaction,
    completeSetup,
    nextStep,
    prevStep,
  } = useSensitivityStore();

  // 현재 단계 유효성 검사
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return priorities.length === 2;
      case 2:
        return comfortTemperature >= 10 && comfortTemperature <= 30;
      case 3:
        return skinReaction !== null;
      case 4:
        return humidityReaction !== null;
      case 5:
        return true; // 5단계는 선택사항
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 5) {
      // 마지막 단계에서는 설정 완료
      completeSetup();
    } else {
      // 다음 단계로 이동
      nextStep();
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  return (
    <div className="flex gap-3 mt-8">
      {/* 이전 버튼 */}
      {currentStep > 1 && (
        <Button variant="outline" onClick={handlePrev} className="flex-1">
          이전
        </Button>
      )}

      {/* 다음/완료 버튼 */}
      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!isCurrentStepValid()}
        className="flex-1"
      >
        {currentStep === 5 ? '설정 완료' : '다음'}
      </Button>
    </div>
  );
}
