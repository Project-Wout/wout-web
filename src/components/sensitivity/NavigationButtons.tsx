'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { Button } from '@/components/ui/Button';

interface NavigationButtonsProps {
  onComplete: () => Promise<boolean>;
}

export default function NavigationButtons({
  onComplete,
}: NavigationButtonsProps) {
  const router = useRouter();
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

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleNext = async () => {
    if (currentStep === 5) {
      // 🚀 마지막 단계 - 백엔드 API 호출
      setIsSubmitting(true);

      try {
        const success = await onComplete();

        if (success) {
          // 로컬 상태도 완료로 변경 (UI 동기화용)
          completeSetup();

          // 성공 시 대시보드로 이동
          console.log('설정 완료 → 대시보드로 이동');
          router.push('/dashboard');
        } else {
          // 실패 시에도 일단 대시보드로 이동 (UX 고려)
          console.log('백엔드 저장 실패했지만 대시보드로 이동');
          completeSetup(); // 로컬에서라도 완료 처리
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('설정 완료 오류:', error);
        // 오류 시에도 대시보드로 이동 (사용자 경험 고려)
        completeSetup();
        router.push('/dashboard');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // 다음 단계로 이동
      nextStep();
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const getButtonText = () => {
    if (currentStep === 5) {
      if (isSubmitting) {
        return '저장 중...';
      }
      return '설정 완료';
    }
    return '다음';
  };

  return (
    <div className="flex gap-3 mt-8">
      {/* 이전 버튼 */}
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={handlePrev}
          className="flex-1"
          disabled={isSubmitting}
        >
          이전
        </Button>
      )}

      {/* 다음/완료 버튼 */}
      <Button
        variant="primary"
        onClick={handleNext}
        disabled={!isCurrentStepValid() || isSubmitting}
        className="flex-1"
      >
        {isSubmitting && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        )}
        {getButtonText()}
      </Button>
    </div>
  );
}
