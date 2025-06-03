'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSensitivityStore } from '@/store/sensitivityStore';
import { useMemberStore } from '@/store/memberStore';
import SensitivitySetup from '@/components/sensitivity/SensitivitySetup';
import type {
  WeatherPreferenceSetupRequest,
  WeatherPriority,
  ReactionLevel,
} from '@/types/member';

export default function SensitivitySetupPage() {
  const router = useRouter();
  const {
    isCompleted,
    priorities,
    comfortTemperature,
    skinReaction,
    humidityReaction,
    adjustments,
  } = useSensitivityStore();

  const { saveWeatherPreference } = useMemberStore();

  // useCallback으로 함수를 메모이제이션
  const handleSetupComplete = useCallback(async () => {
    try {
      console.log('민감도 설정 완료 → 백엔드 저장 시작');

      // 프론트엔드 데이터를 백엔드 형식으로 변환 (정확한 타입 매핑)
      const request: WeatherPreferenceSetupRequest = {
        // 우선순위: 백엔드 enum과 일치하는 값으로 변환
        priorityFirst: (priorities[0] as WeatherPriority) || null,
        prioritySecond: (priorities[1] as WeatherPriority) || null,

        // 체감온도: 필수값
        comfortTemperature: comfortTemperature,

        // 반응 수준: 백엔드 enum과 일치하는 값으로 변환
        skinReaction: (skinReaction as ReactionLevel) || null,
        humidityReaction: (humidityReaction as ReactionLevel) || null,

        // 가중치: 기본값 50 적용
        temperatureWeight: adjustments.temp || 50,
        humidityWeight: adjustments.humidity || 50,
        windWeight: 50, // 프론트에서 설정하지 않으므로 기본값
        uvWeight: adjustments.uv || 50,
        airQualityWeight: adjustments.airquality || 50,
      };

      console.log('현재 민감도 데이터:', {
        priorities,
        comfortTemperature,
        skinReaction,
        humidityReaction,
        adjustments,
      });

      console.log('백엔드 전송 데이터:', request);

      // 백엔드 검증 규칙 확인
      if (request.comfortTemperature < 10 || request.comfortTemperature > 30) {
        throw new Error('체감온도는 10도에서 30도 사이여야 합니다');
      }

      // 백엔드에 저장
      const success = await saveWeatherPreference(request);

      if (success) {
        console.log('백엔드 저장 완료 → 메인 대시보드로 이동');
        router.push('/dashboard');
      } else {
        console.error('백엔드 저장 실패, 그래도 대시보드로 이동');
        // 실패해도 대시보드로 이동 (로컬 데이터는 있으니까)
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('설정 완료 처리 오류:', error);
      // 오류 발생해도 대시보드로 이동
      router.push('/dashboard');
    }
  }, [
    priorities,
    comfortTemperature,
    skinReaction,
    humidityReaction,
    adjustments,
    saveWeatherPreference,
    router,
  ]);

  // 설정 완료 시 백엔드 저장 후 대시보드로 이동
  useEffect(() => {
    if (isCompleted) {
      handleSetupComplete();
    }
  }, [isCompleted, handleSetupComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <SensitivitySetup />
    </div>
  );
}
