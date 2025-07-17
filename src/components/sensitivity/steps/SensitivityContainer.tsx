'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SensitivityStep1 from './SensitivityStep1';
import SensitivityStep2 from './SensitivityStep2';
import SensitivityStep3 from './SensitivityStep3';
import {
  Step1State,
  Step2State,
  Step3State,
  SensitivityData,
} from '@/types/sensitivity';

export default function SensitivityContainer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // 단계별 값만 따로 관리
  const [step1, setStep1] = useState<Step1State | null>(null);
  const [step2, setStep2] = useState<Step2State | null>(null);
  const [step3, setStep3] = useState<Step3State | null>(null);

  // 1단계 완료
  const handleStep1Complete = (data: Step1State) => {
    setStep1(data);
    setCurrentStep(2);
  };

  // 2단계 완료
  const handleStep2Complete = (data: Step2State) => {
    setStep2(data);
    setCurrentStep(3);
  };

  // 3단계 완료(최종 제출)
  const handleStep3Complete = async (data: Step3State) => {
    setStep3(data);

    if (!step1 || !step2) {
      alert('이전 단계 데이터가 누락되었습니다.');
      return;
    }

    // 최종 데이터 합치기 (신버전 정책에 맞게 priorities/adjustments 기본값, isCompleted true)
    const finalData: SensitivityData = {
      ...step1,
      ...step2,
      ...data,
      adjustments: { temp: 0, humidity: 0, uv: 0, airquality: 0 }, // 신버전: 영향도 슬라이더로 대체, 기본값
      isCompleted: true,
    };

    // 서버 전송 등 처리
    // await apiCall(finalData);
    // router.push('/dashboard');
  };

  // 단계별 렌더링
  return (
    <>
      {currentStep === 1 && (
        <SensitivityStep1
          onNext={handleStep1Complete}
          onPrev={() => router.push('/onboarding')}
        />
      )}
      {currentStep === 2 && (
        <SensitivityStep2
          onNext={handleStep2Complete}
          onPrev={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && (
        <SensitivityStep3
          onComplete={handleStep3Complete}
          onPrev={() => setCurrentStep(2)}
        />
      )}
    </>
  );
}
