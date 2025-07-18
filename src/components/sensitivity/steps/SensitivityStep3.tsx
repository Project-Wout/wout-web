'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Step3State } from '@/types/sensitivity';
import { useSensitivityStore } from '@/store/sensitivityStore';

interface ImportanceValues {
  importanceCold: number;
  importanceHeat: number;
  importanceHumidity: number;
  importanceUv: number;
  importanceAir: number;
}

interface ImportanceSliderData {
  key: keyof ImportanceValues;
  title: string;
  description: string;
  emoji: string;
}

interface Props {
  onComplete: (values: Step3State) => void;
  onPrev: () => void;
}

// 슬라이더 데이터 정의 (바람 제거, 추위/더위 분리)
const importanceSliders: ImportanceSliderData[] = [
  {
    key: 'importanceCold',
    title: '추위 중요도',
    description: '추운 날씨가 외출 계획에 얼마나 영향을 주나요?',
    emoji: '🧊',
  },
  {
    key: 'importanceHeat',
    title: '더위 중요도',
    description: '더운 날씨가 외출 계획에 얼마나 영향을 주나요?',
    emoji: '🔥',
  },
  {
    key: 'importanceHumidity',
    title: '습도 중요도',
    description: '습한 날씨가 내 컨디션에 크게 영향을 주나요?',
    emoji: '💧',
  },
  {
    key: 'importanceUv',
    title: '자외선 중요도',
    description: '자외선이 있으면 꼭 차단하고 싶거나 신경 쓰이나요?',
    emoji: '☀️',
  },
  {
    key: 'importanceAir',
    title: '대기질 중요도',
    description: '미세먼지, 황사, 꽃가루가 외출 계획에 영향을 주나요?',
    emoji: '🌫️',
  },
];

export default function SensitivityStep3({ onComplete, onPrev }: Props) {
  const { step3, setStep3 } = useSensitivityStore();

  const handleSliderChange = (key: keyof Step3State, value: number) => {
    setStep3({ ...step3, [key]: value / 100 }); // 1~100 슬라이더 값을 0~1로 변환하여 저장
  };

  // 퍼센트 값을 0-1 사이 값으로 변환하여 전송
  const handleComplete = () => {
    onComplete(step3);
  };

  // 점수 레벨 텍스트
  const getScoreText = (score: number) => {
    if (score >= 80) return '매우 높음';
    if (score >= 60) return '높음';
    if (score >= 40) return '보통';
    if (score >= 20) return '낮음';
    return '매우 낮음';
  };

  return (
    <div className="h-full flex flex-col">
      {/* 메인 콘텐츠 */}
      <Card
        variant="elevated"
        padding="lg"
        className="mb-6 text-gray-900 flex-1 overflow-y-auto"
      >
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold mb-2">날씨 영향도 조정</h2>
          <p className="text-gray-600 text-sm">
            더 정확한 날씨점수를 위한 세부 조정 (선택사항)
          </p>
        </CardHeader>

        <CardContent>
          {/* 안내 박스 */}
          <Card
            variant="outlined"
            padding="md"
            className="bg-orange-50 border-orange-200 text-center mb-6"
          >
            <div className="text-orange-600 font-semibold text-sm mb-2 flex items-center justify-center gap-1">
              📊 날씨 요소별 영향도 설정
            </div>
            <div className="text-orange-800 text-xs leading-relaxed">
              각 요소가 내 기분과 외출 의지에
              <br />
              얼마나 큰 영향을 주는지 설정해주세요
            </div>
          </Card>

          {/* 슬라이더들 */}
          <div className="space-y-6">
            {importanceSliders.map((slider, index) => (
              <motion.div
                key={slider.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="outlined"
                  padding="md"
                  hover
                  className="transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{slider.emoji}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">
                          {slider.title}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          {slider.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* 범위 라벨 */}
                    <div className="flex justify-between text-gray-500 text-xs font-semibold mb-3">
                      <span>별로 신경 안써요</span>
                      <span>매우 중요해요</span>
                    </div>

                    {/* 슬라이더 */}
                    <div className="mb-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={step3[slider.key] * 100}
                        onChange={e =>
                          handleSliderChange(
                            slider.key,
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full h-2 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-600 rounded appearance-none cursor-pointer slider"
                      />
                      <style jsx>{`
                        .slider::-webkit-slider-thumb {
                          appearance: none;
                          width: 24px;
                          height: 24px;
                          border-radius: 50%;
                          background: white;
                          border: 3px solid #f97316;
                          cursor: pointer;
                          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
                          transition: all 0.2s ease;
                        }
                        .slider::-webkit-slider-thumb:hover {
                          transform: scale(1.1);
                          box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5);
                        }
                        .slider::-moz-range-thumb {
                          width: 24px;
                          height: 24px;
                          border-radius: 50%;
                          background: white;
                          border: 3px solid #f97316;
                          cursor: pointer;
                          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
                          border: none;
                        }
                      `}</style>
                    </div>

                    {/* 값 표시 */}
                    <div className="text-center">
                      <span className="inline-block bg-orange-100 border border-orange-200 px-3 py-1 rounded-lg text-orange-700 font-semibold text-sm">
                        {getScoreText(step3[slider.key] * 100)} (
                        {step3[slider.key] * 100})
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 최종 안내 */}
          <Card
            variant="outlined"
            padding="sm"
            className="bg-blue-50 border-l-4 border-blue-500 mt-6"
          >
            <p className="text-blue-600 text-sm text-center">
              💡 설정은 언제든지 변경할 수 있고, 사용할수록 더 정확해져요
            </p>
          </Card>
        </CardContent>
      </Card>

      {/* 네비게이션 버튼 */}
      {/* 네비게이션 버튼 렌더링 부분(이전/설정 완료 버튼) 전체 삭제 */}
    </div>
  );
}
