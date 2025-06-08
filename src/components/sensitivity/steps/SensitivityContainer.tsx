'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMemberStore } from '@/store/memberStore';
import SensitivityStep1 from './SensitivityStep1';
import SensitivityStep2 from './SensitivityStep2';
import SensitivityStep3 from './SensitivityStep3';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { ReactionLevel } from '@/types/member';

interface SensitivityData {
    reactionCold: ReactionLevel;
    reactionHeat: ReactionLevel;
    reactionHumidity: ReactionLevel;
    reactionUv: ReactionLevel;
    reactionAir: ReactionLevel;
}

interface ImportanceData {
    importanceCold: number;
    importanceHeat: number;
    importanceHumidity: number;
    importanceUv: number;
    importanceAir: number;
}

interface WeatherPreferenceSetupRequest {
    // Step 1: 민감도
    reactionCold: ReactionLevel;
    reactionHeat: ReactionLevel;
    reactionHumidity: ReactionLevel;
    reactionUv: ReactionLevel;
    reactionAir: ReactionLevel;
    // Step 2: 체감온도
    comfortTemperature: number;
    // Step 3: 중요도
    importanceCold: number;
    importanceHeat: number;
    importanceHumidity: number;
    importanceUv: number;
    importanceAir: number;
}

export default function SensitivityContainer() {
    const router = useRouter();
    const { setupWithPreference } = useMemberStore();

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // 각 단계별 데이터 저장
    const [sensitivityData, setSensitivityData] = useState<SensitivityData | null>(null);
    const [temperatureData, setTemperatureData] = useState<number | null>(null);
    const [importanceData, setImportanceData] = useState<ImportanceData | null>(null);

    // Step 1 완료
    const handleStep1Complete = useCallback((data: SensitivityData) => {
        console.log('Step 1 완료:', data);
        setSensitivityData(data);
        setCurrentStep(2);
    },[]);

    // Step 2 완료
    const handleStep2Complete = (temperature: number) => {
        console.log('Step 2 완료:', temperature);
        setTemperatureData(temperature);
        setCurrentStep(3);
    };

    // Step 3 완료 (최종 제출)
    const handleStep3Complete = async (importance: ImportanceData) => {
        console.log('Step 3 완료:', importance);
        setImportanceData(importance);

        if (!sensitivityData || temperatureData === null) {
            console.error('이전 단계 데이터가 누락됨');
            return;
        }

        try {
            setIsLoading(true);

            // 최종 요청 데이터 구성
            const requestData: WeatherPreferenceSetupRequest = {
                // Step 1: 민감도
                reactionCold: sensitivityData.reactionCold,
                reactionHeat: sensitivityData.reactionHeat,
                reactionHumidity: sensitivityData.reactionHumidity,
                reactionUv: sensitivityData.reactionUv,
                reactionAir: sensitivityData.reactionAir,
                // Step 2: 체감온도
                comfortTemperature: temperatureData,
                // Step 3: 중요도
                importanceCold: importance.importanceCold,
                importanceHeat: importance.importanceHeat,
                importanceHumidity: importance.importanceHumidity,
                importanceUv: importance.importanceUv,
                importanceAir: importance.importanceAir
            };

            console.log('최종 제출 데이터:', requestData);

            // API 호출
            const success = await setupWithPreference(requestData);

            if (success) {
                console.log('민감도 설정 완료 - 대시보드로 이동');
                router.push('/dashboard');
            } else {
                console.error('민감도 설정 실패');
                alert('설정 저장에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('민감도 설정 중 오류:', error);
            alert('설정 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    // 이전 단계로
    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            // 첫 번째 단계에서 이전 버튼 - 온보딩으로 돌아가기
            router.push('/onboarding');
        }
    };

    // 로딩 화면
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 flex items-center justify-center">
                <Card variant="elevated" padding="lg" className="text-center max-w-sm w-full mx-6">
                    <CardContent>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">설정을 저장하고 있어요</h2>
                        <p className="text-gray-600">잠시만 기다려주세요...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 단계별 렌더링
    return (
        <>
            {currentStep === 1 && (
                <SensitivityStep1
                    onNext={handleStep1Complete}
                    onPrev={handlePreviousStep}
                />
            )}

            {currentStep === 2 && (
                <SensitivityStep2
                    onNext={handleStep2Complete}
                    onPrev={handlePreviousStep}
                    initialValue={temperatureData || 19}
                />
            )}

            {currentStep === 3 && (
                <SensitivityStep3
                    onComplete={handleStep3Complete}
                    onPrev={handlePreviousStep}
                />
            )}
        </>
    );
}